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
 jinheung:['신라의 군주로 한강 유역에 진출하고 순수비를 세워 왕권과 대외 영향력을 넓혔다.','사료 인물 · 게임 속 조정 갈등과 대화는 창작'],
 isabu:['신라의 장군으로 우산국 정벌과 대가야 원정 등으로 알려졌다.','사료 인물 · 한강 전역의 세부 발언과 관계 묘사는 창작'],
 geochilbu:['신라의 장군이자 역사를 편찬한 인물로 전한다.','사료 인물 · 전쟁 기록을 둘러싼 내면의 갈등은 창작'],
 'kim-muryok':['금관가야계 김씨 출신으로 신라의 장수로 활약한 김무력이다.','사료 인물 · 가야계 무장 세력의 구체적 정치 관계와 대화는 재구성'],
 sadaham:['화랑 출신으로 알려진 신라의 젊은 장수다.','사료 인물 · 551년 나이와 관산성 생사 분기는 가상 전개'],
 dogdo:['관산성 전투의 신라 장수로 전해지는 고간(도도)이다.','사료 기록은 불확실 · 두 호칭의 관계와 상세 행적은 게임에서 재구성'],
 gujin:['전선에서 맡은 임무를 묵묵히 수행하는 신라 장수 구진이다.','사료 불확실 · 구체적 전공과 이사부·사다함과의 대화는 창작'],
 'silla-young':['화랑과 진골 귀족 사이에서 입지를 넓히려는 신진 무관이다.','가상 인물 · 특정 사료 인물을 지칭하지 않음'],
 'six-rank':['골품의 한계 속에서도 문장과 실무 능력으로 조정에 쓰임을 얻으려는 6두품 문관이다.','가상 인물 · 골품제 배경을 바탕으로 개인의 행적과 갈등을 창작'],
 seongwang:['백제의 성왕으로 사비 천도와 국정 개혁을 추진했으며, 554년 관산성 전투에서 전사한 것으로 전한다.','사료 인물 · 게임 속 궁중 대화와 선택 분기는 창작이며 실제 경위의 기록 차이를 단정하지 않음'],
 yeochang:['성왕의 아들 여창으로, 훗날 위덕왕이 된다.','사료 인물 · 관산성의 행동·즉위 분기와 부왕과의 궁중 갈등은 창작이며 즉위 후일담은 생존·계승 조건부'],
 haegu:['병권을 중시하고 고토 회복 전쟁에 적극적인 백제의 무장이다.','가상 인물 · 478년 해구 본인이 아니며 후손·동명이인 설정과 혈연 계보는 창작'],
 sabeopmyeong:['해상 교역과 조정의 실리를 중시하는 백제의 사신이다.','가상 인물 · 551년 활동, 상좌평 직책 및 사씨 계보는 확인된 사실이 아님'],
 jinmu:['북방 변경의 옛 영지를 되찾으려는 강경한 백제 무장이다.','가상 인물 · 실존 인물·가계가 확인된 전기가 아님'],
 mokhyemanchi:['충분한 군량과 대의명분을 중시하는 웅진 조정의 신중한 관료다.','가상 인물 · 한성 함락 당시의 충절과 왕실 보위 일화는 창작'],
 gio:['병장기 제작과 군수 조달에 밝은 백제계 철기 장인이다.','가상 인물 · 집단과 조정 내 입지는 서사 설정'],
 'ambitious-baekje':['전황의 틈을 읽고 자신의 세력을 키우려는 백제 무장이다.','가상 인물 · 특정 가문이나 사료 인물에 속하지 않음'],
 yangwon:['고구려 양원왕으로 545년 즉위해 559년까지 재위한 군주다.','사료 인물 · 제가회의 대화와 한강 전역의 선택은 극적 재구성'],
 ondal:['고구려 온달 설화에 전하는 인물이다.','전승 인물 · 게임 시점의 청년 무관 활동은 연대가 확정된 사실이 아닌 가상 전개'],
 goheul:['산성 방어와 수성전에 능한 고구려 장수다.','사료 불확실 · 이름과 세부 행적의 근거가 제한적이며 전술·일화는 창작'],
 'yeon-dae':['강경한 남방 방어와 귀족회의의 주도권을 주장하는 연씨 대가다.','가상 인물 · 6세기 귀족 합의 정치의 배경을 반영하나 특정 실존 인물의 전기가 아님'],
 'go-mokgeun':['왕실의 권위와 귀족회의의 힘 사이에서 자신의 입지를 넓히려는 고구려 귀족이다.','가상 인물 · 계루부 방계 설정과 왕위 계승 경쟁은 사료로 확인되지 않은 창작'],
 'gosik-young':['태학의 학문과 전선의 실무를 함께 익힌 젊은 고구려 무관이다.','가상 인물 · 551년 활동, 태학 밀서 일화와 고목근과의 관계는 창작이며 을지문덕과 혈연·계승 관계가 없음'],
 ureuk:['가야금 연주자 우륵으로 전하며 훗날 신라에 귀부한 것으로 알려졌다.','사료 인물 · 게임의 외교 장면과 대사는 극적 재구성'],
 inoe:['이뇌왕은 522년 신라와 혼인 동맹을 맺은 대가야 왕으로 전한다.','사료 인물 · 이후 재위와 554년 왕위 계승은 불확실하며 연속 통치는 역사적 사실로 단정하지 않음'],
 'gaya-silla-chief':['신라와의 관계를 중시하며 가야 세력의 생존을 모색하는 수장이다.','가상 인물 · 대가야 내부 파벌과 밀서 사건은 창작'],
 'gaya-craft':['백제와의 기술 교류를 통해 가야의 철기 제작을 잇는 장인이다.','가상 인물 · 특정 실존 가문이나 개인의 전기가 아님']
};
const legacyGeneralIds={'eulji-young':'gosik-young',suseong:'go-mokgeun'};
export const LEGACY_GENERAL_IDS=legacyGeneralIds;
export const GENERALS=roster.map(([id,name,faction,leadership,martial,intellect,politics,traits])=>({id,name,faction,leadership,martial,intellect,politics,traits,available:true,bio:GENERAL_BIOS[id]?.[0]||'전승과 설정을 구분해 다루는 인물 자료가 준비되지 않았습니다.',historicity:GENERAL_BIOS[id]?.[1]||'사료 불확실'}));
