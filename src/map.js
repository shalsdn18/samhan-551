export const HEX_DIRS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
export const tileKey = (q,r) => `${q},${r}`;
export function getNeighbors(state,q,r){return HEX_DIRS.map(([dq,dr])=>state.tiles[tileKey(q+dq,r+dr)]).filter(Boolean)}
export function findTileByNodeId(state,nodeId){return Object.values(state.tiles).find(tile=>tile.node?.id===nodeId)||null}
export function getDistance(q1,r1,q2,r2){return (Math.abs(q1-q2)+Math.abs(q1+r1-q2-r2)+Math.abs(r1-r2))/2}
export function isBlockedByEnemyFortZOC(state,tile,factionId){for(const nb of getNeighbors(state,tile.q,tile.r)){if(nb.owner!==factionId&&nb.node?.type==='FORT')return nb.node.name}return null}
export function updateSupplyLines(state){
  const factions=['SILLA','BAEKJE','GOGURYEO','GAYA'];
  for(const tile of Object.values(state.tiles)){tile.zocWarning=Boolean(isBlockedByEnemyFortZOC(state,tile,state.playerFaction));for(const faction of factions)tile[`suppliedFor${faction}`]=false}
  for(const faction of factions){
    const property=`suppliedFor${faction}`,queue=[];
    const hubs=Object.values(state.tiles).filter(tile=>tile.owner===faction&&(tile.isSupplyHub===true||tile.node?.isSupplyHub===true||['CAPITAL','FORT','PORT'].includes(tile.node?.type)));
    for(const hub of hubs){hub[property]=true;queue.push(hub)}
    for(let i=0;i<queue.length;i++)for(const next of getNeighbors(state,queue[i].q,queue[i].r))if(next.owner===faction&&!next[property]&&!isBlockedByEnemyFortZOC(state,next,faction)){next[property]=true;queue.push(next)}
  }
  for(const army of state.armies){const tile=state.tiles[tileKey(army.q,army.r)];army.supplyEfficiency=(tile&&!tile.isCore&&tile.resistance>=50)?0.75:1;army.supplied=!army.zocSupplyCut&&Boolean(tile?.[`suppliedFor${army.owner}`])}
}
