const PDB_API = 'https://peeringdb.com/api';

/**
 * Get the PeeringDB network object for an ASN.
 */
export async function getPdbNet(asn: number): Promise<PdbNet | null> {
  let result = null;
  const res = await fetch(`${PDB_API}/net?asn__in=${asn}`);
  const resJson: PdbNetResponse = await res.json();
  if (resJson.data.length === 0) {
    return result;
  }
  return resJson.data[0];
}

/**
 * Get the PeeringDB POC objects for a PeeringDB network ID.
 */
export async function* getPdbPoc(netId: number): AsyncGenerator<PdbPoc, any, any> {
  const res = await fetch(`${PDB_API}/poc?net_id__in=${netId}`);
  const resJson: PdbPocResponse = await res.json();
  for (let d of resJson.data) {
    yield d;
  }
}
