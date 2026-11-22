export interface CensusNeighbor {
  id: string;
  socioCode: string;
  name: string;
  ci: string;
  phone: string;
  block: string;
  house: string;
  otbId: string;
  otbName: string;
  status: 'Al Día' | 'En Mora';
  debt: number;
  latitude: number;
  longitude: number;
}

export const CENSUS_NEIGHBORS: CensusNeighbor[] = [
  {
    id: '1',
    socioCode: 'SOC-012',
    name: 'Juan José Flores Morales',
    ci: '7412589 CBBA',
    phone: '74567890',
    block: 'Manzano 263',
    house: 'Lote 12',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Graciela (Distrito 1)',
    status: 'En Mora',
    debt: 50.0,
    latitude: -17.4119,
    longitude: -66.1664
  },
  {
    id: '2',
    socioCode: 'SOC-005',
    name: 'Silvia Rojas Torrico',
    ci: '8521479 CBBA',
    phone: '75678901',
    block: 'Manzano 266',
    house: 'Lote 05',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Graciela (Distrito 1)',
    status: 'En Mora',
    debt: 125.0,
    latitude: -17.4131,
    longitude: -66.1645
  },
  {
    id: '3',
    socioCode: 'SOC-001',
    name: 'Roberto Fernández Vargas',
    ci: '5289341 CBBA',
    phone: '72345678',
    block: 'Manzano 262',
    house: 'Lote 01',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Graciela (Distrito 1)',
    status: 'Al Día',
    debt: 0.0,
    latitude: -17.4118,
    longitude: -66.1645
  },
  {
    id: '4',
    socioCode: 'SOC-008',
    name: 'Marina Condori Rocha',
    ci: '6398412 CBBA',
    phone: '73456789',
    block: 'Manzano 270',
    house: 'Lote 08',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Graciela (Distrito 1)',
    status: 'Al Día',
    debt: 0.0,
    latitude: -17.4144,
    longitude: -66.1665
  },
  {
    id: '5',
    socioCode: 'SOC-014',
    name: 'Pedro Gonzalo Canaviri',
    ci: '4896325 CBBA',
    phone: '78912345',
    block: 'Manzano 261',
    house: 'Lote 14',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Graciela (Distrito 1)',
    status: 'Al Día',
    debt: 0.0,
    latitude: -17.4118,
    longitude: -66.1628
  },
  {
    id: '6',
    socioCode: 'SOC-003',
    name: 'Carlos Mamani Choque',
    ci: '5289140 CBBA',
    phone: '71234567',
    block: 'Manzano 268',
    house: 'Lote 08',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Graciela (Distrito 1)',
    status: 'En Mora',
    debt: 75.0,
    latitude: -17.4144,
    longitude: -66.1638
  },
  // OTB Los Pinos (La Paz)
  {
    id: '7',
    socioCode: 'PINO-033',
    name: 'Gonzalo Peñaranda',
    ci: '3948572 LPZ',
    phone: '76543210',
    block: 'Bloque 4',
    house: 'Depto 201',
    otbId: '22222222-2222-2222-2222-222222222222',
    otbName: 'Los Pinos',
    status: 'Al Día',
    debt: 0.0,
    latitude: -16.5415,
    longitude: -66.0825
  },
  {
    id: '8',
    socioCode: 'PINO-012',
    name: 'Mariela Quiroga Sanjinés',
    ci: '4891230 LPZ',
    phone: '77234561',
    block: 'Bloque 2',
    house: 'Depto 102',
    otbId: '22222222-2222-2222-2222-222222222222',
    otbName: 'Los Pinos',
    status: 'En Mora',
    debt: 60.0,
    latitude: -16.541,
    longitude: -66.0819
  },
  // OTB Barrio Lindo Plan 4000 (Santa Cruz)
  {
    id: '9',
    socioCode: 'SOC-SCZ-010',
    name: 'Wilder Peña Justiniano',
    ci: '6128490 SCZ',
    phone: '78512490',
    block: 'UV 45',
    house: 'Mz 12, Lote 03',
    otbId: '33333333-3333-3333-3333-333333333333',
    otbName: 'Barrio Lindo Plan 4000',
    status: 'Al Día',
    debt: 0.0,
    latitude: -17.7845,
    longitude: -63.1610
  },
  {
    id: '10',
    socioCode: 'SOC-SCZ-018',
    name: 'Carla Melgar Aguilera',
    ci: '7392104 SCZ',
    phone: '76319842',
    block: 'UV 45',
    house: 'Mz 12, Lote 09',
    otbId: '33333333-3333-3333-3333-333333333333',
    otbName: 'Barrio Lindo Plan 4000',
    status: 'En Mora',
    debt: 30.0,
    latitude: -17.7850,
    longitude: -63.1605
  }
];

export const findNeighborByCodeOrCi = (query: string, otbId?: string): CensusNeighbor | null => {
  if (!query) return null;
  const clean = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean) return null;

  return (
    CENSUS_NEIGHBORS.find((n) => {
      if (otbId && n.otbId !== otbId) return false;
      const cleanSocio = n.socioCode.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanCi = n.ci.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanName = n.name.toLowerCase();

      return (
        cleanSocio === clean ||
        cleanSocio.includes(clean) ||
        cleanCi.includes(clean) ||
        cleanName.includes(query.trim().toLowerCase())
      );
    }) || null
  );
};

export const getNeighborsByOtb = (otbId: string): CensusNeighbor[] => {
  return CENSUS_NEIGHBORS.filter((n) => n.otbId === otbId);
};
