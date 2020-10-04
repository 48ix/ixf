import { getPdbNet, getPdbPoc } from './peeringdb';
import { getParticipants } from './contentful';
import { ixps } from './static';

// Map PeeringDB peering policy types (left) to IXF peering policy types (right)
const PEERING_POLICY_MAP: PolicyMap = {
  Open: 'open',
  Selective: 'selective',
  Restrictive: 'case-by-case',
  No: 'closed',
};

/**
 * Build an IXF Member structure.
 *
 * Based on generic participant info from the 48 IX "source of truth", query the PeeringDB API for
 * additional information for each participant. and add it to the IXF data.
 */
export async function buildMember(participant: ParticipantEntry): Promise<IfMember> {
  // Base member structure.
  let member: IfMember = {
    asnum: participant.asn,
    member_type: 'peering',
    name: participant.name,
    url: '',
    contact_email: [],
    contact_phone: [],
    peering_policy: 'custom',
    peering_policy_url: '',
    member_since: new Date(participant.memberSince).toISOString(),
    connection_list: [],
  };

  // Query PeeringDB network by participant ASN.
  const pdbNet = await getPdbNet(participant.asn);

  if (pdbNet !== null) {
    const {
      id,
      info_prefixes4,
      info_prefixes6,
      irr_as_set,
      policy_general,
      policy_url,
      website,
    } = pdbNet;

    // Add PeeringDB peering policy field to IXF field
    member.peering_policy_url = policy_url;
    // Add PeeringDB org URL field to IXF Field
    member.url = website;
    // Map PeeringDB peering policy type to IXF peering policy types
    member.peering_policy = PEERING_POLICY_MAP[policy_general];

    // Query PeeringDB POCs associated with the network object
    for await (let c of getPdbPoc(id)) {
      if (['NOC', 'Technical', 'Maintenance', 'Policy'].includes(c.role)) {
        // Map technical PeeringDB contact types to IXF contact emails
        member.contact_email = [...member.contact_email, c.email];
        // Map technical PeeringDB contact types to IXF contact phones
        if (c.phone !== '') {
          member.contact_phone = [...member.contact_phone, c.phone];
        }
      }
    }
    // Base IXF IXP Connection structure.
    let connection: IfConnection = {
      ixp_id: 1,
      state: 'active',
      vlan_list: [],
      if_list: [],
    };
    // Base Connection IPv4 structure.
    let ipv4_base = {
      address: '',
      routeserver: participant.routeServerClient,
      max_prefix: info_prefixes4,
      as_macro: irr_as_set,
    };
    // Base Connection IPv6 structure.
    let ipv6_base = {
      address: '',
      routeserver: participant.routeServerClient,
      max_prefix: info_prefixes6,
      as_macro: irr_as_set,
    };
    // Add each 48 IX assigned-address pair as a IXF connection.
    participant.ipv4.map((addr, i) => {
      const ipv4 = { ...ipv4_base };
      const ipv6 = { ...ipv6_base };
      ipv4.address = addr;
      ipv6.address = participant.ipv6[i];
      connection.vlan_list = [...connection.vlan_list, { vlan_id: 0, ipv4, ipv6 }];
    });
    // Add each participant to switchport mapping to IXF connection.
    connection.if_list = [
      ...connection.if_list,
      { switch_id: 1, if_speed: participant.port_speed * 1000, if_type: 'LR4' },
    ];
    member.connection_list = [...member.connection_list, connection];
  }
  return member;
}

/**
 * Build an IXF-compliant data structure. See:
 * https://github.com/euro-ix/json-schemas/blob/master/versions/ixp-member-list-1.0.schema.json
 */

export async function buildIxf() {
  // Base IXF data structure.
  let response = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    ixp_list: ixps,
    member_list: new Array(),
  };

  // Gather participant data and parse to IXF schema.
  for await (let p of getParticipants()) {
    const memberData = await buildMember(p);
    response.member_list = [...response.member_list, memberData];
  }
  return response;
}
