export interface HeatPump {
  id: string
  name: string
  shortName: string
  capacity: string
  scop: number
  unitPrice: number
  installPrice: number
  description: string
}

export const heatPumps: HeatPump[] = [
  {
    id: 'mitsubishi-ln25',
    name: 'Mitsubishi Electric Kaiteki 6600',
    shortName: 'Mitsubishi Kaiteki 6600 (LN25)',
    capacity: '2,5 kW / 3,4 kW',
    scop: 4.7,
    unitPrice: 20500,
    installPrice: 8500,
    description: 'Stilren designpumpe. Effektiv ned til -25°C. Passer rom opptil 35 m².',
  },
  {
    id: 'panasonic-hz35xke',
    name: 'Panasonic HZ35XKE',
    shortName: 'Panasonic HZ35XKE (Flagship)',
    capacity: '3,5 kW / 4,0 kW',
    scop: 4.9,
    unitPrice: 26000,
    installPrice: 9000,
    description: 'Toppmodellen fra Panasonic. Svært lavt støynivå og høy energieffektivitet.',
  },
  {
    id: 'panasonic-cz25',
    name: 'Panasonic CS-CZ25ZKE',
    shortName: 'Panasonic CZ25 / HZ25-serien',
    capacity: '2,5 kW / 3,2 kW',
    scop: 4.6,
    unitPrice: 16500,
    installPrice: 8000,
    description: 'Prisgunstig og pålitelig. God ytelse for mellomstore rom.',
  },
  {
    id: 'mitsubishi-8700',
    name: 'Mitsubishi Electric Kaiteki 8700',
    shortName: 'Mitsubishi Kaiteki 8700',
    capacity: '3,5 kW / 4,2 kW',
    scop: 4.6,
    unitPrice: 24500,
    installPrice: 9000,
    description: 'Kraftig designpumpe. Høy varmekapasitet for større boliger.',
  },
  {
    id: 'daikin-emura',
    name: 'Daikin Emura',
    shortName: 'Daikin Emura',
    capacity: '2,0 kW / 3,4 kW',
    scop: 4.6,
    unitPrice: 23000,
    installPrice: 9000,
    description: 'Ikonisk europeisk design. Svært stillegående og effektiv.',
  },
]
