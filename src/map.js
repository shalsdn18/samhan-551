export const HEX_DIRS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
export const tileKey = (q,r) => `${q},${r}`;
export const SUPPLY_HOME_NODE_IDS = Object.freeze({ SILLA:'geumseong', BAEKJE:'sabi', GOGURYEO:'pyongyang', GAYA:'goryeong' });
export const SUPPLY_RULES = Object.freeze({ initialStock: 60, connectedRestore: 30, hubRestoreBonus: 20, disconnectedUse: 25, foodPerStockPerThousand: 2, stockedCombat: 1, emptyCombatByTurns: [0.9, 0.75, 0.55], shortageMoraleLoss: [5, 10, 15], attritionByTurns: [0, 0.03, 0.07] });
export function getNeighbors(state,q,r){return HEX_DIRS.map(([dq,dr])=>state.tiles[tileKey(q+dq,r+dr)]).filter(Boolean)}
export function findTileByNodeId(state,nodeId){return Object.values(state.tiles).find(tile=>tile.node?.id===nodeId)||null}
export function getDistance(q1,r1,q2,r2){return (Math.abs(q1-q2)+Math.abs(q1+r1-q2-r2)+Math.abs(r1-r2))/2}
export function isBlockedByEnemyFortZOC(state,tile,factionId){for(const nb of getNeighbors(state,tile.q,tile.r)){if(nb.owner!==factionId&&nb.node?.type==='FORT')return nb.node.name}return null}
export function updateSupplyLines(state){
  const factions=['SILLA','BAEKJE','GOGURYEO','GAYA'];
  for(const tile of Object.values(state.tiles)){tile.zocWarning=Boolean(isBlockedByEnemyFortZOC(state,tile,state.playerFaction));for(const faction of factions){tile[`suppliedFor${faction}`]=false;tile[`supplyParentFor${faction}`]=null;tile[`supplySourceFor${faction}`]=null}}
  for(const faction of factions){
    const property=`suppliedFor${faction}`,queue=[];
    // Only the faction's designated home anchors supply. Captured capitals, forts, ports,
    // and constructed hubs can relay an existing network but can never create one.
    const homeId=SUPPLY_HOME_NODE_IDS[faction];
    const home=Object.values(state.tiles).find(tile=>tile.owner===faction&&tile.node?.id===homeId);
    if(home){home[property]=true;home[`supplySourceFor${faction}`]=tileKey(home.q,home.r);queue.push(home)}
    for(let i=0;i<queue.length;i++)for(const next of getNeighbors(state,queue[i].q,queue[i].r))if(next.owner===faction&&!next[property]&&!isBlockedByEnemyFortZOC(state,next,faction)){next[property]=true;next[`supplyParentFor${faction}`]=tileKey(queue[i].q,queue[i].r);next[`supplySourceFor${faction}`]=queue[i][`supplySourceFor${faction}`];queue.push(next)}
  }
  const foodForecast=Object.fromEntries(factions.map(faction=>[faction,faction===state.playerFaction?Math.max(0,state.nationalFood||0):Math.max(0,state.aiResources?.[faction]?.food||0)])),foodOrder=Object.fromEntries(factions.map(faction=>[faction,0])),hasHome=Object.fromEntries(factions.map(faction=>[faction,Object.values(state.tiles).some(tile=>tile.owner===faction&&tile.node?.id===SUPPLY_HOME_NODE_IDS[faction]) ]));
  for(const army of state.armies){const key=tileKey(army.q,army.r),tile=state.tiles[key],connected=Boolean(tile?.[`suppliedFor${army.owner}`]);army.supplyFoodPriority=(foodOrder[army.owner]||0)+1;foodOrder[army.owner]=army.supplyFoodPriority;army.supplyExpectedFoodBefore=foodForecast[army.owner]||0;army.supplyHomeLost=!hasHome[army.owner];if(connected)army.zocSupplyCut=false;army.supplyStock=Number.isFinite(army.supplyStock)?Math.max(0,Math.min(100,army.supplyStock)):SUPPLY_RULES.initialStock;army.supplyConnected=connected;army.supplied=connected;army.supplyEfficiency=(tile&&!tile.isCore&&tile.resistance>=50)?0.75:1;army.supplyPath=[];army.supplySourceKey=connected?tile[`supplySourceFor${army.owner}`]||key:null;army.supplyBlockReason=connected?'':supplyBlockReason(state,tile,army.owner,!hasHome[army.owner]);if(connected){let cursor=key,guard=0;while(cursor&&guard++<Object.keys(state.tiles).length){army.supplyPath.unshift(cursor);if(cursor===army.supplySourceKey)break;cursor=state.tiles[cursor]?.[`supplyParentFor${army.owner}`]||null}army.connectedHub=Boolean(tile?.isSupplyHub||tile?.buildings?.supply||tile?.node?.isSupplyHub)}else army.connectedHub=false;const requested=Math.min(SUPPLY_RULES.connectedRestore+(army.connectedHub?SUPPLY_RULES.hubRestoreBonus:0),100-army.supplyStock),foodPerPoint=Math.max(0,army.troops||0)/1000*SUPPLY_RULES.foodPerStockPerThousand,forecastGain=connected&&foodPerPoint>0?Math.min(requested,foodForecast[army.owner]/foodPerPoint):0;army.supplyExpectedChange=connected?forecastGain:-Math.min(SUPPLY_RULES.disconnectedUse,army.supplyStock);army.supplyExpectedFoodCost=connected?forecastGain*foodPerPoint:0;if(connected)foodForecast[army.owner]=Math.max(0,foodForecast[army.owner]-army.supplyExpectedFoodCost)}
}

function supplyBlockReason(state,tile,faction,homeLost=false){if(!tile)return '\uD604\uC7AC \uC88C\uD45C\uC5D0 \uC601\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.';if(tile.owner!==faction)return '\uAD70\uB2E8\uC774 \uC544\uAD70 \uC18C\uC720\uAC00 \uC544\uB2CC \uD0C0\uC77C\uC5D0 \uC788\uC2B5\uB2C8\uB2E4.';const fort=isBlockedByEnemyFortZOC(state,tile,faction);if(fort)return `\uC801 \uC0B0\uC131 \uD1B5\uC81C\uAD6C\uC5ED(${fort})\uC774 \uBCF4\uAE09\uB85C\uB97C \uB04A\uC5C8\uC2B5\uB2C8\uB2E4.`;if(homeLost)return '\uC138\uB825\uC758 \uC9C0\uC815 \uBCF8\uAC70\uC810\uC744 \uC0C1\uC2E4\uD574 \uBCF4\uAE09\uC6D0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uBCF8\uAC70\uC810\uC744 \uD68C\uBCF5\uD558\uC2ED\uC2DC\uC624.';if(!tile.isCore)return '\uC544\uC9C1 \uD575\uC2EC \uC601\uD1A0\uB85C \uD3B8\uC785\uB418\uC9C0 \uC54A\uC740 \uC810\uB839\uC9C0\uC785\uB2C8\uB2E4.';return '\uBCF8\uAC70\uC810\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uC544\uAD70 \uC601\uD1A0 \uACBD\uB85C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uAC70\uC810\uC744 \uD655\uBCF4\uD574 \uC5F0\uC18D\uB41C \uC18C\uC720 \uACBD\uB85C\uB97C \uC5F0\uACB0\uD558\uC2ED\uC2DC\uC624.'}

export function armySupplyCombatFactor(army){if(army.supplyStock>0)return SUPPLY_RULES.stockedCombat;const turns=Math.max(1,army.supplyShortageTurns||1);return SUPPLY_RULES.emptyCombatByTurns[Math.min(turns-1,SUPPLY_RULES.emptyCombatByTurns.length-1)]}

export function advanceArmySupply(state,army){
  army.supplyStock=Number.isFinite(army.supplyStock)?Math.max(0,Math.min(100,army.supplyStock)):SUPPLY_RULES.initialStock;
  army.supplyShortageTurns=army.supplyShortageTurns||0;
  const beganEmpty=army.supplyStock<=0;
  const faction=army.owner,player=faction===state.playerFaction;
  const resources=player?state:{...(state.aiResources?.[faction]||{})};
  if(army.supplyConnected){
    const requested=Math.min(SUPPLY_RULES.connectedRestore+(army.connectedHub?SUPPLY_RULES.hubRestoreBonus:0),100-army.supplyStock),foodPerPoint=Math.max(0,army.troops||0)/1000*SUPPLY_RULES.foodPerStockPerThousand,availableFood=Math.max(0,resources.nationalFood??resources.food??0),gain=foodPerPoint>0?Math.min(requested,availableFood/foodPerPoint):0,foodCost=gain*foodPerPoint;
    if(gain){if(player)state.nationalFood=Math.max(0,state.nationalFood-foodCost);else{state.aiResources??={};state.aiResources[faction]??={gold:0,food:0,iron:0,horses:0};state.aiResources[faction].food=Math.max(0,(state.aiResources[faction].food||0)-foodCost)}army.supplyStock+=gain}
    if(army.supplyStock>0){army.supplyShortageTurns=0;army.zocSupplyCut=false;army.morale=Math.min(100,army.morale+5)}
  }else army.supplyStock=Math.max(0,army.supplyStock-SUPPLY_RULES.disconnectedUse);
  if(army.supplyStock<=0&&beganEmpty){army.supplyShortageTurns++;const stage=Math.min(army.supplyShortageTurns-1,SUPPLY_RULES.shortageMoraleLoss.length-1);army.morale=Math.max(0,army.morale-SUPPLY_RULES.shortageMoraleLoss[stage]);const attrition=SUPPLY_RULES.attritionByTurns[Math.min(army.supplyShortageTurns-1,SUPPLY_RULES.attritionByTurns.length-1)];if(attrition>0)army.troops=Math.max(0,army.troops-Math.max(1,Math.floor(army.troops*attrition)));army.supplyAttritionRate=attrition}else army.supplyAttritionRate=0;
  army.supplyStock=Math.max(0,Math.min(100,army.supplyStock));
  return { stock:army.supplyStock, connected:army.supplyConnected, shortageTurns:army.supplyShortageTurns };
}

export function supplyPathNames(state,army){return (army.supplyPath||[]).map(key=>state.tiles[key]?.node?.name||`(${key})`)}
