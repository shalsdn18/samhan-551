// 백제 MQ-03 어전회의와 관산성 작전회의 시범 구현.
// 선택 효과는 기존 회의·전투 처리기에 넘기고, 이 모듈은 장면 흐름만 관리한다.
export function installCouncilMeetingPrototype(api) {
  const { state, $, narrative, tactics, escapeHtml, addLog, renderAll, chronicle, saveCampaign } = api;
  const runWarCouncil = api.openCouncilDebate;
  const approveCouncil = api.approveCouncil;
  const runBattle = api.openBattle;
  const runLoad = api.loadCampaign;
  const runArchive = api.renderStoryArchive;
  let replay = null;
  let replaySnapshot = null;

  const questState = () => {
    state.quests.meetingHistory ??= [];
    state.quests.operationBattleKeys ??= [];
    return state.quests;
  };
  const currentMeeting = () => replay || questState().activeMeeting;
  const battleKey = battle => [battle.attackerId, battle.defenderId].sort().join('|') + '@' + battle.tileKey;
  const assignmentOf = id => state.armies.find(army => army.commanderId === id || army.subCommanderId === id);
  function attendee(id, name, battle = null) {
    const general = state.generals?.find(item => item.id === id);
    const dead = general?.alive === false || state.quests.generalDeaths?.includes(id);
    const assigned = general && assignmentOf(id);
    const isBattleArmy = assigned && battle && (assigned.id === battle.attackerId || assigned.id === battle.defenderId);
    const available = Boolean(general && !dead && (!assigned || isBattleArmy));
    const assignment = assigned ? `${assigned.name} (${assigned.troops.toLocaleString()}명, (${assigned.q},${assigned.r}))` : null;
    return { id, name, available, assignment, report: !available ? (dead ? `${name}의 전사·이탈이 확인되어 대체 보고로 진행합니다.` : assignment ? `${name} 장군은 ${assignment}에 배치되어 참석하지 못합니다. 현장 보고로 대신합니다.` : `${name}은(는) 현재 참석할 수 없어 대체 보고로 진행합니다.`) : null };
  }
  function courtAttendees() {
    const list = [attendee('seongwang', '성왕'), attendee('yeochang', '태자 여창'), attendee('haegu', '해구'), attendee('mokhyemanchi', '목협만치'), attendee('sabeopmyeong', '사법명')];
    if (state.quests.seongwangAlive === false) list[0] = { id: 'seongwang', name: '성왕', available: false, report: '성왕은 현재 조정에 참석할 수 없어 태자 여창이 안건을 주재합니다.' };
    if (state.quests.yeochangAlive === false) list[1] = { id: 'yeochang', name: '태자 여창', available: false, report: '태자 여창의 부재로 왕실 측 기록관이 의견을 대독합니다.' };
    return list;
  }
  function operationAttendees(battle) {
    return [attendee('yeochang', '태자 여창', battle), attendee('haegu', '해구', battle), attendee('mokhyemanchi', '목협만치', battle), attendee('jinmu', '진무', battle)];
  }
  function battleSituation(battle) {
    const attacker = state.armies.find(item => item.id === battle.attackerId);
    const defender = state.armies.find(item => item.id === battle.defenderId);
    const tile = state.tiles[battle.tileKey];
    return { attacker, defender, tile };
  }
  function factionName(id) { return ({ SILLA: '신라', BAEKJE: '백제', GOGURYEO: '고구려', GAYA: '대가야' })[id] || '세력 미상'; }
  function openWarMeeting(plan) {
    state.pendingWarPlan = plan;
    const session = { id: 'BAEKJE-MQ03', kind: 'court', stage: 'agenda', turn: state.turn, plan, attendees: courtAttendees(), choiceId: null, questionId: null, questionsAsked: [], questionAnswers: {} };
    session.factsSnapshot = { nationalGold: state.nationalGold, nationalFood: state.nationalFood, warJustification: state.warJustification, baekjeTroops: state.armies.filter(army => army.owner === 'BAEKJE').reduce((sum, army) => sum + army.troops, 0) };
    session.situationSnapshot = situationText(session);
    questState().activeMeeting = session;
    state.quests.pendingScene = `MEETING:${session.id}`;
    state.eventOpen = true;
    renderMeeting();
  }
  function canOpenOperation(battle) {
    const { attacker, defender, tile } = battleSituation(battle);
    const q = questState();
    return state.started && state.playerFaction === 'BAEKJE' && q.mainIndex === 3 && !q.completed.has('MQ-04') && tile?.node?.id === 'gwansan' && attacker && defender && new Set([attacker.owner, defender.owner]).has('BAEKJE') && new Set([attacker.owner, defender.owner]).has('SILLA') && !q.operationBattleKeys.includes(battleKey(battle));
  }
  function openOperationMeeting(battle) {
    const attendees = operationAttendees(battle);
    const required = attendees.filter(item => item.id === 'mokhyemanchi' || item.id === 'jinmu');
    if (!required.some(item => item.available)) return false;
    const session = { id: 'BAEKJE-GWANSAN-OPS', kind: 'operation', stage: 'agenda', turn: state.turn, battle, attendees, choiceId: null, questionId: null, questionsAsked: [], questionAnswers: {} };
    const { attacker, defender, tile } = battleSituation(battle);
    session.factsSnapshot = { attackerName: attacker?.name, defenderName: defender?.name, attackerTroops: attacker?.troops || 0, defenderTroops: defender?.troops || 0, attackerOwner: attacker?.owner, defenderOwner: defender?.owner, baekjeSupplied: attacker?.owner === 'BAEKJE' ? Boolean(attacker?.supplied) : Boolean(defender?.supplied), tileName: tile?.node?.name || '관산성 전장', boeunOwner: Object.values(state.tiles).find(item => item.node?.id === 'boeun')?.owner || null };
    session.situationSnapshot = situationText(session);
    questState().activeMeeting = session;
    state.quests.pendingScene = `MEETING:${session.id}`;
    state.eventOpen = true;
    renderMeeting();
    return true;
  }
  function openBattle(attacker, defender, tile, isAI = false) {
    const battle = { attackerId: attacker?.id, defenderId: defender?.id, tileKey: tile ? `${tile.q},${tile.r}` : '', isAI };
    const q = questState();
    const bypass = q.operationBattleBypass;
    if (bypass && bypass.key === battleKey(battle)) {
      q.operationBattleBypass = null;
      runBattle(attacker, defender, tile, isAI);
      const pending = state.pendingBattles.find(item => battleKey(item) === bypass.key);
      if (pending) {
        pending.operationTactic = bypass.tactic;
        const radios = document.querySelectorAll('input[name="player-tactic"]');
        for (const radio of radios) { radio.checked = radio.value === bypass.tactic; radio.disabled = true; }
        const card = (tactics.BAEKJE || []).find(item => item.id === bypass.tactic);
        const summary = $('battle-summary');
        if (summary && card) summary.textContent += ` · 작전회의 결정: ${card.name}`;
      }
      return;
    }
    if (q.activeMeeting) return;
    if ($('battle-modal').open) return runBattle(attacker, defender, tile, isAI);
    if (canOpenOperation(battle) && openOperationMeeting(battle)) return;
    return runBattle(attacker, defender, tile, isAI);
  }
  function openCouncilDebate(plan) {
    if (state.playerFaction === 'BAEKJE' && questState().mainIndex === 2 && !questState().completed.has('MQ-03') && !questState().mq03Choice) return openWarMeeting(plan);
    return runWarCouncil(plan);
  }
  function situationText(session) {
    if (session.kind === 'court') {
      const forces = state.armies.filter(army => army.owner === 'BAEKJE').reduce((sum, army) => sum + army.troops, 0);
      return `백제의 국고는 ${state.nationalGold.toLocaleString()}금, 군량은 ${state.nationalFood.toLocaleString()}입니다. 현재 확인되는 백제 군단 병력은 ${forces.toLocaleString()}명이며, 전쟁 명분은 ${state.warJustification}/100입니다. 이 수치는 현재 장부와 군단 배치에서 확인한 값입니다. 가야가 응할지, 신라가 어느 정도 병력을 돌릴지는 확인된 정찰 정보가 없습니다.`;
    }
    if (session.situationSnapshot) return session.situationSnapshot;
    if (!session.battle) return '이전 저장 기록에는 당시 전황 수치가 보존되어 있지 않습니다. 대사와 질문을 읽기 전용으로 확인할 수 있습니다.';
    const { attacker, defender, tile } = battleSituation(session.battle);
    const owner = Object.values(state.tiles).find(item => item.node?.id === 'boeun')?.owner;
    return `${tile?.node?.name || '관산성 전장'}에서 ${attacker?.name || '공격군'} ${attacker?.troops?.toLocaleString() || 0}명과 ${defender?.name || '수비군'} ${defender?.troops?.toLocaleString() || 0}명이 맞섭니다. 백제군 보급은 ${attacker?.owner === 'BAEKJE' ? (attacker.supplied ? '연결' : '단절') : (defender?.supplied ? '연결' : '단절')} 상태입니다. 보은 삼년산성의 현재 소유는 ${owner ? factionName(owner) : '확인되지 않음'}입니다. 매복 여부를 확인하는 정찰 수치는 없습니다.`;
  }
  function courtDebate(session) {
    const people = Object.fromEntries(session.attendees.map(item => [item.id, item]));
    const rows = [];
    if (people.haegu?.available) rows.push(['해구', 'ambitious', '지금 신라를 친다. 명분이 모자라도, 때를 놓치면 한강은 영영 돌아오지 않는다.']);
    else rows.push(['현장 보고', 'neutral', people.haegu?.report || '해구 장군은 자리를 비워 보고로 대신합니다.']);
    rows.push(people.mokhyemanchi?.available ? ['목협만치', 'worried', '군량이 총력전을 감당할 수준이 아닙니다. 목표를 좁혀 치고 빠져야 합니다.'] : ['현장 보고', 'neutral', people.mokhyemanchi?.report || '목협만치의 의견은 부재 보고로 대신합니다.']);
    rows.push(people.sabeopmyeong?.available ? ['사법명', 'worried', '가야에 실질적인 대가를 제안해 끌어들입시다. 다만 가야가 응할지는 제가 장담할 수 없습니다.'] : ['현장 보고', 'neutral', people.sabeopmyeong?.report || '사법명의 의견은 부재 보고로 대신합니다.']);
    if (people.mokhyemanchi?.available && people.haegu?.available) rows.push(['목협만치', 'neutral', '군량 계산을 가야의 호응에 기대어 세우지는 마십시오.']);
    return rows;
  }
  function operationDebate(session) {
    const people = Object.fromEntries(session.attendees.map(item => [item.id, item]));
    const lines = [];
    lines.push(['태자 여창', 'determined', '관산성 앞에서 결정을 내리겠다. 각자 확인한 사실과 짐작을 구분해 말하라.']);
    if (people.haegu?.available) lines.push(['해구', 'ambitious', '달솔 철기병으로 바로 칩시다. 적 영토 안에서 시간을 끌수록 우리가 불리합니다.']);
    else lines.push(['현장 보고', 'neutral', people.haegu?.report || '해구 장군은 담로 방어로 자리를 비웠습니다. 돌격 주장은 보고로 대신합니다.']);
    if (people.mokhyemanchi?.available) lines.push(['목협만치', 'worried', '보은 삼년산성이 가깝습니다. 지금 돌격하면 포위당할 위험이 있으니 방진을 갖추고 살펴야 합니다.']);
    else lines.push(['현장 보고', 'neutral', people.mokhyemanchi?.report || '목협만치의 보급 의견은 부재 보고로 대신합니다.']);
    if (people.jinmu?.available) lines.push(['진무', 'determined', '신라가 먼저 매복을 쓸 수도 있습니다. 우리가 먼저 숲을 쓰면 선수를 잡을 수 있습니다. 제 짐작이 틀리면 저희가 가장 크게 당합니다.']);
    else lines.push(['현장 보고', 'neutral', people.jinmu?.report || '진무의 전술 의견은 부재 보고로 대신합니다.']);
    if (people.jinmu?.available) lines.push(['진무', 'neutral', '매복은 확인된 정보가 아닙니다. 지형과 적 장수의 성향을 보고 짐작한 것입니다.']);
    return lines;
  }
  function questionAnswer(session, id) {
    if (session.questionAnswers?.[id]) return session.questionAnswers[id];
    const facts = session.factsSnapshot;
    if (session.kind === 'court') return id === 'food' ? `현재 군량은 ${(facts?.nationalFood ?? state.nationalFood).toLocaleString()}입니다. 총력전의 소모 기간을 계산하는 규칙은 없습니다.` : '기대일 뿐입니다. 가야 쪽에서 먼저 언질을 준 적은 없습니다.';
    if (!session.battle && !facts) return id === 'supply' ? '당시 보급 수치가 기록에 남아 있지 않아 상태를 확인할 수 없습니다.' : '확신은 아닙니다. 지형과 저쪽 장수의 평소 성향을 보고 짐작한 겁니다.';
    if (facts) return id === 'supply' ? `${facts.baekjeSupplied ? '보급 연결' : '보급 단절'} 상태로 확인됩니다만, 전선이 늘어지면 길게는 못 버팁니다.` : '확신은 아닙니다. 지형과 저쪽 장수의 평소 성향을 보고 짐작한 겁니다.';
    const { attacker, defender } = battleSituation(session.battle);
    const baekje = attacker?.owner === 'BAEKJE' ? attacker : defender;
    return id === 'supply' ? `${baekje?.supplied ? '보급 연결' : '보급 단절'} 상태로 확인됩니다만, 전선이 늘어지면 길게는 못 버팁니다.` : '확신은 아닙니다. 지형과 저쪽 장수의 평소 성향을 보고 짐작한 겁니다.';
  }
  function reactionLines(session) {
    const c = session.choiceId;
    if (session.kind === 'court') {
      if (c === 'FULL_WAR') return [['목협만치', 'neutral', '군량은 제가 끌어모으겠습니다. 반대했다고 손을 놓을 수는 없지요.'], ['해구', 'relieved', '드디어.']];
      if (c === 'LIMITED_WAR') return [['해구', 'neutral', '작게 간다면, 작게라도 제가 선봉에 서겠습니다.'], ['목협만치', 'relieved', '현명한 선택입니다.']];
      return [['사법명', 'determined', '뱃길을 통해 교섭을 넣겠습니다. 다만 확답은 못 드립니다.'], ['해구', 'neutral', '이게 통하면 다행이고, 안 통하면 다시 저를 부르십시오.']];
    }
    if (c === 'charge') return [['목협만치', 'neutral', '제 우려와는 다른 길이지만, 후방은 제가 맡겠습니다.'], ['진무', 'resigned', '제 짐작이 쓰이지 않았군요. 다음엔 더 확실한 근거를 올리겠습니다.']];
    if (c === 'formation') return [['해구', 'resigned', '버티는 건 제 방식이 아니지만, 명이 그렇다면 따릅니다.'], ['진무', 'relieved', '신중한 선택입니다.']];
    return [['목협만치', 'worried', '제 우려보다 진무의 짐작을 믿으셨군요. 결과는 지켜보겠습니다.']];
  }
  function meetingRecord(session) {
    return { id: session.id, kind: session.kind, turn: session.turn, choiceId: session.choiceId, choiceLabel: session.choiceLabel || null, approvalAction: session.approvalAction || null, approvalResult: session.approvalResult || null, planLabel: session.plan?.label || null, tacticName: session.kind === 'operation' ? (tactics.BAEKJE || []).find(item => item.id === session.choiceId)?.name : null, battle: session.battle ? { ...session.battle } : null, factsSnapshot: { ...(session.factsSnapshot || {}) }, situationSnapshot: session.situationSnapshot || situationText(session), attendees: session.attendees.map(item => ({ name: item.name, available: item.available, report: item.report || null })), questionsAsked: [...new Set(session.questionsAsked || [])], questionAnswers: { ...(session.questionAnswers || {}) } };
  }
  function rememberMeeting(session) {
    const q = questState();
    if (q.meetingHistory.some(item => item.id === session.id && item.turn === session.turn && item.choiceId === session.choiceId)) return;
    q.meetingHistory.push(meetingRecord(session));
  }
  function closeActiveMeeting() {
    const session = questState().activeMeeting;
    if (!session) return;
    questState().activeMeeting = null;
    state.quests.pendingScene = null;
    state.eventOpen = false;
    $('cutscene-modal').close();
  }
  function applyMq03Choice(session) {
    const q = questState();
    if (session.kind !== 'court' || q.mq03AppliedChoice) return true;
    if (session.choiceId === 'GAYA_AID' && state.nationalGold < 100) return false;
    if (session.choiceId === 'FULL_WAR') {
      q.seongwangChoice = 'ATTEND';
      for (const army of state.armies.filter(item => item.owner === 'BAEKJE')) army.morale = Math.min(100, (army.morale || 0) + 10);
      addLog('총력전 준비: 성왕의 친정이 예정되고 백제 전군 사기가 10 올랐습니다.');
    } else if (session.choiceId === 'LIMITED_WAR') {
      q.seongwangChoice = 'ABSENT';
      state.nationalFood += 100;
      addLog('제한전 결정: 성왕은 후방에 남고 군량 100을 아껴 비축했습니다.');
    } else if (session.choiceId === 'GAYA_AID') {
      state.nationalGold -= 100;
      state.flags.gayaFavorBaekje = Math.min(100, (state.flags.gayaFavorBaekje || 0) + 20);
      state.iron = (state.iron || 0) + 30;
      addLog('가야 지원 교섭에 국고 100금을 쓰고, 호감도 20과 철기 30을 확보했습니다.');
    }
    q.mq03AppliedChoice = session.choiceId;
    session.effectApplied = true;
    return true;
  }
  function approvalSnapshot() {
    const nobles = Object.values(state.clans).filter(clan => clan.faction === 'BAEKJE' && !clan.isKing);
    const support = nobles.filter(clan => clan.loyalty >= 55).length;
    return { support, dissent: nobles.length - support, total: nobles.length, nobles };
  }
  function approveMq03(session, action) {
    if (session.kind !== 'court' || session.stage !== 'approval' || session.approvalAction) return;
    const { support, dissent, total, nobles } = approvalSnapshot();
    if (action === 'trade') {
      const target = nobles.find(clan => clan.loyalty < 55) || nobles[0];
      if (target) { state.royalAuth = Math.max(0, state.royalAuth - 10); target.privateArmy += 300; target.loyalty = Math.min(100, target.loyalty + 25); }
      session.approvalAction = action;
      session.approvalResult = '이권 양보로 출병 의제가 승인되었습니다.';
      return finishCouncilApproval(session, '정치적 타협으로 출병 의제를 통과시켰습니다.');
    }
    if (action === 'bribe') {
      if (state.nationalGold < 150 || state.nationalFood < 200) { addLog('회유에는 금 150과 군량 200이 필요합니다.'); return; }
      state.nationalGold -= 150; state.nationalFood -= 200;
      for (const clan of nobles.filter(item => item.loyalty < 55)) clan.loyalty = Math.min(100, clan.loyalty + 20);
      const after = approvalSnapshot();
      if (after.support > after.total / 2) {
        session.approvalAction = action; session.approvalResult = '국고 회유로 귀족 과반의 동의를 얻었습니다.';
        return finishCouncilApproval(session, session.approvalResult);
      }
      session.approvalAttempts = (session.approvalAttempts || 0) + 1;
      addLog('회유 후에도 귀족 과반에 미달합니다. 추가 협의가 필요합니다.');
      renderAll(); renderMeeting(); return;
    }
    if (action === 'force') {
      state.legitimacy = Math.max(0, state.legitimacy - 15);
      for (const clan of nobles) clan.loyalty = Math.max(0, clan.loyalty - 20);
      session.approvalAction = action;
      session.approvalResult = '왕명으로 과반 동의 없이 출병을 강행했습니다.';
      return finishCouncilApproval(session, '왕명으로 출병을 강행했습니다. 내전 위기가 커집니다.');
    }
  }
  function finishCouncilApproval(session, message) {
    if (session.kind === 'court') {
      if (!applyMq03Choice(session)) {
        addLog('가야 교섭을 확정하려면 국고 100금이 필요합니다.');
        session.approvalAction = null;
        session.approvalResult = null;
        renderMeeting();
        return;
      }
      const choice = narrative.quests.find(item => item.id === 'MQ-03')?.choices.find(item => item.id === session.choiceId);
      const q = questState();
      q.mq03Choice = session.choiceId;
      q.completed.add('MQ-03');
      q.mainIndex = 3;
      q.path.push(`MQ-03 복수의 설계: ${choice?.label || session.choiceId}`);
      chronicle('MQ-03', choice?.label || session.choiceId, `선택 효과 적용 (${session.choiceId}) 후 귀족 표결로 출병 승인`);
      addLog(`MQ-03 결정 확정: ${choice?.label || session.choiceId}. 선택 효과와 귀족 표결이 최종 승인과 함께 확정되었습니다.`);
    }
    rememberMeeting(session);
    closeActiveMeeting();
    approveCouncil?.(message);
    renderAll();
  }
  function finishMeetingReaction() {
    const session = questState().activeMeeting;
    if (!session || session.stage !== 'reaction' || !session.choiceId) return;
    if (session.kind !== 'court') rememberMeeting(session);
    if (session.kind === 'court') {
      const choice = narrative.quests.find(item => item.id === 'MQ-03')?.choices.find(item => item.id === session.choiceId);
      session.stage = 'approval';
      addLog(`MQ-03 선택: ${choice?.label || session.choiceId}. 효과는 귀족 표결에서 출병이 승인될 때 확정됩니다.`);
      renderAll(); renderMeeting();
      return;
    }
    const battle = session.battle;
    const tactic = session.choiceId;
    questState().operationBattleKeys.push(battleKey(battle));
    questState().gwansanOperationTactic = tactic;
    const nextBattle = { ...battle, key: battleKey(battle), tactic };
    closeActiveMeeting();
    const attacker = state.armies.find(item => item.id === nextBattle.attackerId);
    const defender = state.armies.find(item => item.id === nextBattle.defenderId);
    const tile = state.tiles[nextBattle.tileKey];
    if (!attacker || !defender || !tile) { addLog('작전회의 뒤 전투 부대나 관산성 정보가 바뀌어 기존 전투를 열 수 없습니다.'); renderAll(); return; }
    questState().operationBattleBypass = { key: nextBattle.key, tactic: nextBattle.tactic };
    renderAll();
    openBattle(attacker, defender, tile, battle.isAI);
  }
  function setStage(session, stage) { session.stage = stage; session.questionId = null; renderMeeting(); }
  function lineElement([speaker, mood, text]) {
    const row = document.createElement('div');
    row.className = 'dialogue-line';
    row.dataset.mood = String(mood).split(/[?>]/).at(-1) || 'neutral';
    const who = document.createElement('span'); who.className = 'speaker'; who.textContent = speaker;
    const words = document.createElement('span'); words.className = 'meeting-words'; words.textContent = text;
    row.append(who, words); return row;
  }
  function renderMeeting() {
    const session = currentMeeting();
    if (!session) return;
    const readOnly = Boolean(replay);
    const modal = $('cutscene-modal'), context = $('cutscene-context'), lines = $('cutscene-lines'), choices = $('cutscene-choices');
    const next = $('btn-cutscene-continue'), previous = $('btn-cutscene-previous'), skip = $('btn-cutscene-skip');
    $('cutscene-kicker').textContent = readOnly ? '이야기 기록 · 다시 읽기' : '백제 회의 기록';
    $('cutscene-title').textContent = session.id === 'BAEKJE-MQ03' ? '복수의 설계 · 출병 어전회의' : '관산성 작전회의';
    $('btn-cutscene-close').style.display = readOnly ? 'inline-block' : 'none';
    $('cutscene-page-indicator').hidden = false;
    const stageNames = ['안건과 참석자', '주장과 반박', '질문', '최종 결정', '결정 뒤 반응', '귀족 표결과 출병 승인'];
    const stageIndex = ({ agenda: 0, debate: 1, questions: 2, decision: 3, reaction: 4, approval: 5 })[session.stage] ?? 0;
    $('cutscene-page-indicator').textContent = `${stageIndex + 1} / ${stageNames.length} · ${stageNames[stageIndex]}`;
    context.hidden = false;
    context.textContent = session.stage === 'agenda' ? (session.situationSnapshot || situationText(session)) : '';
    lines.replaceChildren(); lines.hidden = false;
    if (session.stage === 'agenda') {
      const head = document.createElement('p'); head.className = 'meeting-section-title'; head.textContent = '참석 여부'; lines.append(head);
      for (const person of session.attendees) {
        const row = document.createElement('p'); row.className = `meeting-attendee ${person.available ? 'present' : 'absent'}`;
        const deployment = person.assignment ? `현장 배치 · ${person.assignment}` : person.available ? (session.kind === 'operation' ? '별도 군단 임무 없음 · 참모 참석' : '군단 임무 없음 · 조정 참석') : '';
        row.textContent = `${person.available ? '참석' : '대체 보고'} · ${person.name}${deployment ? ` — ${deployment}` : ''}${person.report ? ` — ${person.report}` : ''}`;
        lines.append(row);
      }
      if (session.attendees.some(item => item.id === 'haegu')) { const lore = document.createElement('p'); lore.className = 'meeting-note'; lore.textContent = '해구는 478년 인물 본인이 아니라 게임 속 가상 후손 설정입니다.'; lines.append(lore); }
    } else if (session.stage === 'debate') {
      const debate = session.kind === 'court' ? courtDebate(session) : operationDebate(session);
      lines.replaceChildren(...debate.map(lineElement));
      if (session.kind === 'operation') { const fact = document.createElement('p'); fact.className = 'meeting-note'; fact.textContent = situationText(session); lines.append(fact); }
    } else if (session.stage === 'questions') {
      const questions = session.kind === 'court' ? [['food', '군량은 총력전을 얼마나 감당할 수 있습니까?'], ['gaya', '가야가 정말 응할 거라 보는가, 아니면 기대인가?']] : [['supply', '보급 연결은 현재 어떤 상태인가?'], ['ambush', '진무, 매복이 있다고 확신하는가, 짐작인가?']];
      const prompt = document.createElement('p'); prompt.className = 'meeting-section-title'; prompt.textContent = '질문은 선택 사항이며 수치·보상·턴에 영향을 주지 않습니다.'; lines.append(prompt);
      if (session.questionId) lines.append(lineElement([session.questionId === 'food' || session.questionId === 'supply' ? '담당관의 답' : session.questionId === 'gaya' ? '사법명' : '진무', 'neutral', questionAnswer(session, session.questionId)]));
      choices.replaceChildren(...questions.map(([id, label]) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'meeting-question'; button.textContent = label; button.onclick = () => { if (!readOnly) { session.questionId = id; session.questionsAsked ??= []; session.questionAnswers ??= {}; if (!session.questionsAsked.includes(id)) session.questionsAsked.push(id); session.questionAnswers[id] ??= questionAnswer(session, id); } else { replay.questionId = id; replay.questionAnswers ??= {}; replay.questionAnswers[id] ??= questionAnswer(replay, id); } renderMeeting(); }; return button; }));
      const finishQuestions = document.createElement('button'); finishQuestions.type = 'button'; finishQuestions.className = 'meeting-question-finish'; finishQuestions.textContent = '질문을 마치고 결정으로 ▶'; finishQuestions.onclick = () => setStage(session, 'decision'); choices.append(finishQuestions);
    } else if (session.stage === 'decision') {
      const intro = document.createElement('p'); intro.className = 'meeting-section-title'; intro.textContent = readOnly ? `당시 선택: ${session.choiceLabel || session.choiceId || '기록 없음'}` : session.kind === 'court' ? '토론을 마쳤습니다. 성왕이 결정을 내립니다.' : '토론을 마쳤습니다. 태자가 이 전투의 전술을 결정합니다.'; lines.append(intro);
      if (!readOnly) {
        const options = session.kind === 'court' ? (narrative.quests.find(item => item.id === 'MQ-03')?.choices || []).map(item => [item.id, item.label]) : (tactics.BAEKJE || []).map(item => [item.id, item.name]);
        choices.replaceChildren(...options.map(([id, label]) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'meeting-decision'; button.textContent = session.kind === 'court' ? `${label} · ${id === 'FULL_WAR' ? '성왕 친정 · 전군 사기 +10' : id === 'LIMITED_WAR' ? '성왕 후방 잔류 · 군량 100 비축' : '국고 −100금 · 가야 호감 +20 · 철기 +30'}` : `${label} · 이 전투의 기존 상성 계산에 적용 · 추가 보상 없음`; if (session.kind === 'court' && id === 'GAYA_AID' && state.nationalGold < 100) { button.disabled = true; button.title = '국고 100금이 필요합니다.'; } button.onclick = () => { if (session.stage !== 'decision' || session.choiceId) return; session.choiceId = id; session.choiceLabel = label; session.stage = 'reaction'; renderMeeting(); }; return button; }));
      } else choices.replaceChildren();
    } else if (session.stage === 'reaction') {
      lines.replaceChildren(...reactionLines(session).map(lineElement));
      if (session.kind === 'operation') { const selected = (tactics.BAEKJE || []).find(item => item.id === session.choiceId); const note = document.createElement('p'); note.className = 'meeting-note'; note.textContent = `선택 전술: ${selected?.name || session.choiceId}. 다음 전투 모달에 이 전술이 고정 적용됩니다.`; lines.append(note); }
      choices.replaceChildren();
    } else if (session.stage === 'approval') {
      const vote = approvalSnapshot();
      const summary = document.createElement('p'); summary.className = 'meeting-section-title'; summary.textContent = `귀족 찬성 ${vote.support}/${vote.total} · 반대·보류 ${vote.dissent} · 과반 기준 ${Math.floor(vote.total / 2) + 1}명`; lines.append(summary);
      for (const clan of vote.nobles) { const row = document.createElement('p'); row.className = 'meeting-vote-row'; row.textContent = `${clan.name} · ${clan.loyalty >= 55 ? '찬성' : '반대·보류'} · 충성 ${clan.loyalty}% · 사병 ${clan.privateArmy.toLocaleString()}명`; lines.append(row); }
      if (readOnly) { const result = document.createElement('p'); result.className = 'meeting-note'; result.textContent = session.approvalResult || '당시 최종 표결 내용이 저장되지 않은 기록입니다.'; lines.append(result); choices.replaceChildren(); }
      else {
        choices.replaceChildren();
        for (const [id, label, detail] of [['trade', 'A · 이권 양보', '국고 소모 없음 · 왕권 −10 · 대표 반대 가문 사병 +300, 충성 +25 · 즉시 승인'], ['bribe', 'B · 국고 회유', '국고 −150금 · 군량 −200 · 반대 가문 충성 +20 · 과반이면 승인'], ['force', 'C · 왕명 강행', '천명·민심 −15 · 모든 귀족 충성 −20 · 과반과 무관하게 승인']]) {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'meeting-approval'; button.textContent = label;
          const small = document.createElement('small'); small.textContent = detail; button.append(small);
          if (id === 'bribe' && (state.nationalGold < 150 || state.nationalFood < 200)) { button.disabled = true; button.title = '국고 150금과 군량 200이 필요합니다.'; }
          button.onclick = () => approveMq03(session, id); choices.append(button);
        }
        if (session.approvalAttempts) { const note = document.createElement('p'); note.className = 'meeting-note'; note.textContent = `회유 ${session.approvalAttempts}회 후에도 과반에 미달했습니다. 다른 의결 방식을 고를 수 있습니다.`; lines.append(note); }
      }
    }
    context.hidden = session.stage !== 'agenda';
    choices.hidden = false;
    if (!readOnly && !['decision', 'questions', 'approval'].includes(session.stage)) choices.replaceChildren();
    if (!readOnly) { const save = document.createElement('button'); save.type = 'button'; save.className = 'meeting-save'; save.textContent = '회의 중 저장'; save.onclick = saveCampaign; choices.append(save); }
    const hasPrevious = ['debate', 'questions', 'decision', 'approval'].includes(session.stage);
    previous.hidden = !hasPrevious;
    previous.textContent = '◀ 이전';
    previous.onclick = () => setStage(session, session.stage === 'decision' || session.stage === 'questions' ? 'debate' : session.stage === 'approval' ? 'reaction' : 'agenda');
    skip.style.display = !readOnly && session.stage === 'debate' ? 'inline-block' : 'none';
    skip.textContent = '간략 보고';
    skip.onclick = () => setStage(session, 'decision');
    next.style.display = session.stage === 'decision' || session.stage === 'questions' || (session.stage === 'approval' && !readOnly) ? 'none' : 'inline-block';
    next.textContent = session.stage === 'agenda' ? '주장과 반박 보기 ▶' : session.stage === 'debate' ? '질문 선택 ▶' : session.stage === 'reaction' ? (readOnly ? '닫기' : session.kind === 'operation' ? '전술을 적용하고 전투로' : '귀족 표결로') : session.stage === 'approval' ? '닫기' : '질문을 마치고 결정으로 ▶';
    next.onclick = () => {
      if (readOnly) { if (session.stage === 'agenda') setStage(session, 'debate'); else if (session.stage === 'debate') setStage(session, 'questions'); else if (session.stage === 'questions') setStage(session, 'decision'); else if (session.stage === 'decision') setStage(session, 'reaction'); else if (session.stage === 'reaction') setStage(session, 'approval'); else closeReplay(); return; }
      if (session.stage === 'agenda') setStage(session, 'debate');
      else if (session.stage === 'debate') setStage(session, 'questions');
      else if (session.stage === 'questions') setStage(session, 'decision');
      else if (session.stage === 'reaction') finishMeetingReaction();
    };
    if (session.stage === 'decision' && !readOnly) { next.style.display = 'inline-block'; next.textContent = '질문으로 돌아가기'; next.onclick = () => setStage(session, 'questions'); }
    $('cutscene-modal').dataset.meetingActive = readOnly ? 'replay' : 'active';
    if (!modal.open) modal.showModal();
  }
  function closeReplay() {
    replay = null;
    $('cutscene-modal').close();
    $('cutscene-modal').dataset.meetingActive = '';
    if (replaySnapshot) { state.eventOpen = replaySnapshot.eventOpen; state.quests.pendingScene = replaySnapshot.pendingScene; replaySnapshot = null; }
  }
  function replayMeeting(record) {
    replaySnapshot = { eventOpen: state.eventOpen, pendingScene: state.quests.pendingScene };
    replay = { ...record, stage: 'agenda', choiceLabel: record.kind === 'operation' ? record.tacticName : narrative.quests.find(item => item.id === 'MQ-03')?.choices.find(item => item.id === record.choiceId)?.label || record.choiceId, attendees: record.attendees || [], factsSnapshot: record.factsSnapshot || null, questionsAsked: record.questionsAsked || [], questionAnswers: record.questionAnswers || {}, questionId: null };
    renderMeeting();
  }
  function renderStoryArchive() {
    runArchive();
    const box = $('story-archive');
    for (const record of questState().meetingHistory) {
      const button = document.createElement('button');
      button.className = 'archive-entry';
      button.textContent = record.kind === 'court' ? `백제 출병 어전회의 · 제${record.turn}턴` : `관산성 작전회의 · 제${record.turn}턴`;
      button.onclick = () => replayMeeting(record);
      box.append(button);
    }
  }
  function loadCampaign() {
    runLoad();
    const session = questState().activeMeeting;
    if (session) { replay = null; state.eventOpen = true; state.quests.pendingScene = `MEETING:${session.id}`; queueMicrotask(renderMeeting); }
  }
  $('cutscene-modal').addEventListener('cancel', event => {
    const mode = $('cutscene-modal').dataset.meetingActive;
    if (mode === 'active' || mode === 'replay') { event.preventDefault(); if (mode === 'replay') closeReplay(); }
  });
  $('btn-cutscene-close').addEventListener('click', event => {
    if ($('cutscene-modal').dataset.meetingActive === 'replay') { event.preventDefault(); event.stopImmediatePropagation(); closeReplay(); }
  }, true);
  // main.js가 모듈 설치 전에 저장 버튼 핸들러를 등록하므로, 불러오기 완료 뒤 회의 복원을 별도 연결한다.
  $('btn-load').addEventListener('click', () => {
    const session = questState().activeMeeting;
    if (session) { replay = null; state.eventOpen = true; state.quests.pendingScene = `MEETING:${session.id}`; renderMeeting(); }
  });
  return { openBattle, openCouncilDebate, loadCampaign, renderStoryArchive };
}
