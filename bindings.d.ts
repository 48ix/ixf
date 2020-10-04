declare const CONTENTFUL_SPACE: string;
declare const CONTENTFUL_TOKEN: string;
declare const CACHE_AGE: number;
declare const ENVIRONMENT: 'production' | 'development';

interface PolicyMap {
  Open: 'open';
  Selective: 'selective';
  Restrictive: 'case-by-case';
  No: 'closed';
}

type PdbPolicies = 'Open' | 'Selective' | 'Restrictive' | 'No';
type IfPolicies = 'open' | 'selective' | 'closed' | 'case-by-case' | 'custom';
type IfSpeeds = 1000 | 10000 | 40000 | 100000;
type ParticipantSpeeds = 1 | 10 | 40 | 100;

interface IfL3Connection {
  address: string;
  routeserver: boolean;
  max_prefix: number;
  as_macro: string;
}

interface IfVlanConnection {
  vlan_id: number;
  ipv4: IfL3Connection;
  ipv6: IfL3Connection;
}

interface IfInterface {
  switch_id: number;
  if_speed: number;
  if_type: 'LR4' | 'SR4';
}

interface IfConnection {
  ixp_id: number;
  state: 'active' | 'inactive';
  if_list: IfInterface[];
  vlan_list: IfVlanConnection[];
}

interface IfMember {
  asnum: number;
  member_type: 'peering' | 'ixp' | 'other';
  name: string;
  url: string;
  contact_email: string[];
  contact_phone: string[];
  peering_policy: IfPolicies;
  peering_policy_url: string;
  member_since: string;
  connection_list: IfConnection[];
}

interface IfNetwork {
  prefix: string;
  mask_length: number;
}

interface IfVlan {
  id: number;
  name: string;
  ipv4: IfNetwork;
  ipv6: IfNetwork;
}

interface IfSwitch {
  id: number;
  name: string;
  colo: string;
  pdb_facility_id: number;
  city: string;
  country: string;
  manufacturer: string;
  model: string;
  software: string;
}

interface IfIXP {
  shortname: string;
  name: string;
  ixp_id: number;
  ixf_id: number;
  peeringdb_id: number;
  country: string;
  url: string;
  support_email: string;
  support_phone: string;
  support_contact_hours: string;
  emergency_email: string;
  emergency_phone: string;
  emergency_contact_hours: string;
  billing_email: string;
  billing_phone: string;
  billing_contact_hours: string;
  switch: IfSwitch[];
  vlan: IfVlan[];
}

interface IfEntry {
  version: string;
  timestamp: string;
  ixp_list: IfIXP[];
  member_list: IfMember[];
}

interface PdbNet {
  aka: string;
  allow_ixp_update: boolean;
  asn: number;
  created: string;
  id: number;
  info_ipv6: boolean;
  info_multicast: boolean;
  info_never_via_route_servers: boolean;
  info_prefixes4: number;
  info_prefixes6: number;
  info_ratio: string;
  info_scope: string;
  info_traffic: string;
  info_type: string;
  info_unicast: boolean;
  irr_as_set: string;
  looking_glass: string;
  name: string;
  notes: string;
  org_id: number;
  policy_contracts: string;
  policy_general: PdbPolicies;
  policy_locations: string;
  policy_ratio: boolean;
  policy_url: string;
  route_server: string;
  status: string;
  updated: string;
  website: string;
}

interface PdbPoc {
  created: string;
  email: string;
  id: number;
  name: string;
  role: 'Abuse' | 'Maintenance' | 'NOC' | 'Policy' | 'Public Relations' | 'Sales' | 'Technical';
  phone: string;
  status: string;
  updated: string;
  url: string;
  visible: 'Public' | 'Private' | 'Users';
}

interface PdbNetResponse {
  data: PdbNet[] | [];
  meta: {};
}

interface PdbPocResponse {
  data: PdbPoc[] | [];
  meta: {};
}

interface ParticipantEntry {
  name: string;
  id: number;
  asn: number;
  port_speed: ParticipantSpeeds;
  circuit_id: string;
  ipv4: string[];
  ipv6: string[];
  routeServerClient: boolean;
  memberSince: string;
}

interface ContentfulEntry {
  sys: object;
  fields: ParticipantEntry;
}

interface ContentfulResponse {
  total: number;
  includes: { Entry: ContentfulEntry[] };
}
