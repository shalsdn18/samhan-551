// v0.5 strategic map, commander roster, and unit definitions.
export const MAP_PRESET_V05 = [
 ['pyongyang','평양성','CAPITAL','GOGURYEO',0,0,2.5],['hwangju','황주성','FORT','GOGURYEO',1,0,2.2],['gaeseong','개성(동비홀)','TOWN','GOGURYEO',2,0,1.8],['cheorwon','철원(마전천)','TOWN','GOGURYEO',3,0,1.5],['chuncheon','춘천(맥국)','TOWN','GOGURYEO',4,0,1.5],['haslla','하슬라(강릉)','PORT','GOGURYEO',5,0,1.5],
 ['bukjin-port','북진항','PORT','GOGURYEO',0,1,1.5],['bukhansan','북한산성','FORT','GOGURYEO',1,1,2.5],['achasan','아차산성','FORT','GOGURYEO',2,1,2.3],['bukhan-river','북한강 나루','TOWN','GOGURYEO',3,1,1.4],['jungnyeong-north','죽령 북방','FORT','GOGURYEO',4,1,1.7],['siljik','실직주(삼척)','PORT','SILLA',5,1,1.4],
 ['danghang','당항성','PORT','BAEKJE',0,2,1.8],['hanseong','한성(옛 도읍)','CAPITAL','GOGURYEO',1,2,2.5],['namhansan','남한산성(한산)','FORT','GOGURYEO',2,2,2.0],['chungju','충주(국원소경)','TOWN','GOGURYEO',3,2,1.6],['danyang','단양 적성','FORT','SILLA',4,2,2.2],['jukryeong','죽령','FORT','SILLA',5,2,1.8],
 ['geum-river-port','금강 수군항','PORT','BAEKJE',0,3,1.5],['ungjin','웅진성(공주)','CAPITAL','BAEKJE',1,3,1.8],['gwansan','관산성(옥천)','FORT','SILLA',2,3,2.2],['boeun','보은 삼년산성','FORT','SILLA',3,3,2.4],['chupung','추풍령','FORT','SILLA',4,3,1.9],['sangju','상주(사벌주)','TOWN','SILLA',5,3,1.5],
 ['byeokgol','벽골제(김제)','TOWN','BAEKJE',0,4,1.6],['sabi','사비성(부여)','CAPITAL','BAEKJE',1,4,1.8],['iksan','익산(금마저)','TOWN','BAEKJE',2,4,1.5],['hapcheon','대야성(합천)','FORT','SILLA',3,4,1.9],['goryeong','고령 대가야궁','CAPITAL','GAYA',4,4,1.8],['geumseong','경주 금성','CAPITAL','SILLA',5,4,2.0],
 ['tamna','탐라·남해 교역항','PORT','BAEKJE',0,5,1.4],['naju','나주(발라)','TOWN','BAEKJE',1,5,1.4],['namwon','남원(고룡)','TOWN','BAEKJE',2,5,1.4],['anra','안라국(함안 철산지)','FORT','GAYA',3,5,1.7],['gaya-gimhae','김해 금관포','PORT','GAYA',4,5,1.6],['ulsan','울산 굴아화촌','PORT','SILLA',5,5,1.5]
].map(([id,name,type,owner,q,r,def])=>{const specialty={byeokgol:'🌾 곡창',chuncheon:'🐎 마장',goryeong:'⛏️ 철산지',anra:'⛏️ 철산지',danghang:'⛵ 교역항',tamna:'⛵ 교역항','gaya-gimhae':'⛵ 교역항'}[id]||null;const prosperity=type==='CAPITAL'?5:type==='FORT'?3:type==='PORT'?3:2;const yields={gold:type==='CAPITAL'?24:type==='PORT'?18:type==='TOWN'?12:8,food:id==='byeokgol'?65:type==='CAPITAL'?45:type==='TOWN'?32:20,iron:['goryeong','anra','ulsan'].includes(id)?18:0,horses:id==='chuncheon'?18:0};return{q,r,owner,terrain:type==='FORT'?'산악':type==='PORT'?'해안':'평야',assimilationTurns:0,isCore:true,resistance:0,compliance:100,occupationPolicy:'BALANCED',occupationOriginOwner:owner,prosperity,specialty,yields,buildings:{farm:0,forge:0,stable:0,fort:0,supply:0},isSupplyHub:false,rulerClanId:({SILLA:'kim_royal',BAEKJE:'baekje_royal',GOGURYEO:'goguryeo_royal',GAYA:'gaya_royal'})[owner]||null,node:{id,name,type,def,isSupplyHub:['CAPITAL','FORT','PORT'].includes(type)}}});
export const UNIT_TYPES={
 INFANTRY:{label:'삼한 농민 창병',gold:140,food:250,iron:0,horse:0,ap:2,damage:12,toughness:22,pursuit:0,screen:15,siege:0,counter:'CAVALRY',description:'값싸고 빠르게 소집되는 대기병 방패 보병.'},
 ARCHER:{label:'삼한 사냥꾼·단궁병',gold:180,food:250,iron:0,horse:0,ap:2,damage:24,toughness:12,pursuit:5,screen:10,siege:0,counter:'HEAVY_INFANTRY',description:'개전 직후 원거리 선제 사격을 가합니다.'},
 HEAVY_INFANTRY:{label:'중장보병',gold:250,food:300,iron:40,horse:0,ap:1,damage:34,toughness:38,pursuit:5,screen:20,siege:.1,fortDefense:1.3,description:'유지력이 높고 성벽 공략에도 유리합니다.'},
 CAVALRY:{label:'기병',gold:300,food:350,iron:50,horse:50,ap:3,damage:45,toughness:25,pursuit:40,screen:25,siege:0,plains:1.35,counter:'ARCHER',description:'평야 충격전과 추격에 강합니다.'},
 SILLA_SPEAR:{label:'🔱 신라 장창당',gold:220,food:300,iron:25,horse:0,ap:2,damage:28,toughness:28,pursuit:0,screen:20,siege:0,counter:'CAVALRY',terrainBonus:'산악',description:'기병을 막고 산악 방어에 강합니다.'},SILLA_CROSSBOW:{label:'🎯 삼한 정예 쇠뇌병',gold:240,food:280,iron:35,horse:0,ap:2,damage:42,toughness:18,pursuit:0,screen:5,siege:.1,counter:'HEAVY_INFANTRY',description:'중보병 관통과 수성 화력에 강합니다.'},SILLA_HWARANG:{label:'🌸 화랑·낭도 결사대',gold:280,food:320,iron:40,horse:0,ap:2,damage:45,toughness:34,pursuit:20,screen:20,siege:0,description:'사기 저하에 강한 정예 올라운더입니다.'},
 GOG_AXE:{label:'🪓 정예 예맥 부월수',gold:230,food:300,iron:35,horse:0,ap:2,damage:40,toughness:26,pursuit:10,screen:10,siege:.3,counter:'INFANTRY',description:'방패 진형 파쇄와 산성 공성에 특화됩니다.'},GOG_HORSE_ARCHER:{label:'🐎 기마 맥궁병',gold:250,food:300,iron:20,horse:35,ap:3,damage:42,toughness:20,pursuit:40,screen:30,siege:0,counter:'HEAVY_INFANTRY',description:'기동력과 추격·차단을 겸비합니다.'},GOG_KAE:{label:'🐴 고구려 개마무사',gold:320,food:350,iron:50,horse:50,ap:3,damage:75,toughness:40,pursuit:35,screen:10,siege:0,counter:'ARCHER',plains:1.5,description:'평야 충격전에 강한 철갑 중기병입니다.'},
 BAEKJE_GUARD:{label:'🛡️ 위례 근위대·호위 환도병',gold:240,food:300,iron:35,horse:0,ap:2,damage:34,toughness:38,pursuit:5,screen:30,siege:0,description:'높은 유지력과 차단력을 갖춘 방진 보병입니다.'},BAEKJE_SWORD:{label:'⚔️ 백제 횡대도위·가야 판갑병',gold:260,food:300,iron:45,horse:0,ap:2,damage:48,toughness:28,pursuit:15,screen:10,siege:.1,counter:'INFANTRY',description:'고화력 중보병으로 적 전열을 압박합니다.'},BAEKJE_CAVALRY:{label:'🐎 부여 백의 기병',gold:250,food:300,iron:25,horse:40,ap:3,damage:35,toughness:22,pursuit:55,screen:35,siege:0,counter:'ARCHER',description:'승리 후 추격전에 특화된 경기병입니다.'}
};
const roster=[
 ['jinheung','진흥왕','SILLA',83,61,82,91,['충신']],['isabu','이사부','SILLA',88,92,71,78,['산성 수비관']],['geochilbu','거칠부','SILLA',79,57,94,83,['충신']],['kim-muryok','김무력','SILLA',84,90,63,72,['개마무사 지휘관']],['sadaham','사다함','SILLA',74,95,58,67,['사기 진작']],['dogdo','고간(도도)','SILLA',71,88,62,60,['산성 수비관']],['gujin','구진','SILLA',77,82,65,68,['충신']],['silla-young','신진 무관','SILLA',62,73,69,64,['야심가']],['six-rank','6두품 문관','SILLA',48,40,89,93,['충신']],
 ['seongwang','성왕','BAEKJE',85,68,86,94,['충신']],['yeochang','왕자 여창','BAEKJE',78,88,70,76,['사기 진작']],['haegu','해구','BAEKJE',87,91,65,57,['야심가']],['sabeopmyeong','사법명','BAEKJE',69,50,88,90,['해상 교역가']],['jinmu','진무','BAEKJE',80,89,68,63,['개마무사 지휘관']],['mokhyemanchi','목협만치','BAEKJE',73,45,91,87,['충신']],['gio','기오','BAEKJE',67,78,72,71,['철기 장인']],['ambitious-baekje','정치적 야심가 무장','BAEKJE',62,86,54,61,['야심가']],
 ['yangwon','양원왕','GOGURYEO',80,65,82,90,['충신']],['ondal','온달','GOGURYEO',76,96,64,66,['사기 진작']],['goheul','고흘','GOGURYEO',82,87,71,69,['산성 수비관']],['yeon-dae','연씨 대가','GOGURYEO',85,83,72,81,['개마무사 지휘관']],['go-mokgeun','고목근(高木根)','GOGURYEO',70,76,77,84,['야심가']],['gosik-young','고식(高式)','GOGURYEO',68,88,85,74,['사기 진작']],
 ['ureuk','우륵','GAYA',60,42,91,78,['해상 교역가']],['inoe','이뇌왕','GAYA',75,62,77,89,['충신']],['gaya-silla-chief','신라계 가야 수장','GAYA',71,72,74,80,['야심가']],['gaya-craft','백제계 가야 장인','GAYA',55,59,86,73,['철기 장인']]
];
const GENERAL_BIOS={
 jinheung:['신라 왕실의 군주로, 한강 유역 진출과 순수비 건립을 통해 왕권과 대외 영향력을 넓힌 인물이다. 게임의 조정 갈등과 대화는 극적 재구성이다.','사료 인물 · 왕실 갈등은 창작'],
 isabu:['신라의 장군으로 우산국 정벌과 대가야 원정 등으로 알려졌다. 이 시기 한강 전역에서의 세부 발언과 관계 묘사는 게임을 위한 창작이다.','사료 인물 · 대화는 창작'],
 geochilbu:['신라의 장군이자 역사를 편찬한 인물로 전한다. 전쟁 기록을 둘러싼 내면의 갈등은 창작 설정이다.','사료 인물 · 내면 묘사는 창작'],
 'kim-muryok':['금관가야계 김씨 출신으로 신라의 장수 김무력이다. 가야계 무장 세력의 정치적 이해를 둘러싼 구체적 대화는 창작이다.','사료 인물 · 가문 관계 일부는 재구성'],
 sadaham:['화랑 출신으로 알려진 신라의 젊은 장수다. 551년 시점의 나이와 관산성에서의 생사 분기는 게임의 가상 전개이며 실제 생몰 기록으로 단정하지 않는다.','사료 인물 · 연대·분기는 가상'],
 dogdo:['관산성 전투 기록에 등장하는 신라 장수 도도와 고간의 결합 표기다. 두 호칭의 관계와 개인의 상세 행적은 사료가 분명하지 않아 게임에서 구성했다.','사료 기록은 불확실 · 인물 설정 재구성'],
 gujin:['신라 장수 구진으로 설정된 인물이다. 구체적인 전공과 이사부·사다함과의 대화는 창작으로, 확인되는 사료 사실과 구분한다.','사료 불확실 · 대화는 창작'],
 'silla-young':['특정 사료 인물을 지칭하지 않는 신진 무관이다. 화랑·진골 귀족 사이의 긴장을 보여주기 위해 만든 가상 인물이다.','가상 인물'],
 'six-rank':['6두품 문관을 대표하는 창작 인물이다. 골품제의 제약이라는 역사적 배경 위에 설원 개인의 공적·갈등을 허구로 구성했다.','가상 인물 · 제도 배경은 역사적'],
 seongwang:['백제의 성왕으로, 사비 천도와 국정 개혁을 추진하고 554년 관산성 전투에서 전사한 것으로 전한다. 게임의 궁중 대화와 선택형 분기는 창작이며, 실제 경위의 기록 차이를 단정하지 않는다.','사료 인물 · 대화·분기는 창작'],
 yeochang:['성왕의 아들 여창으로, 훗날 위덕왕이 된다. 관산성에서의 행동과 즉위는 게임 선택에 따른 가상 분기이며 성왕 사망과 여창 생존이 함께 성립할 때만 즉위 후일담을 표시한다.','사료 인물 · 분기 조건부'],
 haegu:['게임 속 해구는 478년 문주왕을 시해한 것으로 전하는 해구 본인이 아니다. 이름을 잇는 가상의 후손·동명이인으로 설정했으며 실제 혈연 계보를 주장하지 않는다.','가상 인물 · 역사 인물의 후손이라는 설정도 창작'],
 sabeopmyeong:['사씨 계열 사법명이라는 이름을 빌린 게임 속 조정 인물이다. 551년 활동과 상좌평 직책, 사씨 가문의 계보는 확인된 사실로 제시하지 않는 창작 설정이다.','가상 인물 설정 · 계보 불확실'],
 jinmu:['백제의 군사파 무장으로 구성한 인물이다. 동시대 실존 인물·가계가 확정된 전기로 오인되지 않도록 전공과 성격은 가상 설정으로 둔다.','가상 인물'],
 mokhyemanchi:['목씨 관료를 대표하는 게임 속 인물이다. 한성 함락 당시 충절과 왕실 보위 일화는 문서의 창작 설정이며 역사 기록으로 단정하지 않는다.','가상 인물 · 가문 배경 재구성'],
 gio:['백제계 철기 장인 집단을 대표하는 가상 인물이다. 병장기 생산과 조정 내 입지는 게임의 서사적 설정이다.','가상 인물'],
 'ambitious-baekje':['특정 가문에 귀속되지 않는 백제의 야심가 무장이다. 전황에 따라 부상하는 창작 인물로 실제 사료 인물과 무관하다.','가상 인물'],
 yangwon:['고구려 양원왕으로 545년 즉위해 559년까지 재위한 군주다. 게임의 제가회의 대화와 한강 전역의 선택은 극적 재구성이다.','사료 인물 · 대화는 창작'],
 ondal:['고구려의 온달 설화에 전하는 인물이다. 게임 시점의 청년 무관 활동은 연대상 확정된 사실이 아니라 가상 전개로 표시한다.','전승 인물 · 시기 설정은 가상'],
 goheul:['고구려의 산성 방어를 맡은 장수로 구성한 인물이다. 이름과 세부 행적의 사료적 근거가 제한적이므로 전술·일화는 창작 설정이다.','사료 불확실 · 전술 서사는 창작'],
 'yeon-dae':['고구려 연씨 대가를 대표하는 창작 인물이다. 6세기 귀족 합의 정치의 배경을 반영하되 특정 실존 인물의 전기로 제시하지 않는다.','가상 인물 · 제도 배경은 역사적'],
 'go-mokgeun':['고목근(高木根)은 게임을 위해 만든 계루부 방계 귀족이다. 왕위 계승 경쟁과 고구려 왕실 내부의 갈등은 사료로 확인된 사실이 아닌 창작 서사다.','가상 인물 · 왕실 갈등은 창작'],
 'gosik-young':['고식(高式)은 551년 무렵의 청년 무관으로 설정한 가상 인물이다. 태학에서 밀서를 발견했다는 일화와 고목근과의 관계는 모두 게임 서사이며 을지문덕과 혈연·계승 관계가 없다.','가상 인물 · 을지문덕과 무관'],
 ureuk:['가야금 연주자 우륵으로 전하며 훗날 신라에 귀부한 것으로 알려졌다. 게임의 외교 장면과 대사는 극적 재구성이다.','사료 인물 · 대화는 창작'],
 inoe:['이뇌왕은 522년 신라와 혼인 동맹을 맺은 대가야 왕으로 전한다. 이후 재위와 554년의 왕위 계승은 분명하지 않으므로 게임에서 연속 통치를 역사적 사실로 단정하지 않는다.','사료 인물 · 이후 계승 불확실'],
 'gaya-silla-chief':['신라와 가까운 가야 세력을 대표하는 가상의 수장이다. 대가야 내부 파벌과 밀서 사건은 서사를 위한 창작이다.','가상 인물'],
 'gaya-craft':['백제와 기술 교류를 하는 가야계 장인을 대표하는 가상의 인물이다. 특정 실존 가문이나 개인의 전기로 보지 않는다.','가상 인물']
};
const legacyGeneralIds={'eulji-young':'gosik-young',suseong:'go-mokgeun'};
export const LEGACY_GENERAL_IDS=legacyGeneralIds;
export const GENERALS=roster.map(([id,name,faction,leadership,martial,intellect,politics,traits])=>({id,name,faction,leadership,martial,intellect,politics,traits,available:true,bio:GENERAL_BIOS[id]?.[0]||'전승과 설정을 구분해 다루는 인물 자료가 준비되지 않았습니다.',historicity:GENERAL_BIOS[id]?.[1]||'사료 불확실'}));
