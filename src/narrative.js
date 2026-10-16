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
  'CS-02-B':{title:'믿은 자의 자리',lines:[['태자 여창','shout','신라가... 우리 땅을 집어삼켰다 하십니까! 지금 당장 군을 일으켜야 합니다!'],['성왕','neutral→sad','...알고 있었다. 저들이 흔들리고 있다는 것을. 그런데도 막지 않았다.'],['태자 여창','angry','어찌하여! 아셨다면 어찌 막지 않으셨습니까!'],['성왕','resigned','막았다면, 그들과 당장 전쟁이었다. 지금은 숨을 돌릴 시간이 필요했다. ...내 계산이 틀렸다.']],choices:[['A','지금은 참는다 — 힘을 기른 뒤 갚는다','IGNORE'],['B','지금 당장 선전포고한다','PREEMPT'],['C','여창에게 군권 일부를 맡긴다','DELEGATE']]},
  'CS-04':{title:'관산성의 밤',lines:[['여창','whisper','...버틸 수가 없다. 지원이 오지 않으면.'],['전령','shout','전하께서 친히 오십니다!'],['여창','surprised→sad','아버님이... 어찌하여 이곳까지...'],['신라 삼년산성 군주 · 장군 고간(도도)','neutral','왕이 직접 움직였다. 지금이다.']],baekjeChoices:[['A','성왕이 직접 구원에 나선다','ATTEND'],['B','정예 호위만 보내고 성왕은 후방에 남는다','ABSENT']],sillaChoices:[['A','포로로 잡는다 — 협상의 패로 쓴다','CAPTURED'],['B','...목숨을 취한다','DIES'],['C','퇴로를 열어준다 — 더 큰 전쟁은 원치 않는다','SPARED']]}
};

export const CUTSCENE_CONTEXT = {
  'CS-01':'551년, 한강 유역의 주인은 아직 정해지지 않았습니다. 북쪽의 고구려는 남하를 노리고, 백제와 신라는 서로를 경계하면서도 힘을 합칠 수밖에 없습니다. 오늘 맺는 약속의 문구 하나가 내일의 전쟁에서 누구에게 명분을 줄지 결정합니다.',
  'CS-01-G':'북쪽에서는 돌궐의 압박이 거세지고, 남쪽에서는 백제와 신라의 연합군이 한강을 향해 움직입니다. 양원왕은 산성에 의지해 시간을 벌지, 강을 건너 적의 대오를 흔들지, 두 나라 사이에 쐐기를 박을지 선택해야 합니다.',
  'CS-02-S':'한성의 성벽에 새 깃발이 올랐지만, 승리의 환호는 오래가지 못했습니다. 이사부와 김무력의 군대는 한강 하류로 발걸음을 옮기고, 나제동맹의 문서에는 누구도 답하지 못한 빈칸이 남아 있습니다.',
  'CS-02-B':'553년 가을, 피 흘려 되찾은 한성의 깃발이 채 마르기도 전입니다. 성왕에게 동맹국 신라의 대군이 한강 하류로 향한다는 급보가 도착합니다. 북방의 고구려를 경계해야 하는 순간, 백제 조정은 복수와 인내 사이에서 갈라집니다.',
  'CS-04':'관산성의 밤은 산길을 타고 번진 횃불과 부상병의 신음으로 시작됩니다. 백제 왕실의 친정 여부와 신라군의 포로 처리 결정은 전투의 승패를 넘어 두 나라의 기억을 바꾸게 됩니다. 전령이 마지막 보고를 올리고, 조정은 돌이킬 수 없는 결정을 기다립니다.',
  'CS-04-SILLA':'백제군이 성왕을 모시고 왔다는 소식이 신라 진영에 닿았습니다. 포로로 맞을 것인지, 목숨을 끊을 것인지, 퇴로를 열어 전쟁을 멈출 것인지—이 선택은 관산성 이후의 세력 균형과 후대의 기록을 함께 바꿉니다.',
  'CS-G2':'남방에서는 백제와 신라의 연합군이 한강을 향해 북상한다는 보고가 거듭 올라옵니다. 제가회의는 전쟁에 직접 뛰어들지, 그 틈을 이용할지를 두고 갈라졌습니다. 오늘의 안건은 신라 쪽에서 흘러나온 불가침 제안을 공식으로 받아들일 것인가입니다.',
  'CS-G3':'한강의 성문이 흔들린다는 보고가 들어옵니다. 밀약을 맺었든 거절했든, 이제는 실제로 군을 움직여야 합니다. 단양 적성을 향해 진군할지, 웅진의 보급로를 노릴지 결정해야 합니다.',
  'CS-G4':'남방의 전쟁과 제가회의의 선택을 돌아볼 때가 되었습니다. 북방의 돌궐은 여전히 변경을 압박하고, 남방에는 백제와 신라의 전선이 이어집니다. 이제 고구려가 다음 시대를 어떤 방책으로 맞을지 정합니다.'
};

export const GOGURYEO_PACT_CONFIRMATION = {
  PACT:[['제가회의 대가','neutral','앞서 신라의 밀약을 받아들이기로 결정하셨습니다. 오늘은 그 결정을 확인할 뿐, 약조를 새로 맺거나 보상을 거듭 받는 자리가 아닙니다.'],['고목근','neutral','결정은 이미 내려졌습니다. 이 일은 밖으로 새어나가지 않게 하고, 북방 방어를 이어가겠습니다.']],
  REFUSE:[['제가회의 대가','neutral','앞서 신라의 제안을 거부하기로 결정하셨습니다. 오늘은 그 결정을 확인할 뿐, 선택을 번복하거나 보상을 거듭 받는 자리가 아닙니다.'],['고흘','relieved','성벽은 우리 손으로 지킵니다. 이미 내린 판단을 따르겠습니다.']]
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
CUTSCENES['CS-G2']={title:'밀약의 그림자',lines:[['제가회의 대가','neutral','남쪽 동맹의 결속이 아직 완전하지 않습니다. 신라 쪽에서 흘러나온 말이 있습니다 — 서로 건드리지 않는다면, 양쪽 모두 다른 전선에 집중할 수 있다는 뜻이지요.'],['고목근','neutral→ambitious','건드리지 않는다는 말을 믿을 필요는 없습니다. 다만 이용할 필요는 있습니다. 신라가 먼저 숨을 죽이겠다면, 우리는 그 틈에 북방을 정리할 수 있습니다.'],['고흘','bitter','틈을 이용하는 것과, 맹약도 아닌 말을 믿고 전력을 돌리는 것은 다릅니다. 상비군을 빼면 한강 이북의 방어가 비게 됩니다.'],['양원왕','neutral','믿음의 문제가 아니다. 지금 우리에게 필요한 것이 무엇인지의 문제다.'],['고목근','neutral','전하, 신라와 백제가 서로 소모되는 동안 우리가 가만히 지켜보는 것만으로도 이득입니다. 밀약은 그 시간을 조금 더 벌어줄 뿐입니다.'],['고흘','resigned','...그 말에는 동의합니다. 다만 이 일이 밖으로 새어나가면, 백제와 대가야 모두에게 신의 없는 나라로 낙인찍힌다는 것은 전하께서도 아셔야 합니다.']],choices:[['A','밀약을 맺고 남방을 묶는다','PACT'],['B','밀사를 돌려보내고 방어에 집중한다','REFUSE']]};
CUTSCENES['CS-G3']={title:'남진의 깃발',lines:[['양원왕','shout','한강의 성문이 흔들린다. 이제 단양과 웅진으로 진격해 남방의 주도권을 되찾으라!'],['고흘','neutral','전하, 단양으로 곧장 가면 신라와 정면으로 부딪칩니다. 성과는 크지만 아군의 손실도 그만큼 클 것입니다.'],['온달','excited','소장에게 기병을 내려주신다면, 웅진의 보급로를 끊어보겠습니다. 아직 이름 없는 변경 무장이나, 길은 알고 있습니다.'],['고목근','bitter','보급로를 끊는 것은 시간이 걸리는 일이다. 단양을 직접 치는 것이 더 분명한 성과를 남긴다.'],['고흘','resigned','분명한 성과와 분명한 손실은 늘 함께 옵니다. 전하께서 고르셔야 합니다.'],['양원왕','neutral','...두 길 다 쉬운 길은 아니군. 하나를 고른다.']],choices:[['A','단양 적성을 향해 진군한다','DANYANG'],['B','웅진의 보급로를 끊는다','UNGJIN']]};
CUTSCENES['CS-G4']={title:'삼한 패권의 결산',lines:[['양원왕','neutral','북방의 위협과 남방의 전쟁을 견뎌냈다. 고구려의 다음 길을 정하라.'],['고흘','neutral','전하, 지금껏 지켜낸 한강 이북의 방어선을 더 굳히는 것이 가장 확실한 길입니다. 무리하게 남으로 뻗으면 북방이 비게 됩니다.'],['고목근','ambitious','백제와 신라가 서로 소모된 지금이야말로, 남방의 거점을 장악해 옛 영향력을 되찾을 때입니다. 이 기회를 놓치면 다시 오지 않습니다.'],['제가회의 대가','neutral','두 분 다 옳습니다. 다만 전하, 반드시 하나만 고르실 필요는 없습니다. 밀약과 외교로 균형을 만드는 길도 있습니다 — 영광은 적으나, 피를 덜 흘립니다.'],['고흘','bitter','균형이라는 것은, 지키는 자의 입장에서는 안전하나 백성들에게는 보이지 않는 공로입니다.'],['고목근','neutral','...그래도 틀린 말은 아니군. 전하의 결정에 따르겠습니다.'],['양원왕','resigned','방어도, 패권도, 균형도 — 모두 다음 시대의 고구려를 걸고 하는 선택이다.']],choices:[['A','한강 방어선을 굳히고 북방을 수습한다','DEFEND'],['B','남방 거점을 장악해 패권을 선포한다','HEGEMONY'],['C','밀약과 외교로 삼국의 균형을 만든다','BALANCE']]};

export const GOGURYEO_REACTIONS={
 'CS-G2':{PACT:[['고목근','neutral','결정하셨으니, 이 일은 제가회의 밖으로 새어나가서는 안 됩니다.'],['고흘','bitter','...알겠습니다. 다만 방어선의 병력은 제가 계속 지키겠습니다.']],REFUSE:[['고흘','relieved','현명한 판단입니다. 믿을 수 없는 약속보다, 우리 손으로 지킨 성벽이 낫습니다.'],['고목근','bitter','...기회라는 것은, 한 번 지나가면 다시 오지 않는 법입니다.']]},
 'CS-G3':{DANYANG:[['양원왕','neutral','단양으로 간다. 고흘, 방어선이 비지 않도록 뒤를 맡기겠다.'],['고흘','neutral','...예, 전하. 성문은 지키겠습니다.']],UNGJIN:[['온달','determined','기병을 주시면 반드시 끊어 보이겠습니다.'],['고목근','bitter','...시간이 얼마나 걸릴지는, 전장에 가봐야 알겠지.']]},
 'CS-G4':{DEFEND:[['고흘','relieved','...옳은 선택입니다, 전하. 성벽은 제가 끝까지 지키겠습니다.'],['고목근','resigned','...기회는 놓쳤으나, 적어도 우리는 잃지 않았습니다.']],HEGEMONY:[['고목근','neutral','전하의 결단에 감사드립니다. 이 성과는 반드시 지켜내겠습니다.'],['고흘','worried','...북방은 제가 맡겠습니다만, 전하, 뒤를 자주 돌아보셔야 할 것입니다.']],BALANCE:[['제가회의 대가','neutral','눈에 띄지 않는 길입니다만, 가장 많은 백성을 살리는 길이기도 합니다.'],['양원왕','neutral','...영광이 적어도, 다음 왕에게 더 많은 나라를 물려줄 수 있다면 그것으로 되었다.']]}
};

// Expanded sidequest scenes and epilogues transcribed from _workspace/08_sidequests_and_endings_expanded.md.
// Choice IDs and reward objects above remain the campaign's stable contract.
export const SIDE_QUEST_SCRIPTS={
 'SQ-01':{background:'금성의 늦가을, 한강 전역의 세곡 장부를 실무로 맞춘 6두품 문관 설원의 공은 품계가 아니라 구전으로만 떠돕니다. 화백회의의 자리는 여전히 성골과 진골의 몫입니다. 오늘 그는 처음으로 왕 앞에서 침묵을 깨려 합니다.',dialogue:[['설원','neutral→bitter','전하, 신은 지난 삼 년간 한강 하류의 세곡 장부를 홀로 맞췄습니다. 헌데 공을 셈할 때마다 돌아오는 답은 하나입니다 — 6두품은 아찬 이상에 오를 수 없다.'],['진흥왕','neutral','...그 장부가 아니었다면 이번 전역의 보급은 반으로 줄었을 것이다. 알고 있다.'],['설원','whisper→sad','알면서도 바뀌지 않는 것이 골품이라는 것도 압니다. 저와 같은 자 열이면 아홉은 조용히 등을 돌릴 것입니다.'],['거칠부','bitter','선례를 남기면 진골 가문들의 반발이 큽니다. 다만 선례가 없다는 것도 결국 하나의 선택입니다.'],['이사부','neutral','전쟁은 숫자로 시작되고, 숫자는 저 사람 같은 자가 맞춘다. 결정을 미루는 것 자체가 이미 답입니다.']],reactions:{reform:[['설원','grateful','전하의 결정이 옳았음을, 신이 셈이 아니라 공으로 보이겠습니다.'],['거칠부','neutral','국사에 이 일을 어떻게 적을지는... 두고 봐야겠군.']],defer:[['설원','resigned','알겠습니다. 다음에도 장부는 신이 맞추겠습니다. 그뿐입니다.']] }},
 'SQ-02':{background:'사비성에서 뱃길로 열흘, 서남 담로를 다스리는 왕족 여예는 작년 흉작의 여파를 수습 중입니다. 관산성 원정을 앞두고 중앙 조정은 병력과 세곡을 더 내라 합니다. 왕족 지방 통치라는 성왕의 설계가 이곳에서 시험받습니다.',dialogue:[['여예','worried','전하, 소신이 다스리는 담로는 작년 흉작으로 곡식이 모자랍니다. 그런데 중앙에서는 관산성 원정을 위해 병력과 세곡을 더 내라 하십니다.'],['성왕','neutral','담로는 왕실의 눈이자 손이다. 네가 버티지 못하면 그 땅은 왕실의 것이 아니게 된다.'],['여예','neutral→sad','백성이 굶으면서 왕실에 충성할 수는 없습니다. 교역로를 열어주시면 스스로 곡식을 구하겠습니다.'],['사법명','neutral','왜와 남조로 가는 뱃길은 타진해 두었습니다. 교역을 허락하면 담로의 독립성도 커진다는 점을 함께 셈해야 합니다.'],['성왕','resigned','...그 모든 것을 셈하고도, 지금은 담로가 쓰러지지 않는 쪽이 더 중하다.']],reactions:{appoint:[['여예','neutral','군정이 강해지면 흉작도 버틸 수는 있겠지요. 백성의 마음까지 병력으로 지킬 수는 없다는 것만 기억해 주십시오.']],trade:[['여예','relieved','감사합니다, 전하. 뱃길이 다시 열리면 담로는 왕실의 손이 아니라 숨통이 되어 보이겠습니다.']]}},
 'SQ-03':{background:'고령 대가야궁, 이뇌왕의 이름으로 보낸 밀서 두 장이 있습니다. 한 장은 백제에게, 한 장은 신라에게 향합니다. 철을 쥔 채 두 강국 사이에서 버텨온 대가야의 생존법이 오늘 밤 들통날 위기입니다.',dialogue:[['신라계 가야 수장','whisper','수장께서 신라에 보낸 밀서를 보았습니다. 백제에도 같은 약조를 하셨다지요.'],['백제계 가야 장인','neutral→worried','두 강국 모두에게 다른 말을 했다는 것이 드러나면, 우리는 양쪽 모두의 적이 됩니다.'],['대가야 수장','resigned','철을 캐는 자가 전쟁을 택할 수는 없다. 어느 쪽에도 전부를 주지 않는 것, 그것이 우리가 아는 유일한 생존법이다.'],['우륵','sad','생존법이라 부르든 거짓이라 부르든, 그 끝에서 노래할 사람이 남아 있기만 하면 됩니다.'],['신라계 가야 수장','bitter','그 법이 언제까지 통할지는 모르겠군요.']],reactions:{conceal:[['대가야 수장','relieved','오늘은 숨을 돌렸다. 허나 밀서가 하나 더 나오면 다음엔 숨을 곳이 없다는 것도 잊지 말아야 한다.']],expose:[['신라계 가야 수장','grateful','현명한 선택입니다. 신라는 솔직한 자를 기억합니다.'],['백제계 가야 장인','bitter','...그리고 백제는 등 돌린 자를 기억하겠지요.']]}},
 'SQ-04':{background:'국내성 태학의 서고에서 젊은 무관 고식은 신라가 보낸 불가침 밀서 초안을 발견합니다. 계루부 방계 귀족 고목근은 이 소식을 듣고 제가회의를 소집합니다. 아래의 인물과 밀서 발견담, 왕실 내부 갈등은 창작 설정이며 확인된 역사 기록이 아닙니다.',dialogue:[['고식','neutral→surprised','국내성 태학의 서고에서 이것을 찾았습니다. 신라 조정이 보낸 밀사의 서신 초안입니다 — 우리에게 불가침을 제안하고 있습니다.'],['고목근','bitter','신라가 먼저 숙인다는 것은 저들도 백제와의 결전이 두렵다는 뜻이다. 지금 손을 잡으면 남방의 압박이 줄고 우리는 북방에 집중할 수 있다.'],['제가회의 대가','neutral','다만 이것이 드러나면 백제와 대가야 모두에게 신의 없는 나라로 낙인찍힙니다. 그 대가도 셈해야 합니다.'],['고목근','neutral→ambitious','낙인은 지워지지만 기회는 다시 오지 않는다. 대가는 내가 치르겠다.'],['고식','whisper','...소신은 그저 서고에서 종이 한 장을 찾았을 뿐인데, 나라의 방향을 바꾸는 일이 되었습니다.']],reactions:{accept:[['고목근','neutral','좋다. 이 일은 제가회의 밖으로 새어나가서는 안 된다. 고식, 네가 찾은 종이는 네가 다시 묻어라.'],['고식','resigned','...예. 다만 역사에는 결국 남겨질 것입니다. 종이란, 묻어도 썩지 않는 법이니까요.']],refuse:[['제가회의 대가','neutral','중립이 가장 떳떳한 길이다. 다만 떳떳함이 북방의 압박을 막아주지는 않는다는 것도 각오해야 한다.']]}},
 'SQ-05':{background:'화랑도에서 창과 활을 익힌 사다함이 이사부 앞에 섭니다. 훗날 대가야 원정에서 이름을 떨칠 전승과 달리, 551년의 나이와 이 첫 전장의 분기는 게임의 가상 전개입니다. 재능이 그를 지켜줄지는 누구도 장담하지 못합니다.',dialogue:[['사다함','excited','장군님, 소자는 화랑도에서 창과 활을 익혔습니다. 이제 실전에 나설 때라 생각합니다.'],['이사부','neutral','전장은 네가 익힌 것을 묻지 않는다. 묻는 것은 하나뿐이다 — 살아서 돌아올 수 있는가.'],['사다함','neutral→determined','살아서 돌아오는 것이 전부라면 전장에 설 이유가 없습니다. 다만 저는 돌아오고 싶습니다. 그러니 가르침을 더 청합니다.'],['구진','neutral','장군, 저 아이의 눈은 겁을 모릅니다. 그것이 재능인지 위험인지는 저도 아직 모르겠습니다.'],['이사부','bitter→neutral','...그 말 하나는 나이답지 않게 옳구나.']],reactions:{train:[['이사부','grateful','...잘 키웠다고 할 만하군. 이제 내가 걱정할 일이 하나는 줄었다.']],deploy:[['이사부','sad→neutral','...용맹했다. 그것만은 누구도 부정 못 한다.']]}}
};

export const ENDING_EPILOGUES={
 A:{settlement:'554년 늦가을, 관산성에서 성왕이 전사했다는 소식이 사비에 닿습니다. 백제 조정은 왕의 죽음과 남은 군대의 수습을 함께 감당합니다.',essay:'성왕의 친정은 용기와 조급함을 함께 품었습니다. 동맹을 믿었던 왕이 전장에서 목숨을 잃은 비극을 딛고 백제가 다시 일어서는 길을 그립니다.',people:[['성왕','전사 분기가 선택된 경우에만 관산성에서 전사한 것으로 기록합니다.'],['진흥왕','한강을 얻었으나 동맹을 저버렸다는 평가를 함께 짊어집니다.'],['이사부','기습을 경고했던 말이 무거운 책임으로 남습니다.'],['거칠부','승리를 국사에 어떻게 기록할지 고심합니다.']]},
 B:{settlement:'한강 하류는 신라의 지배 아래 놓이고 백제는 큰 손실을 입지만 국가를 유지합니다. 대가야는 강해진 신라의 그림자 아래 생존을 다시 계산합니다.',essay:'승리한 자에게 역사는 관대해도 결백을 보장하지 않습니다. 통합의 설계와 동맹 배신의 흔적이 함께 기록됩니다.',people:[['성왕 (생존 시)','전사 분기가 아니라 생존·귀환 상태일 때만 표시합니다.'],['진흥왕','순행과 축성으로 통합 군주의 입지를 다지지만 신의 문제는 그림자로 남습니다.'],['이사부','경고가 맞았음을 증명했으나 공으로 내세우지 않습니다.'],['거칠부','승리를 정복이 아니라 회복으로 기록하려 애씁니다.']]},
 C:{settlement:'문서 없는 맹약은 책임을 묻지 못한 채 무너집니다. 성왕이 전사하고 한강을 둘러싼 두 나라는 장기 소모전에 들어가며, 대가야의 자치도 약해집니다.',essay:'문서가 없어서 전쟁이 난 것은 아니지만, 문서가 없어 사죄와 책임도 남지 않았습니다. 이 시기는 삼한이 많이 피 흘리고 적게 얻은 때로 그립니다.',people:[['성왕','전사 분기에서만 전사합니다.'],['태자 여창','성왕 사망과 여창 생존·계승이 모두 설정된 때만 즉위 후일담을 표시합니다.'],['진흥왕','영토와 함께 끝날 줄 모르는 전쟁을 얻습니다.'],['이사부·거칠부','맹약을 문서로 남기지 못한 책임을 조정에서 되짚습니다.']]},
 D:{settlement:'전면전은 피하고 양국은 상처를 안은 채 각자의 조정으로 돌아갑니다. 성왕은 전사하지 않은 경로로 처리되며 다음 세대에 대화할 자리가 남습니다.',essay:'완전한 승리만이 전쟁의 끝은 아닙니다. 더 큰 파국을 피하고 돌아갈 자리를 남긴 선택도 작은 지혜로 기록합니다.',people:[['성왕','포로 귀환·퇴로·친정 불참 등 실제 선택 상태에 맞춰 생존 후일담을 표시합니다.'],['태자 여창','아버지의 부재 또는 생환을 지켜보며 성급한 결정의 대가를 배웁니다.'],['진흥왕','정복자도 패자도 아닌 위치에서 다음 기회를 기다립니다.']]},
 'H-NORTH':{settlement:'고구려와의 불가침 밀약은 공식 기록에 남지 않습니다. 성왕이 전사하지 않은 결말에서만 이 히든 경로를 적용하고, 백제 조정은 전황이 기운 이유를 알지 못합니다.',essay:'사관이 알지 못하는 거래는 사서에 기록되지 못합니다. 이는 사관의 결함이 아니라 권력의 본성이라는 창작 사론입니다.',people:[['고목근·고식','밀약과 서고 일화는 가상 설정이며 공식 기록 밖의 후일담으로 다룹니다.'],['양원왕','남방에 개입하지 않고 북방 방어에 집중합니다.'],['성왕','생존 상태일 때만 의문을 품은 후일담을 표시합니다.']]},
 'H-IRON':{settlement:'대가야는 어느 한쪽에 완전히 흡수되지 않고 두 강국 사이에서 숨 쉴 시간을 얻습니다. 554년 뒤 왕위 계승은 불확실한 공백으로 남깁니다.',essay:'큰 나라의 전쟁만이 역사는 아닙니다. 철과 노래, 외교로 버틴 나라의 생존 또한 기록할 가치가 있다는 창작 사론입니다.',people:[['대가야 왕실','이뇌왕 이후의 정확한 계승은 불확실하다고 표시합니다.'],['우륵','가야에 머무는 이 결말은 실제 후일의 귀부와 구분되는 가상 분기입니다.'],['진흥왕','대가야를 완전히 얻지 못한 채 신라의 전쟁을 수습합니다.'],['성왕 (생존 시)','관산성 사건의 실제 결과에 따라 생존 후일담만 표시합니다.']]},
 'G-DEFEND':{settlement:'양원왕은 산성망과 청야전술로 한강 이북을 지킵니다. 양국이 한강 하류에서 소모전을 벌이는 동안 고구려는 다음 세대의 힘을 비축합니다.',essay:'싸우지 않고 지킨 땅이 싸워 얻은 땅보다 못하다고 할 수 없습니다. 인내를 택한 방책을 소극성으로만 평하지 않는 창작 사론입니다.',people:[['양원왕','북방 압박과 남방 균형을 함께 관리한 군주로 그립니다.'],['고흘','산성 방어망을 설계한 인물로 그리되 세부 전술은 창작입니다.'],['온달','이 시기의 변경 전공은 가상 전개입니다.']]},
 'G-HEGEMONY':{settlement:'양원왕은 남방 거점 장악을 목표로 패권 회복을 선포합니다. 실제로 점령한 땅의 범위는 전황 기록에 따라 별도로 확인합니다.',essay:'패권 회복을 선언한 군주에게 사관은 묻습니다. 그 선언이 신뢰까지 얻었는가. 남방 백성에게 그 깃발이 보호인지 압제인지는 남겨 둡니다.',people:[['양원왕','남방 패권 회복을 선언한 군주로 기록됩니다.'],['고목근','적극 노선으로 제가회의에서 영향력을 얻습니다.'],['연씨 대가','군사력에 비례해 왕권에 대한 발언력이 커집니다.']]},
 'G-BALANCE':{settlement:'양원왕과 제가회의는 밀약과 외교로 균형을 설계하고 직접 영토 확장 대신 북방에 집중할 여력을 확보합니다.',essay:'균형을 지킨 공은 눈에 띄지 않아도 작지 않습니다. 이를 눈에 띄지 않는 지혜라 평하는 창작 사론입니다.',people:[['양원왕','화려한 정복보다 안정적인 통치를 택한 군주로 평가됩니다.'],['제가회의 대가들','왕권과 귀족 권력 사이의 균형을 관리합니다.'],['고식','태학 기록관의 후일담은 게임의 가상 인물 설정입니다.']]}
};
