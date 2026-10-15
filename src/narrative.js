// Playable narrative content distilled from the source documents in ../_workspace.
export const NARRATIVE_SOURCE = '../_workspace';
export const NARRATIVE = {
  title: '나제동맹 붕괴와 관산성',
  period: '551–554년',
  summary: '백제와 신라의 한강 공동 전역에서 시작해 동맹의 균열, 관산성 전투와 그 결과를 다룹니다.',
  flags: { treatyClarity: null, sillaRaidScope: null, baekjeResponse: null, gwansanOutcome: null, goguryeoPact: false, gayaFavorBaekje: 0, gayaFavorSilla: 0 },
  quests: [
    {id:'MQ-01',title:'한강으로',year:551,description:'백제와 신라가 한강 유역을 공동 공략하기로 합의합니다.',choices:[{id:'HIGH',label:'영토 분배를 명문화한다',flag:'TREATY_clarity',value:'HIGH'},{id:'LOW',label:'조항을 모호하게 둔다',flag:'TREATY_clarity',value:'LOW'},{id:'NONE',label:'상호 신뢰에 맡긴다',flag:'TREATY_clarity',value:'NONE'}]},
    {id:'MQ-02',title:'그림자의 무게',year:553,description:'신라의 한강 하류 진출로 나제동맹이 흔들립니다.',choices:[{id:'PARTIAL',label:'신라: 절반만 취한다',flag:'SILLA_raid_scope',value:'PARTIAL'},{id:'FULL',label:'신라: 전부 취한다',flag:'SILLA_raid_scope',value:'FULL'},{id:'PREEMPT',label:'백제: 선제 대응한다',flag:'BAEKJE_response',value:'PREEMPT'},{id:'IGNORE',label:'백제: 동맹을 믿고 기다린다',flag:'BAEKJE_response',value:'IGNORE'}]},
    {id:'MQ-03',title:'복수의 설계',year:554,description:'성왕과 여창이 관산성 원정을 준비하며 가야의 지원을 모색합니다.',choices:[{id:'FULL_WAR',label:'총력전을 준비한다'},{id:'LIMITED_WAR',label:'제한전을 택한다'},{id:'GAYA_AID',label:'가야에 실질적인 대가를 제안한다'}]},
    {id:'MQ-04',title:'관산성의 밤',year:554,description:'관산성 전투의 선택이 성왕의 운명과 삼한의 향후 구도를 바꿉니다.',choices:[{id:'KING_DIES',label:'성왕이 전사한다',flag:'GWANSAN_outcome',value:'KING_DIES'},{id:'KING_CAPTURED',label:'성왕을 포로로 잡는다',flag:'GWANSAN_outcome',value:'KING_CAPTURED'},{id:'KING_ABSENT',label:'성왕은 불참하고 여창이 지휘한다',flag:'GWANSAN_outcome',value:'KING_ABSENT'},{id:'KING_SPARED',label:'퇴로를 열어준다',flag:'GWANSAN_outcome',value:'KING_SPARED'}]}
  ],
  endings: [
    {id:'A',title:'중흥의 대가',condition:'GWANSAN_outcome = KING_DIES',priority:10},
    {id:'B',title:'삼한의 설계자',condition:'전후 외교와 국력 우위 확보',priority:10},
    {id:'C',title:'끊어진 저울',condition:'신뢰 붕괴와 높은 전쟁 피해',priority:10},
    {id:'D',title:'유예된 전쟁',condition:'KING_CAPTURED 또는 KING_SPARED',priority:10},
    {id:'H-NORTH',title:'북방의 그림자',condition:'GOGURYEO_pact = TRUE AND outcome != KING_DIES',priority:100,hidden:true},
    {id:'H-IRON',title:'쇠의 나라',condition:'가야 호감도 두 수치 모두 40 이상',priority:90,hidden:true}
  ],
  characters: [
    {id:'seongwang',name:'성왕',faction:'BAEKJE',role:'백제 국왕'},
    {id:'jinheung',name:'진흥왕',faction:'SILLA',role:'신라 국왕'},
    {id:'yeochang',name:'여창',faction:'BAEKJE',role:'왕자·관산성 원정 지휘관'},
    {id:'isabu',name:'이사부',faction:'SILLA',role:'장군·전략 조언자'}
  ]
};

export const SIDE_QUESTS = [
  {id:'SQ-01',title:'6두품의 분노',faction:'SILLA',description:'신분의 벽에 막힌 인재의 등용을 두고 조정의 반발과 개혁을 저울질합니다.',choices:[{id:'reform',label:'인재를 등용한다 · 천명 +8, 왕실 병력 +200',reward:{legitimacy:8,troops:200},epilogue:'개혁의 씨앗이 남아 신분에 막힌 인재가 조정에 합류합니다.'},{id:'defer',label:'귀족 반발을 피하고 유예한다 · 신뢰 +5',reward:{trust:5},epilogue:'갈등은 잠시 가라앉지만 차별의 상처는 남습니다.'}]},
  {id:'SQ-02',title:'22담로의 왕족',faction:'BAEKJE',description:'담로의 왕족 파견과 지방 통치의 균형을 결정합니다.',choices:[{id:'appoint',label:'왕족을 파견한다 · 병력 +250, 천명 +4',reward:{troops:250,legitimacy:4},epilogue:'왕실의 손길이 지방에 닿고 담로의 충성이 강해집니다.'},{id:'trade',label:'교역 허가를 내준다 · 금 +160, 신뢰 +3',reward:{gold:160,trust:3},epilogue:'교역로가 살아나고 지방 세력은 숨을 돌립니다.'}]},
  {id:'SQ-03',title:'양다리의 대가',faction:'GAYA',description:'백제와 신라에 각각 다른 약속을 한 가야의 밀서를 처리합니다.',choices:[{id:'conceal',label:'밀서를 감추고 양쪽과 우호를 유지 · 양측 가야 호감 +45',reward:{gayaBaekje:45,gayaSilla:45},epilogue:'가야는 두 강국 사이에서 독자 생존의 여지를 지킵니다.'},{id:'expose',label:'신라에 밀서를 공개한다 · 신라 가야 호감 +10, 백제 호감 -20',reward:{gayaBaekje:-20,gayaSilla:10},epilogue:'정보 루트가 열리지만 백제와의 신뢰는 금이 갑니다.'}]},
  {id:'SQ-04',title:'태학의 그림자 (고구려 밀약)',faction:'GOGURYEO',description:'태학의 문서에서 신라와의 비밀 불가침 제안을 찾아냅니다.',choices:[{id:'accept',label:'밀약을 수락한다 · GOGURYEO_pact = TRUE, 금 +100',reward:{pact:true,gold:100},epilogue:'비밀 약조가 성립해 북방의 압박이 잠시 느슨해집니다.'},{id:'refuse',label:'밀약을 거부한다 · 천명 +5',reward:{pact:false,legitimacy:5},epilogue:'고구려는 중립을 지키고 신라는 독자 노선을 택합니다.'}]},
  {id:'SQ-05',title:'화랑의 첫 전장',faction:'SILLA',description:'젊은 화랑을 신중히 훈련할지, 전장에 투입할지 결정합니다.',choices:[{id:'train',label:'신중히 훈련한다 · 이사부 관계 +15, 병력 +100',reward:{isabu:15,troops:100},epilogue:'화랑은 살아남아 다음 세대의 장수로 성장합니다.',survives:true},{id:'deploy',label:'즉시 선봉에 배치한다 · 병력 +300, 천명 +3',reward:{troops:300,legitimacy:3},epilogue:'화랑은 용맹을 보이나 전장에서 전사합니다. 이사부는 그를 기억합니다.',survives:false}]}
];

export const CUTSCENES = {
  'CS-01':{title:'맹약의 자리',lines:[['백제 상좌평 · 사비 사절 사법명','neutral','한강은 본래 우리의 땅이었소. 함께 되찾는다면, 그 경계는 옛 강역을 따를 것이오.'],['신라 대아찬 · 금성 사절 거칠부','neutral→bitter','옛 강역이라... 그 말은 백 년 전의 지도를 믿으라는 뜻이구려. 우리가 흘릴 피의 몫은, 피를 흘린 자가 정한다 해야 옳지 않겠소.'],['백제 상좌평 · 사비 사절 사법명','sad','그리 말씀하시면, 이 맹약은 처음부터 모래 위에 짓는 것이 되오.']],choices:[['A','경계를 지금 문서로 명확히 합시다','HIGH'],['B','일단 되찾고 나서 논의합시다','LOW'],['C','하늘과 백성이 지켜볼 것이오, 문서는 필요 없소','NONE']]},
  'CS-02-S':{title:'저울을 기울이다',lines:[['이사부','neutral→bitter','한강 하류까지 취하면, 백제는 반드시 돌아섭니다. 지금의 동맹은 그 순간 끝입니다.'],['진흥왕','neutral','동맹은 언제까지 가는가, 이사부. 고구려가 무너진 지금이오. 다음에 이 기회가 온다면 그때는 백제가 먼저 움직이겠지.'],['이사부','whisper→angry','그렇다 해도... 전하, 신의를 저버린 왕이라는 이름은 백 년을 간다 하였습니다.']],choices:[['A','절반만 취하겠다 — 신의를 지킨다','PARTIAL'],['B','전부 취한다 — 이것이 실리다','FULL'],['C','이사부의 생각을 듣고 맡긴다','DELEGATE']]},
  'CS-02-B':{title:'믿은 자의 자리',lines:[['여창','shout','신라가... 우리 땅을 집어삼켰다 하십니까! 지금 당장 군을 일으켜야 합니다!'],['성왕','neutral→sad','...알고 있었다. 저들이 흔들리고 있다는 것을. 그런데도 막지 않았다.'],['여창','angry','어찌하여! 아셨다면 어찌 막지 않으셨습니까!'],['성왕','resigned','막았다면, 그들과 당장 전쟁이었다. 지금은 숨을 돌릴 시간이 필요했다. ...내 계산이 틀렸다.']],choices:[['A','지금은 참는다 — 힘을 기른 뒤 갚는다','IGNORE'],['B','지금 당장 선전포고한다','PREEMPT'],['C','여창에게 군권 일부를 맡긴다','DELEGATE']]},
  'CS-04':{title:'관산성의 밤',lines:[['여창','whisper','...버틸 수가 없다. 지원이 오지 않으면.'],['전령','shout','전하께서 친히 오십니다!'],['여창','surprised→sad','아버님이... 어찌하여 이곳까지...'],['신라 삼년산성 군주 · 장군 고간(도도)','neutral','왕이 직접 움직였다. 지금이다.']],baekjeChoices:[['A','성왕이 직접 구원에 나선다','ATTEND'],['B','정예 호위만 보내고 성왕은 후방에 남는다','ABSENT']],sillaChoices:[['A','포로로 잡는다 — 협상의 패로 쓴다','CAPTURED'],['B','...목숨을 취한다','DIES'],['C','퇴로를 열어준다 — 더 큰 전쟁은 원치 않는다','SPARED']]}
};

export const CUTSCENE_CONTEXT = {
  'CS-01':'551년, 한강 유역의 주인은 아직 정해지지 않았습니다. 북쪽의 고구려는 남하를 노리고, 백제와 신라는 서로를 경계하면서도 힘을 합칠 수밖에 없습니다. 오늘 맺는 약속의 문구 하나가 내일의 전쟁에서 누구에게 명분을 줄지 결정합니다.',
  'CS-01-G':'북쪽에서는 돌궐의 압박이 거세지고, 남쪽에서는 백제와 신라의 연합군이 한강을 향해 움직입니다. 양원왕은 산성에 의지해 시간을 벌지, 강을 건너 적의 대오를 흔들지, 두 나라 사이에 쐐기를 박을지 선택해야 합니다.',
  'CS-02-S':'한성의 성벽에 새 깃발이 올랐지만, 승리의 환호는 오래가지 못했습니다. 이사부와 김무력의 군대는 한강 하류로 발걸음을 옮기고, 나제동맹의 문서에는 누구도 답하지 못한 빈칸이 남아 있습니다.',
  'CS-02-B':'553년 가을, 피 흘려 되찾은 한성의 깃발이 채 마르기도 전입니다. 성왕에게 동맹국 신라의 대군이 한강 하류로 향한다는 급보가 도착합니다. 북방의 고구려를 경계해야 하는 순간, 백제 조정은 복수와 인내 사이에서 갈라집니다.',
  'CS-04':'관산성의 밤은 산길을 타고 번진 횃불과 부상병의 신음으로 시작됩니다. 백제 왕실의 친정 여부와 신라군의 포로 처리 결정은 전투의 승패를 넘어 두 나라의 기억을 바꾸게 됩니다. 전령이 마지막 보고를 올리고, 조정은 돌이킬 수 없는 결정을 기다립니다.',
  'CS-04-SILLA':'백제군이 성왕을 모시고 왔다는 소식이 신라 진영에 닿았습니다. 포로로 맞을 것인지, 목숨을 끊을 것인지, 퇴로를 열어 전쟁을 멈출 것인지—이 선택은 관산성 이후의 세력 균형과 후대의 기록을 함께 바꿉니다.'
};

export async function loadNarrativeFiles(){
  const files=['00_input.md','01_worldbuilding.md','02_quest_design.md','03_dialogue_script.md','04_branch_map.md','05_review_report.md'];
  const results=await Promise.all(files.map(async file=>{try{const response=await fetch(`${NARRATIVE_SOURCE}/${file}`);if(!response.ok)throw new Error(String(response.status));return[file,await response.text()]}catch{return[file,null]}}));
  return Object.fromEntries(results);
}

export function parseCutsceneMarkdown(markdown){
  if(!markdown)return{};const sections={};const chunks=markdown.split(/(?=^### CS-\d{2}(?:-[SB])?:)/m);
  for(const chunk of chunks){const heading=chunk.match(/^### (CS-\d{2}(?:-[SB])?):\s*(.+)$/m);if(!heading)continue;const sceneBody=chunk.split(/^## NPC 대화/m)[0].split(/^\*\*\[선택 .* 후속\]\*\*/m)[0];const lines=[];const regex=/\*\*\[([^\]]+)\]\*\*\s*\[([^\]]+)\]:\s*\n?\s*"([\s\S]*?)"/g;let match;while((match=regex.exec(sceneBody)))lines.push([match[1],match[2],match[3]]);sections[heading[1]]={title:heading[2].replace(/\s*\(.*/,''),lines};}
  return sections;
}

export function chooseNarrative(questId,choiceId){
  const quest=NARRATIVE.quests.find(item=>item.id===questId),choice=quest?.choices.find(item=>item.id===choiceId);if(!choice)return false;
  if(choice.flag)NARRATIVE.flags[({TREATY_clarity:'treatyClarity',SILLA_raid_scope:'sillaRaidScope',BAEKJE_response:'baekjeResponse',GWANSAN_outcome:'gwansanOutcome'})[choice.flag]]=choice.value;
  return true;
}

export function getNarrativeDiagnostics(files){return{loaded:Object.entries(files).filter(([,text])=>text!==null).map(([name])=>name),missing:Object.entries(files).filter(([,text])=>text===null).map(([name])=>name),questCount:NARRATIVE.quests.length,endingCount:NARRATIVE.endings.length}}


export const GOGURYEO_QUESTS = [
  {id:'MQ-G1',title:'한강 방어선 사수',year:551,description:'돌궐의 압박 속에서 한성·북한산성 방어 전략을 확정합니다.'},
  {id:'MQ-G2',title:'나제동맹 균열 유도 및 밀약',year:552,description:'신라 밀사와 접촉해 나제동맹을 흔들거나 정면 방어를 강화합니다.'},
  {id:'MQ-G3',title:'단양·웅진 남진 역습',year:553,description:'한강 방어선을 벗어나 단양 또는 웅진 방면으로 반격합니다.'},
  {id:'MQ-G4',title:'삼한 패권 회복',year:554,description:'남진의 성과와 외교 선택을 결산하고 고구려의 종착점을 정합니다.'}
];
CUTSCENES['CS-01-G']={title:'남경의 경보',lines:[['북방 전령','shout','돌궐의 기병이 북쪽 변경을 압박합니다! 동시에 남쪽의 백제와 신라가 맹약을 맺고 한성으로 북상한다는 급보입니다.'],['양원왕','neutral→worried','북방과 남방, 두 전선을 함께 감당해야 하는가. 제가회의는 방책을 내라.'],['제가회의 대가','bitter','산성망에 기대어 적의 군량을 말릴지, 한강을 건너 두 군을 갈라 칠지, 아니면 신라에 밀사를 보내 맹약부터 흔들지 정해야 합니다.']],choices:[['A','한성·북한산성 산성망에 의지해 청야전술로 지구전을 편다','DEFENSE'],['B','한강 이남으로 선제 도하하여 각개격파한다','OFFENSE'],['C','신라에 비밀리에 밀사를 보내 동맹을 이간질한다','PACT']]};
CUTSCENES['CS-G2']={title:'밀약의 그림자',lines:[['제가회의 대가','whisper','남쪽 동맹의 결속이 아직 완전하지 않습니다. 신라에 불가침 밀약을 제안할까요?']],choices:[['A','밀약을 맺고 남방을 묶는다','PACT'],['B','밀사를 돌려보내고 방어에 집중한다','REFUSE']]};
CUTSCENES['CS-G3']={title:'남진의 깃발',lines:[['양원왕','shout','한강의 성문이 흔들린다. 이제 단양과 웅진으로 진격해 남방의 주도권을 되찾으라!']],choices:[['A','단양 적성을 향해 진군한다','DANYANG'],['B','웅진의 보급로를 끊는다','UNGJIN']]};
CUTSCENES['CS-G4']={title:'삼한 패권의 결산',lines:[['양원왕','neutral','북방의 위협과 남방의 전쟁을 견뎌냈다. 고구려의 다음 길을 정하라.']],choices:[['A','한강 방어선을 굳히고 북방을 수습한다','DEFEND'],['B','남방 거점을 장악해 패권을 선포한다','HEGEMONY'],['C','밀약과 외교로 삼국의 균형을 만든다','BALANCE']]};
