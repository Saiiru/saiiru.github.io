// A response may update the UI only while its input revision is still current.
export function createRequestGate(){
  let revision=0;
  return {begin:()=>++revision,invalidate:()=>{revision++;},current:token=>token===revision};
}
