// 48 IX Switches
const switches = [
  {
    id: 1,
    name: 'sw1.phx1.48ix.net',
    colo: 'EdgeConneX Phoenix (EDCPHX01)',
    pdb_facility_id: 1917,
    city: 'Tempe',
    country: 'AZ',
    manufacturer: 'Arista Networks, Inc.',
    model: '7280SE',
    software: 'EOS',
  },
];

// 48 IX VLANs
const vlans = [
  {
    id: 0,
    name: 'Peering LAN',
    ipv4: {
      prefix: '149.112.3.0',
      mask_length: 24,
    },
    ipv6: {
      prefix: '2001:504:14::',
      mask_length: 64,
    },
  },
];

// 48 IX Information
export const ixps = [
  {
    shortname: '48 IX',
    name: '48 IX',
    ixp_id: 1,
    ixf_id: 0,
    peeringdb_id: 3179,
    country: 'US',
    url: 'https://www.48ix.net/',
    support_email: 'noc@48ix.net',
    support_phone: '+1 602 935 9850',
    support_contact_hours: '8/5',
    emergency_email: 'noc@48ix.net',
    emergency_phone: '+1 602 935 9850',
    emergency_contact_hours: '24/7',
    billing_email: 'ar@48ix.net',
    billing_phone: '+1 602 935 9850',
    billing_contact_hours: '8/5',
    switch: switches,
    vlan: vlans,
  },
];
