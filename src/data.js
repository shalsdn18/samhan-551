import { MAP_PRESET_V05 as MAP_DATA_V05 } from './v05_data.js';

export const FACTIONS = {
  SILLA: { id: 'SILLA', name: '신라', color: '#2563eb', border: '#60a5fa' },
  GOGURYEO: { id: 'GOGURYEO', name: '고구려', color: '#dc2626', border: '#f87171' },
  BAEKJE: { id: 'BAEKJE', name: '백제', color: '#ca8a04', border: '#facc15' },
  GAYA: { id: 'GAYA', name: '가야', color: '#7c3aed', border: '#c4b5fd' }
};

export const COUNCILS = { SILLA: '화백회의', GOGURYEO: '제가회의', BAEKJE: '정사암회의' };

export const DIPLOMACY_STATUS = {
  ALLIANCE: { label:'동맹', icon:'🤝' },
  SECRET_PACT: { label:'은밀한 밀약·불가침', icon:'🕊️' },
  NEUTRAL: { label:'경계·대치', icon:'⚖️' },
  WAR: { label:'교전 중', icon:'⚔️' }
};
export const INITIAL_RELATIONS = {
  'BAEKJE|SILLA': { status:'ALLIANCE', expiresAt:null, note:'나제동맹' },
  'GOGURYEO|SILLA': { status:'NEUTRAL', expiresAt:null },
  'BAEKJE|GOGURYEO': { status:'NEUTRAL', expiresAt:null },
  'BAEKJE|GAYA': { status:'NEUTRAL', expiresAt:null },
  'GAYA|SILLA': { status:'NEUTRAL', expiresAt:null },
  'GAYA|GOGURYEO': { status:'NEUTRAL', expiresAt:null }
};
export const relationKey = (a,b) => [a,b].sort().join('|');
export function getRelation(state,a,b) {
  if (a===b) return { status:'ALLIANCE', expiresAt:null };
  return state.relations?.[relationKey(a,b)] || { status:'NEUTRAL', expiresAt:null };
}
export function setRelation(state,a,b,status,expiresAt=null,note='') {
  state.relations ??= {};
  state.relations[relationKey(a,b)]={status,expiresAt,note};
}

export const CLANS = {
  kim_royal: { id:'kim_royal', faction:'SILLA', name:'경주 김씨 왕실', leader:'진흥왕', rank:'왕족', isKing:true, gold:300, privateArmy:1200, loyalty:100, influence:40, fief:'경주 금성' },
  gaya_kim: { id:'gaya_kim', faction:'SILLA', name:'가야 김씨 무장가문', leader:'김무력', rank:'진골(가야계)', isKing:false, gold:220, privateArmy:1500, loyalty:68, influence:30, fief:'관산성' },
  park_noble: { id:'park_noble', faction:'SILLA', name:'경주 박씨 귀족', leader:'박영실', rank:'진골(보수파)', isKing:false, gold:450, privateArmy:1800, loyalty:45, influence:30, fief:'경주 금성' },
  goguryeo_royal: { id:'goguryeo_royal', faction:'GOGURYEO', name:'고구려 왕실', leader:'양원왕', rank:'왕족', isKing:true, gold:500, privateArmy:1800, loyalty:100, influence:40, fief:'평양성' },
  goguryeo_yakbu: { id:'goguryeo_yakbu', faction:'GOGURYEO', name:'연씨 대귀족', leader:'연가 귀족', rank:'5부 대가', isKing:false, gold:620, privateArmy:2100, loyalty:72, influence:45, fief:'국내성' },
  baekje_royal: { id:'baekje_royal', faction:'BAEKJE', name:'백제 왕실', leader:'성왕', rank:'왕족', isKing:true, gold:500, privateArmy:1700, loyalty:100, influence:40, fief:'웅진성' },
  baekje_hae: { id:'baekje_hae', faction:'BAEKJE', name:'해씨 대귀족', leader:'해구', rank:'대성팔족', isKing:false, gold:580, privateArmy:2000, loyalty:70, influence:42, fief:'사비성' },
  gaya_royal: { id:'gaya_royal', faction:'GAYA', name:'대가야 왕실', leader:'이뇌왕', rank:'왕족', isKing:true, gold:400, privateArmy:1100, loyalty:100, influence:35, fief:'고령 대가야궁' }
};

export const FACTION_CAMPAIGNS = {
  SILLA:{leader:'진흥왕',traits:'골품제와 강한 왕권, 화랑도. 한강 진출을 노리지만 귀족 합의와 보급선 관리가 중요합니다.',difficulty:'보통',royalClan:'kim_royal',nobleClan:'park_noble',color:'#2563eb'},
  BAEKJE:{leader:'성왕',traits:'해상 교역과 22담로의 지방 통치. 동맹을 활용해 한성을 탈환하고 관산성에서 승부를 봅니다.',difficulty:'어려움',royalClan:'baekje_royal',nobleClan:'baekje_hae',color:'#ca8a04'},
  GOGURYEO:{leader:'양원왕',traits:'5부 연합과 산성 방어망. 한강 방어선을 지키며 끊어진 적 보급군을 역습합니다.',difficulty:'보통',royalClan:'goguryeo_royal',nobleClan:'goguryeo_yakbu',color:'#dc2626'}
};

export const MAP_PRESET = MAP_DATA_V05;

export const INITIAL_ARMIES = [
  {id:'a_silla_1',name:'신라 직할 북진군',owner:'SILLA',clanId:'kim_royal',q:2,r:2,troops:3000,maxTroops:3000,morale:100,supplied:true,ap:2},
  {id:'a_silla_2',name:'김무력 별동대',owner:'SILLA',clanId:'gaya_kim',q:1,r:3,troops:2200,maxTroops:2200,morale:100,supplied:true,ap:2},
  {id:'a_gogu_1',name:'고구려 북한산성 수비대',owner:'GOGURYEO',clanId:'goguryeo_royal',q:1,r:0,troops:2600,maxTroops:2600,morale:100,supplied:true,ap:1},
  {id:'a_gogu_2',name:'고구려 한성 주둔군',owner:'GOGURYEO',clanId:'goguryeo_royal',q:1,r:1,troops:2000,maxTroops:2000,morale:95,supplied:true,ap:1},
  {id:'a_baekje_1',name:'백제 서해 방면군',owner:'BAEKJE',clanId:'baekje_royal',q:0,r:1,troops:2400,maxTroops:2400,morale:100,supplied:true,ap:1},
  {id:'a_baekje_2',name:'백제 웅진 북진군',owner:'BAEKJE',clanId:'baekje_royal',q:0,r:2,troops:1900,maxTroops:1900,morale:95,supplied:true,ap:1},
  {id:'a_gogu_3',name:'고구려 평양 개마무사군',owner:'GOGURYEO',clanId:'goguryeo_royal',q:0,r:0,troops:2700,maxTroops:2700,morale:100,supplied:true,ap:3,unitType:'CAVALRY',commanderId:'ondal'},
  {id:'a_gogu_4',name:'고구려 아차산성 역습군',owner:'GOGURYEO',clanId:'goguryeo_royal',q:2,r:1,troops:2700,maxTroops:2700,morale:100,supplied:true,ap:3,unitType:'CAVALRY',commanderId:'yeon-dae'}
];

export const TACTICS = [
  {id:'charge',name:'개마무사 돌격',beats:'siege'},
  {id:'siege',name:'산성 농성',beats:'commitment'},
  {id:'commitment',name:'화랑도 결사대',beats:'charge'}
];

export const FACTION_TACTICS = {
  SILLA:[{id:'charge',name:'🔥 화랑도 결사돌격',type:'charge',beats:'ambush'},{id:'formation',name:'🛡️ 육정 장창 방진',type:'formation',beats:'charge'},{id:'ambush',name:'🌲 계곡 매복 복병술',type:'ambush',beats:'formation'}],
  BAEKJE:[{id:'charge',name:'⚔️ 달솔 철기병 돌격',type:'charge',beats:'ambush'},{id:'formation',name:'🛡️ 찰갑 방패 밀집진',type:'formation',beats:'charge'},{id:'ambush',name:'🏹 남조식 강궁 일제사격',type:'ambush',beats:'formation'}],
  GOGURYEO:[{id:'charge',name:'🐎 개마무사 중장돌격',type:'charge',beats:'ambush'},{id:'formation',name:'⛰️ 산성 청야 방어술',type:'formation',beats:'charge'},{id:'ambush',name:'🏹 맥궁 기마궁수 산개',type:'ambush',beats:'formation'}]
};

export const EXTRA_CLANS = {
  SILLA:[['silla_seok','석씨 무장파','이사부','신중파'],['silla_lee','진골 이씨','거칠부','보수파']],
  BAEKJE:[['baekje_sa','사씨 대귀족','사법명','남조 교역파'],['baekje_jin','진씨 대귀족','진무','강경파'],['baekje_mok','목씨 관료파','목협만치','신중 관료파']],
  GOGURYEO:[['goguryeo_go','고씨 방계','남부 대가','수성파'],['goguryeo_ondal','온달 무장파','온달','북부 신흥파']]
};
export const CLAN_LORE = {
  baekje_hae:{region:'한성·웅진 구왕실 외척',famousFor:'478년 문주왕 시해 사건의 해구를 모티프로 삼은 가상 후손 설정',lore:'게임 속 해씨 가문은 478년 문주왕을 시해한 것으로 전하는 해구 본인이 아니라, 그 이름을 잇는 가상의 후손·동명이인 해구를 내세웁니다. 한성 시절부터 병권을 쥐어 온 대성팔족의 무장파라는 서사와 실제 혈연 계보는 구분하며, 고토 회복 전공에 따른 봉토 요구도 창작 설정입니다.'},
  baekje_sa:{region:'사비·금강 수운',famousFor:'남조 양나라와 왜를 잇는 해상 교역',lore:'금강 물길과 남해 항로를 장악해 사비의 창고를 채운 실리파입니다. 북방의 소모전보다 교역로의 안전과 조세 특권을 중시하며, 왕실의 전쟁이 바닷길까지 흔들지 않을지 먼저 따집니다.'},
  baekje_jin:{region:'패하·북방 변경',famousFor:'달솔과 병관좌평을 거듭 배출한 변경 군벌',lore:'고구려와 맞닿은 패하 유역에서 세력을 키운 군사 가문입니다. 빼앗긴 옛 영지를 되찾는 일을 대대로의 원한으로 여기며, 명분이 서면 선봉을 자청합니다.'},
  baekje_mok:{region:'웅진 중앙 조정',famousFor:'한성 함락 뒤 왕실을 보위한 목협만치',lore:'한성 함락 때 개로왕의 명을 받들어 남하한 충신들의 계보를 잇습니다. 뇌물이나 사사로운 전공 약속에는 흔들리지 않고, 충분한 군량과 백성이 납득할 대의가 갖춰져야 출병에 동의합니다.'},
  gaya_kim:{region:'금관가야 옛 땅·관산성',famousFor:'김무력의 관산성 전공과 신라 편입',lore:'가야의 옛 지배층에서 신라의 무장 귀족으로 자리 잡은 가문입니다. 김무력의 전공은 왕실의 신임을 높였지만, 가야계 병사와 토지를 지켜야 한다는 책임도 남겼습니다.'},
  park_noble:{region:'경주·서라벌 구귀족촌',famousFor:'진골 박씨의 왕위 계승 전통',lore:'왕실과 혼맥을 나누며 오래도록 서라벌의 의례와 토지를 지켜 온 명문입니다. 새 전쟁이 골품 질서와 세금 기반을 흔들까 염려하며, 왕권의 약속이 분명할 때에야 협력합니다.'},
  silla_seok:{region:'동해안·실직주 변경',famousFor:'이사부의 우산국 정벌과 변경 개척',lore:'바닷길과 산성의 사정을 모두 아는 변경 무장 가문입니다. 이사부의 신중한 책략을 자랑으로 삼아, 성급한 돌격보다 군량과 퇴로를 먼저 계산합니다.'},
  silla_lee:{region:'경주 조정·한강 방면 군정',famousFor:'거칠부의 국사 편찬과 국경 외교',lore:'문서와 군정에 밝은 관료 귀족으로, 정복의 성과를 나라의 제도로 남기려 합니다. 전쟁은 필요할 수 있으나 백성이 이해할 명분과 뒤를 이을 행정이 먼저라고 주장합니다.'},
  goguryeo_yakbu:{region:'국내성·동부 5부',famousFor:'연씨 대가의 병권과 북방 산성 방어',lore:'5부의 군사를 모으고 산성 방어망을 운용해 온 강경 귀족입니다. 남방의 적이 한강을 넘으면 왕을 재촉해 선제 대응을 요구하지만, 전공과 병권을 왕실에 쉽게 돌려주지는 않습니다.'},
  goguryeo_go:{region:'남부 5부·압록강 안쪽',famousFor:'고씨 방계의 왕실 의례와 수성론',lore:'왕실의 방계로서 오래된 의례와 국내 기반을 중시합니다. 무리한 남진이 북방의 돌궐 압박과 겹치는 것을 경계하며, 성과 군량을 지키는 수성책을 선호합니다.'},
  goguryeo_ondal:{region:'북부 변경·산성 수비선',famousFor:'온달 설화로 전해지는 신진 무장의 입신',lore:'변경의 실전 경험으로 이름을 얻은 신흥 무장 세력입니다. 오래된 5부 귀족의 눈치를 보면서도 산성의 백성과 병사를 먼저 살피며, 능력을 증명할 기회를 기다립니다.'}
};
for(const [id,clan] of Object.entries(CLANS))Object.assign(clan,CLAN_LORE[id]||{region:clan.fief,famousFor:clan.leader,lore:`${clan.name}은 ${clan.fief}을 기반으로 왕실과 조정에 영향력을 행사합니다. ${clan.rank}의 전통을 지키면서 가문의 이익과 나라의 안정을 저울질합니다.`});
export function buildExtraClans(){const result={};for(const [faction,clans] of Object.entries(EXTRA_CLANS))for(const [id,name,leader,rank] of clans)result[id]={id,faction,name,leader,rank,isKing:false,gold:300,privateArmy:900,loyalty:42,influence:25,fief:'변경 영지',...(CLAN_LORE[id]||{})};return result}

export const WORLD_TENSION_EVENTS = {
  northern:{title:'북방 정세',message:'돌궐의 무간가한이 고구려 북방 신성을 압박하여 주력군이 북쪽으로 향했다는 급보입니다.',justification:20,tension:12},
  maritime:{title:'해상 교역 마찰',message:'한강 하구 당항성에서 남조로 향하던 교역선이 적 수군에게 나포되었습니다. 조정에 주전론이 번집니다.',justification:15,tension:10},
  border:{title:'국경 산성 충돌',message:'적 순찰대가 국경 촌락을 약탈했습니다. 조정은 대응을 기다리고 있습니다.',justification:25,tension:15}
};

export const FACTION_START = {
  SILLA:{army:'a_silla_1',clan:'kim_royal',tile:'5,4'},
  GOGURYEO:{army:'a_gogu_3',clan:'goguryeo_royal',tile:'0,0'},
  BAEKJE:{army:'a_baekje_2',clan:'baekje_royal',tile:'1,3'}
};

export { MAP_PRESET_V05, GENERALS, UNIT_TYPES } from './v05_data.js';
