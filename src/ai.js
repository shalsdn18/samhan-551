import {getNeighbors,getDistance,tileKey,updateSupplyLines,isBlockedByEnemyFortZOC,findTileByNodeId} from './map.js';
import {getRelation} from './data.js';
import {UNIT_TYPES} from './v05_data.js';
import {GENERALS} from './v05_data.js';

const NPC_FACTIONS=['SILLA','GOGURYEO','BAEKJE'];
const GOALS={HANSEONG:'hanseong',GWANSAN:'gwansan',SILLA_SUPPLY:'geumseong'};
const goalTile=(state,id)=>findTileByNodeId(state,id);
const formatFaction=id=>id==='GOGURYEO'?'고구려 AI':id==='BAEKJE'?'백제 AI':'신라 AI';

function resources(state,faction){
  state.aiResources??={};
  state.aiResources[faction]??={gold:420,food:900};
  return state.aiResources[faction];
}

function collectTaxes(state,faction,hooks){
  const treasury=resources(state,faction);let gold=55,food=120;
  for(const tile of Object.values(state.tiles))if(tile.owner===faction&&tile.node){
    if(tile.node.type==='CAPITAL'){gold+=70;food+=90}
    if(tile.node.type==='TOWN'){gold+=35;food+=60}
    if(tile.node.type==='PORT')gold+=65;
  }
  gold=Math.round(gold*1.8);food=Math.round(food*1.8);treasury.gold+=gold;treasury.food+=food;
  hooks.log(`💰 [${formatFaction(faction)} 재정] 금 +${gold}, 군량 +${food}.`);
}

function recruitAtStronghold(state,faction,hooks){
  const armyList=state.armies.filter(a=>a.owner===faction),treasury=resources(state,faction);
  for(const army of armyList){if(army.troops>=2500||treasury.gold<40||treasury.food<80)continue;const tile=state.tiles[tileKey(army.q,army.r)];if(!tile?.node||!tile.isCore)continue;const gain=Math.min(army.mustering?450:600,2500-army.troops);army.troops+=gain;army.composition??={INFANTRY:0,ARCHER:0,HEAVY_INFANTRY:0,CAVALRY:0};army.composition[army.unitType||'INFANTRY']=(army.composition[army.unitType||'INFANTRY']||0)+gain;army.maxTroops=Math.max(army.maxTroops,army.troops);army.training=Math.min(100,(army.training||30)+2);army.mustering=army.troops<army.maxTroops;treasury.gold-=40;treasury.food-=80;hooks.log(`🔥 [${formatFaction(faction)} 증원] ${army.name}에 병력 ${gain}명 보충.`)}
  if(armyList.length>=8||treasury.gold<180||treasury.food<280)return;
  const strongholds=Object.values(state.tiles).filter(t=>t.owner===faction&&t.node&&t.assimilationTurns<=0&&['CAPITAL','FORT','TOWN'].includes(t.node.type));
  strongholds.sort((a,b)=>{
    const aCount=armyList.filter(unit=>unit.q===a.q&&unit.r===a.r).length,bCount=armyList.filter(unit=>unit.q===b.q&&unit.r===b.r).length;
    return aCount-bCount+(a.node.type==='CAPITAL'?-0.2:0)-(b.node.type==='CAPITAL'?-0.2:0);
  });
  const tile=strongholds[0];if(!tile)return;
  const cultural=faction==='GOGURYEO'?['GOG_KAE','GOG_HORSE_ARCHER','GOG_AXE']:faction==='BAEKJE'?['BAEKJE_CAVALRY','BAEKJE_SWORD','BAEKJE_GUARD']:['SILLA_HWARANG','SILLA_CROSSBOW','SILLA_SPEAR'];
  const preferred=[...cultural,'HEAVY_INFANTRY','CAVALRY','INFANTRY'].find(type=>{const unit=UNIT_TYPES[type];return unit&&treasury.gold>=Math.max(180,unit.gold)&&treasury.food>=Math.max(280,unit.food)});if(!preferred)return;
  treasury.gold-=Math.max(180,UNIT_TYPES[preferred].gold);treasury.food-=Math.max(280,UNIT_TYPES[preferred].food);
  state.aiArmySeq=(state.aiArmySeq||0)+1;
  const unit=UNIT_TYPES[preferred],troops=preferred==='CAVALRY'?1900:preferred==='HEAVY_INFANTRY'?2000:1800;
  const commander=GENERALS.find(g=>g.faction===faction&&!state.armies.some(a=>a.commanderId===g.id||a.subCommanderId===g.id));
  const composition={};composition[preferred]=Math.floor(troops*.45);const army={id:`ai_${faction.toLowerCase()}_${state.aiArmySeq}`,name:`${tile.node.name} ${unit.label} 증원군`,owner:faction,clanId:null,commanderId:commander?.id||null,subCommanderId:null,unitType:preferred,composition,q:tile.q,r:tile.r,troops:Math.floor(troops*.45),maxTroops:troops+200,morale:85,supplied:true,ap:0,mustering:true,training:20};
  state.armies.push(army);
  hooks.log(`🛡️ [${formatFaction(faction)} 징병] ${tile.node.name}에서 ${unit.label} ${army.troops.toLocaleString()}명을 우선 소집했습니다. 완편 목표 ${troops.toLocaleString()}명 (군단 ${armyList.length+1}/8)`);
}

function stanceFor(state,faction){
  if(faction==='GOGURYEO'){
    const han=goalTile(state,GOALS.HANSEONG),north=goalTile(state,'bukhansan');const threat=state.armies.some(a=>a.owner!==faction&&getRelation(state,faction,a.owner).status==='WAR'&&[han,north].filter(Boolean).some(p=>getDistance(a.q,a.r,p.q,p.r)<=1));
    return threat?'COUNTERATTACK':'HAN_RIVER_DEFENSE';
  }
  if(faction==='BAEKJE'&&(state.allianceBroken||state.flags?.sillaRaidScope==='FULL'))return'ALL_OUT_VENGEANCE';
  if(faction==='BAEKJE')return'ALLIANCE_NORTHERN_PUSH';
  return'BORDER_GUARD';
}

function permittedTarget(state,faction,tile){
  return tile.owner!==faction&&getRelation(state,faction,tile.owner).status==='WAR';
}

function utility(state,faction,army,tile,stance){
  let score=8;
  const enemyUnits=state.armies.filter(a=>a.q===tile.q&&a.r===tile.r&&a.owner!==faction);
  const unsupplied=enemyUnits.filter(a=>a.supplied===false);
  if(unsupplied.length){score+=100+unsupplied.reduce((sum,a)=>sum+Math.min(20,a.troops/500),0)}
  if(enemyUnits.length)score+=army.troops>=enemyUnits.reduce((sum,a)=>sum+a.troops,0)?34:5;
  if(tile.owner===state.playerFaction)score+=38;
  if(tile.node?.type==='CAPITAL')score+=35;
  if(tile.node?.type==='FORT')score+=18;
  if(tile.node?.isSupplyHub)score+=24;

  if(faction==='GOGURYEO'){
    const han=goalTile(state,GOALS.HANSEONG),north=goalTile(state,'bukhansan');const objective=stance==='COUNTERATTACK'?nearestEnemyGoal(state,faction,[han,north].filter(Boolean)):han;if(!objective)return score;
    const before=getDistance(army.q,army.r,objective.q,objective.r),after=getDistance(tile.q,tile.r,objective.q,objective.r);
    score+=(before-after)*34;
    if(tile.node?.id==='hanseong')score+=60;
    if(tile.node?.id==='bukhansan')score+=24;
    if(tile.owner===state.playerFaction&&(['hanseong','danyang','chupung'].includes(tile.node?.id))){const defense=state.armies.filter(unit=>unit.owner===state.playerFaction&&unit.q===tile.q&&unit.r===tile.r).reduce((sum,unit)=>sum+unit.troops,0);if(defense<army.troops+1000)score+=200}
    if(stance==='COUNTERATTACK'&&enemyUnits.some(a=>a.supplied===false))score+=100;
  }else if(faction==='BAEKJE'){
    if(stance==='ALL_OUT_VENGEANCE'){
      for(const goalId of [GOALS.GWANSAN,GOALS.SILLA_SUPPLY]){const goal=goalTile(state,goalId);if(!goal)continue;
        const before=getDistance(army.q,army.r,goal.q,goal.r),after=getDistance(tile.q,tile.r,goal.q,goal.r);
        score+=(before-after)*52;
        if(tile.q===goal.q&&tile.r===goal.r)score+=150;
      }
      if(tile.owner==='SILLA')score+=28;
    }else{
      const goal=goalTile(state,GOALS.HANSEONG);if(!goal)return score;const before=getDistance(army.q,army.r,goal.q,goal.r),after=getDistance(tile.q,tile.r,goal.q,goal.r);
      score+=(before-after)*50;
      if(tile.node?.id==='gwansan')score+=150;
      if(tile.owner==='SILLA')score-=10000;
    }
  }
  if(isBlockedByEnemyFortZOC(state,tile,faction))score-=1000;
  return score;
}

function nearestEnemyGoal(state,faction,goals){
  const threats=state.armies.filter(a=>a.owner!==faction&&getRelation(state,faction,a.owner).status==='WAR');
  if(!threats.length)return goals[0];
  return goals.slice().sort((a,b)=>Math.min(...threats.map(x=>getDistance(x.q,x.r,a.q,a.r)))-Math.min(...threats.map(x=>getDistance(x.q,x.r,b.q,b.r))))[0];
}

function attackReason(state,faction,stance,defender){
  if(faction==='GOGURYEO'&&defender.supplied===false)return`🔥 [고구려 AI - 역습 태세] ${defender.name}의 보급이 끊긴 틈을 노려 기습합니다!`;
  if(faction==='GOGURYEO')return`⚔️ [고구려 AI - ${stance==='COUNTERATTACK'?'역습 태세':'한강 방어'}] ${defender.name}을(를) 향해 선제 타격합니다.`;
  if(faction==='BAEKJE'&&stance==='ALL_OUT_VENGEANCE')return`🔥 [백제 AI - 복수 총공세] ${defender.name}을(를) 관산성·신라 보급 기지 방향에서 압박합니다!`;
  if(faction==='BAEKJE')return`⚔️ [백제 AI - 북진 협공] 한성을 향해 고구려군을 공격합니다.`;
  return`⚔️ [${formatFaction(faction)}] 인접 적군을 공격합니다.`;
}

function moveFactionArmy(state,faction,army,hooks,stance){
  if(!army||army.troops<=50){state.armies=state.armies.filter(a=>a!==army);return}
  while(army.ap>0){
    if(army.troops<=50){state.armies=state.armies.filter(a=>a!==army);break}
    const adjacent=getNeighbors(state,army.q,army.r).filter(tile=>permittedTarget(state,faction,tile));
    const targets=adjacent.map(tile=>({tile,units:state.armies.filter(a=>a.q===tile.q&&a.r===tile.r&&a.owner!==faction&&getRelation(state,faction,a.owner).status==='WAR')})).filter(entry=>entry.units.length);
    targets.sort((a,b)=>{
      const aWeak=a.units.some(unit=>unit.supplied===false),bWeak=b.units.some(unit=>unit.supplied===false);
      const aUtility=utility(state,faction,army,a.tile,stance)+(aWeak?100:0),bUtility=utility(state,faction,army,b.tile,stance)+(bWeak?100:0);
      return bUtility-aUtility;
    });
    if(targets.length){
      const target=targets[0],defender=target.units.slice().sort((a,b)=>(a.supplied?1:0)-(b.supplied?1:0)||a.troops-b.troops)[0];
      hooks.log(attackReason(state,faction,stance,defender));hooks.queueBattle(army,defender,target.tile,true);army.ap=0;break;
    }
    const candidates=adjacent.filter(tile=>!state.armies.some(a=>a.q===tile.q&&a.r===tile.r&&a.owner!==faction&&getRelation(state,faction,a.owner).status==='WAR'));
    candidates.sort((a,b)=>utility(state,faction,army,b,stance)-utility(state,faction,army,a,stance));
    const target=candidates[0];if(!target||utility(state,faction,army,target,stance)<0)break;
    const previousOwner=target.owner;target.owner=faction;army.q=target.q;army.r=target.r;army.ap--;
    hooks.log(`🧭 [${formatFaction(faction)} - ${stance}] ${army.name}이(가) (${target.q},${target.r}) ${target.node?.name||'거점'}으로 진군합니다.`);
    hooks.onTileCaptured?.(previousOwner,faction,target,army);
    updateSupplyLines(state);
  }
}

export function runEnemyTurns(state,hooks){
  state.armies=state.armies.filter(a=>a.troops>50);for(const army of state.armies){army.subCommanderId??=null;army.composition??={INFANTRY:0,ARCHER:0,HEAVY_INFANTRY:0,CAVALRY:0};if(!Object.values(army.composition).some(Boolean))army.composition[army.unitType||'INFANTRY']=army.troops}
  state.aiStances??={};
  for(const faction of NPC_FACTIONS){
    if(faction===state.playerFaction)continue;
    const relation=getRelation(state,faction,state.playerFaction),ownCount=state.armies.filter(a=>a.owner===faction&&a.troops>50).length;
    const vulnerableFront=state.armies.some(a=>a.owner===state.playerFaction&&a.troops<1200&&state.armies.some(b=>b.owner===faction&&getDistance(a.q,a.r,b.q,b.r)<=1));
    if(relation.status==='NEUTRAL'&&(ownCount>=3||vulnerableFront)){
      state.relations[[faction,state.playerFaction].sort().join('|')]={status:'WAR',expiresAt:null,note:'AI 전략 선전포고'};
      hooks.log(`⚔️ [${formatFaction(faction)} 선전포고] 국경 병력이 갖춰져 ${state.playerFaction}과의 중립을 끝내고 교전에 돌입합니다.`);
    }
    collectTaxes(state,faction,hooks);
    recruitAtStronghold(state,faction,hooks);
    const stance=stanceFor(state,faction);state.aiStances[faction]=stance;
    hooks.log(`🧠 [${formatFaction(faction)} 태세] ${stance==='HAN_RIVER_DEFENSE'?'한강 방어':stance==='COUNTERATTACK'?'역습':stance==='ALLIANCE_NORTHERN_PUSH'?'동맹 북진 협공':stance==='ALL_OUT_VENGEANCE'?'복수 총공세':'국경 방어'}`);
    const armies=state.armies.filter(a=>a.owner===faction&&a.troops>50).sort((a,b)=>b.troops-a.troops);
    for(const army of armies)if(state.armies.includes(army))moveFactionArmy(state,faction,army,hooks,stance);
  }
  updateSupplyLines(state);
}

function applyCompositionLoss(army,loss,before){army.composition??={[army.unitType||'INFANTRY']:before};let remaining=loss;const keys=Object.keys(army.composition);for(let index=0;index<keys.length;index++){const type=keys[index],count=army.composition[type]||0,take=index===keys.length-1?Math.min(count,remaining):Math.min(count,Math.floor(loss*count/Math.max(1,before)));army.composition[type]=Math.max(0,count-take);remaining-=take}if(remaining>0)for(const type of keys){const take=Math.min(army.composition[type]||0,remaining);army.composition[type]-=take;remaining-=take;if(!remaining)break}}

export function resolveBattle(state,attacker,defender,tile,attackerCard,defenderCard,automatic=false){
  if(!attacker||!defender||attacker.troops<=0||defender.troops<=0){
    const previousOwner=tile?.owner;
    state.armies=state.armies.filter(a=>a.troops>50);
    let captured=false;
    if(attacker&&defender&&tile&&attacker.troops>0&&defender.troops<=0&&!state.armies.some(a=>a.q===tile.q&&a.r===tile.r&&a.owner!==attacker.owner)){attacker.q=tile.q;attacker.r=tile.r;tile.owner=attacker.owner;captured=true}
    return {atkLoss:0,defLoss:0,advantage:'even',captured,previousOwner};
  }
  const scale=()=>1;
  let atkTactic=scale(attackerCard),defTactic=scale(defenderCard),advantage='even';
  const beats={charge:'ambush',ambush:'formation',formation:'charge'};
  if(beats[attackerCard]===defenderCard){atkTactic=1.3;defTactic=.8;advantage='attacker'}else if(beats[defenderCard]===attackerCard){defTactic=1.3;atkTactic=.8;advantage='defender'}
  const rawDefense=tile.node?.def||(tile.terrain==='산악'?1.4:1);
  const stats=army=>{const composition=army.composition||{[army.unitType||'INFANTRY']:army.troops},total=Math.max(1,Object.values(composition).reduce((sum,count)=>sum+count,0)),result={damage:0,toughness:0,pursuit:0,screen:0,siege:0};for(const[type,count]of Object.entries(composition)){const unit=UNIT_TYPES[type]||UNIT_TYPES.INFANTRY;for(const key of Object.keys(result))result[key]+=(unit[key]||0)*count/total}return result};
  const dominant=army=>Object.entries(army.composition||{[army.unitType||'INFANTRY']:army.troops}).sort((a,b)=>b[1]-a[1])[0]?.[0]||army.unitType||'INFANTRY';
  const trainingFactor=army=>(army.training||20)<30?.85:(army.training||20)<60?1:(army.training||20)<85?1.15:1.3;
  const category=type=>type==='INFANTRY'||type.includes('SPEAR')?'SPEAR':type==='CAVALRY'||type.includes('KAE')||type.includes('CAVALRY')?'CAVALRY':type==='ARCHER'||type.includes('ARCHER')||type.includes('CROSSBOW')?'ARCHER':'HEAVY';
  const counterFactor=(army,enemy)=>{const enemyClass=category(dominant(enemy)),own=army.composition||{[army.unitType||'INFANTRY']:army.troops},counters={SPEAR:'CAVALRY',CAVALRY:'ARCHER',ARCHER:'HEAVY',HEAVY:'SPEAR'};return Object.keys(own).some(type=>counters[category(type)]===enemyClass)?1.3:1};
  const defBonus=Math.max(.55,rawDefense*(1-stats(attacker).siege));
  const commanderFactor=(army,attacking)=>{const general=state.generals?.find(item=>item.id===army.commanderId),vanguard=state.generals?.find(item=>item.id===army.subCommanderId);let bonus=general?1+(general.leadership+general.martial)/400:1;if(attacking&&general?.traits.includes('사기 진작'))bonus*=1.15;if(!attacking&&tile.node?.type==='FORT'&&general?.traits.includes('산성 수비관'))bonus*=1.25;if(attacking&&attackerCard==='charge'&&vanguard)bonus*=1+Math.min(.25,Math.max(.1,vanguard.martial/400));if(UNIT_TYPES[army.unitType]?.plains&&tile.terrain==='평야'&&general?.traits.includes('개마무사 지휘관'))bonus*=1.2;return bonus};
  const unitFactor=army=>{const composition=army.composition||{[army.unitType||'INFANTRY']:army.troops},total=Math.max(1,Object.values(composition).reduce((sum,count)=>sum+count,0));let factor=0;for(const[type,count]of Object.entries(composition)){const unit=UNIT_TYPES[type]||UNIT_TYPES.INFANTRY;let bonus=1;if(type==='CAVALRY'&&tile.terrain==='평야')bonus=unit.plains||1.35;if(type==='HEAVY_INFANTRY'&&tile.node?.type==='FORT')bonus=unit.fortDefense||1.3;if(type==='ARCHER'&&tile.node?.type==='FORT')bonus=1.15;factor+=bonus*count/total}return factor};
  const atkFactionBonus=(attacker.owner==='GOGURYEO'?(state.attackBonus||1):1)*(state.commanderBonusByFaction?.[attacker.owner]||1)*(attacker.combatPenalty||1)*commanderFactor(attacker,true)*unitFactor(attacker);
  const defFactionBonus=(defender.owner==='GOGURYEO'?(state.defenseBonus||1):1)*(state.commanderBonusByFaction?.[defender.owner]||1)*(defender.combatPenalty||1)*commanderFactor(defender,false)*unitFactor(defender);
  const atkStats=stats(attacker),defStats=stats(defender),atkPower=attacker.troops*(attacker.morale/100)*(attacker.supplied?(attacker.supplyEfficiency||1):.55)*atkTactic*atkFactionBonus*(1+atkStats.damage/300)*(1+atkStats.toughness/700)*trainingFactor(attacker)*counterFactor(attacker,defender);
  const defPower=defender.troops*(defender.morale/100)*(defender.supplied?(defender.supplyEfficiency||1):.55)*defBonus*defTactic*defFactionBonus*(1+defStats.damage/300)*(1+defStats.toughness/700)*trainingFactor(defender)*counterFactor(defender,attacker);
  const atkBefore=attacker.troops,defBefore=defender.troops,atkPursuit=atkPower>defPower?Math.max(0,atkStats.pursuit-defStats.screen):0,defPursuit=defPower>atkPower?Math.max(0,defStats.pursuit-atkStats.screen):0;let atkLoss=Math.min(attacker.troops,Math.max(100,Math.floor(defPower*(automatic?.23:.28)*(1+defPursuit/300))));
  let defLoss=Math.min(defender.troops,Math.max(100,Math.floor(atkPower*(automatic?.27:.35)*(1+atkPursuit/300))));
  attacker.troops-=atkLoss;defender.troops-=defLoss;applyCompositionLoss(attacker,atkLoss,atkBefore);applyCompositionLoss(defender,defLoss,defBefore);const atkMoraleResistance=(attacker.training||20)>=60?.7:1,defMoraleResistance=(defender.training||20)>=60?.7:1;attacker.morale=Math.max(10,attacker.morale-Math.ceil(15*atkLoss/Math.max(1,atkBefore)*atkMoraleResistance));defender.morale=Math.max(10,defender.morale-Math.ceil(15*defLoss/Math.max(1,defBefore)*defMoraleResistance));attacker.ap=Math.max(0,attacker.ap-1);attacker.training=Math.min(100,(attacker.training||20)+15);defender.training=Math.min(100,(defender.training||20)+15);
  let captured=false;
  const previousOwner=tile.owner;
  state.armies=state.armies.filter(a=>a.troops>50);
  if(defender.troops<=50&&!state.armies.some(a=>a.q===tile.q&&a.r===tile.r&&a.owner!==attacker.owner)&&attacker.troops>50){attacker.q=tile.q;attacker.r=tile.r;tile.owner=attacker.owner;captured=true;state.lastCapture={previousOwner,newOwner:attacker.owner,tile,army:attacker}}
  updateSupplyLines(state);
  return {atkLoss,defLoss,atkTactic,defTactic,advantage,captured,previousOwner:captured?previousOwner:undefined,atkStats,defStats,atkTraining:attacker.training,defTraining:defender.training};
}
