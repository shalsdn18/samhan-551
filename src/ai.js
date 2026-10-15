import {getNeighbors,getDistance,tileKey,updateSupplyLines,isBlockedByEnemyFortZOC,findTileByNodeId} from './map.js';
import {getRelation} from './data.js';
import {UNIT_TYPES} from './v05_data.js';

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
  for(const army of armyList){if(army.troops>=2500||treasury.gold<40||treasury.food<80)continue;const tile=state.tiles[tileKey(army.q,army.r)];if(!tile?.node)continue;const gain=Math.min(600,2500-army.troops);army.troops+=gain;army.maxTroops=Math.max(army.maxTroops,army.troops);treasury.gold-=40;treasury.food-=80;hooks.log(`🔥 [${formatFaction(faction)} 증원] ${army.name}에 병력 ${gain}명 보충.`)}
  if(armyList.length>=4||treasury.gold<180||treasury.food<280)return;
  const strongholds=Object.values(state.tiles).filter(t=>t.owner===faction&&t.node&&['CAPITAL','FORT','TOWN'].includes(t.node.type));
  strongholds.sort((a,b)=>{
    const aCount=armyList.filter(unit=>unit.q===a.q&&unit.r===a.r).length,bCount=armyList.filter(unit=>unit.q===b.q&&unit.r===b.r).length;
    return aCount-bCount+(a.node.type==='CAPITAL'?-0.2:0)-(b.node.type==='CAPITAL'?-0.2:0);
  });
  const tile=strongholds[0];if(!tile)return;
  treasury.gold-=180;treasury.food-=280;
  state.aiArmySeq=(state.aiArmySeq||0)+1;
  const army={id:`ai_${faction.toLowerCase()}_${state.aiArmySeq}`,name:`${tile.node.name} 증원군`,owner:faction,clanId:null,q:tile.q,r:tile.r,troops:1600,maxTroops:1800,morale:90,supplied:true,ap:2};
  state.armies.push(army);
  hooks.log(`🛡️ [${formatFaction(faction)} 징병] ${tile.node.name}에서 ${army.name} 1,600명을 소집했습니다. (군단 ${armyList.length+1}/4)`);
}

function stanceFor(state,faction){
  if(faction==='GOGURYEO'){
    const han=goalTile(state,GOALS.HANSEONG),north=goalTile(state,'bukhansan');const threat=state.armies.some(a=>a.owner!==faction&&[han,north].filter(Boolean).some(p=>getDistance(a.q,a.r,p.q,p.r)<=1));
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
  const threats=state.armies.filter(a=>a.owner!==faction);
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
  state.armies=state.armies.filter(a=>a.troops>50);
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
  const defBonus=tile.node?.def||(tile.terrain==='산악'?1.4:1);
  const commanderFactor=army=>{const general=state.generals?.find(item=>item.id===army.commanderId);return general?1+(general.leadership+general.martial)/400:1};
  const unitFactor=army=>{const type=UNIT_TYPES[army.unitType]||UNIT_TYPES.INFANTRY;return type.plains&&tile.terrain==='평야'?type.plains:type.fortDefense&&tile.node?.type==='FORT'?type.fortDefense:type.ambush||1};
  const atkFactionBonus=(attacker.owner==='GOGURYEO'?(state.attackBonus||1):1)*(state.commanderBonusByFaction?.[attacker.owner]||1)*commanderFactor(attacker)*unitFactor(attacker);
  const defFactionBonus=(defender.owner==='GOGURYEO'?(state.defenseBonus||1):1)*(state.commanderBonusByFaction?.[defender.owner]||1)*commanderFactor(defender)*unitFactor(defender);
  const atkPower=attacker.troops*(attacker.morale/100)*(attacker.supplied?1:.55)*atkTactic*atkFactionBonus;
  const defPower=defender.troops*(defender.morale/100)*defBonus*defTactic*defFactionBonus;
  const atkLoss=Math.min(attacker.troops,Math.max(100,Math.floor(defPower*(automatic?.23:.28))));
  const defLoss=Math.min(defender.troops,Math.max(100,Math.floor(atkPower*(automatic?.27:.35))));
  attacker.troops-=atkLoss;defender.troops-=defLoss;attacker.ap=Math.max(0,attacker.ap-1);
  let captured=false;
  const previousOwner=tile.owner;
  state.armies=state.armies.filter(a=>a.troops>50);
  if(defender.troops<=50&&!state.armies.some(a=>a.q===tile.q&&a.r===tile.r&&a.owner!==attacker.owner)&&attacker.troops>50){attacker.q=tile.q;attacker.r=tile.r;tile.owner=attacker.owner;captured=true;state.lastCapture={previousOwner,newOwner:attacker.owner,tile,army:attacker}}
  updateSupplyLines(state);
  return {atkLoss,defLoss,atkTactic,defTactic,advantage,captured,previousOwner:captured?previousOwner:undefined};
}
