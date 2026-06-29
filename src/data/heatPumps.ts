export interface HeatPump {
  id: string
  brand: string
  name: string
  shortName: string
  capacity: string
  heatingKw: number
  scop: number
  unitPrice: number
  installPrice: number
  description: string
  noiseIndoorDb: string  // SPL dB(A) min–maks (laveste til høyeste hastighet)
  noiseOutdoorDb: number // SPL dB(A) ved høy hastighet, oppvarmingsdrift
}

export const heatPumps: HeatPump[] = [
  // --- Daikin ---
  {
    id: 'daikin-emura',
    brand: 'Daikin',
    name: 'Daikin Emura',
    shortName: 'Daikin Emura',
    capacity: '2,0 kW / 3,4 kW',
    heatingKw: 2.0,
    scop: 4.6,
    unitPrice: 23000,
    installPrice: 9000,
    description: 'Ikonisk europeisk design. Svært stillegående og effektiv.',
    noiseIndoorDb: '19–40',
    noiseOutdoorDb: 47,
  },
  {
    id: 'daikin-ftxp25',
    brand: 'Daikin',
    name: 'Daikin FTXP25N9 + RXP25N9',
    shortName: 'Daikin FTXP25N9 (Perfera)',
    capacity: '2,5 kW / 3,0 kW',
    heatingKw: 2.5,
    scop: 4.6,
    unitPrice: 17000,
    installPrice: 8000,
    description: 'Prisgunstig Daikin med avtakbart vaskbart filter. Stille fra 19 dB(A).',
    noiseIndoorDb: '19–40',
    noiseOutdoorDb: 47,
  },

  // --- Mitsubishi Electric ---
  {
    id: 'mitsubishi-kaiteki-6300',
    brand: 'Mitsubishi Electric',
    name: 'Mitsubishi Electric Kaiteki 6300',
    shortName: 'Mitsubishi Kaiteki 6300',
    capacity: '2,5 kW / 3,2 kW',
    heatingKw: 2.5,
    scop: 5.2,
    unitPrice: 16500,
    installPrice: 8000,
    description: 'Stillegående Kaiteki med Hyper Heating. SCOP 5,2. Passer godt for mellomstore rom.',
    noiseIndoorDb: '19–45',
    noiseOutdoorDb: 49,
  },
  {
    id: 'mitsubishi-ln25',
    brand: 'Mitsubishi Electric',
    name: 'Mitsubishi Electric Kaiteki 6600',
    shortName: 'Mitsubishi Kaiteki 6600 (LN25)',
    capacity: '2,5 kW / 3,4 kW',
    heatingKw: 2.5,
    scop: 5.1,
    unitPrice: 20500,
    installPrice: 8500,
    description: 'Stilren designpumpe. Effektiv ned til -25°C. Passer rom opptil 35 m².',
    noiseIndoorDb: '19–45',
    noiseOutdoorDb: 50,
  },
  {
    id: 'mitsubishi-8700',
    brand: 'Mitsubishi Electric',
    name: 'Mitsubishi Electric Kaiteki 8700',
    shortName: 'Mitsubishi Kaiteki 8700',
    capacity: '3,5 kW / 4,2 kW',
    heatingKw: 3.5,
    scop: 4.6,
    unitPrice: 24500,
    installPrice: 9000,
    description: 'Kraftig designpumpe. Høy varmekapasitet for større boliger.',
    noiseIndoorDb: '25–47',
    noiseOutdoorDb: 54,
  },

  // --- Panasonic ---
  {
    id: 'panasonic-cz25',
    brand: 'Panasonic',
    name: 'Panasonic CS-CZ25ZKE',
    shortName: 'Panasonic CS-CZ25ZKE',
    capacity: '2,5 kW / 3,2 kW',
    heatingKw: 2.5,
    scop: 4.6,
    unitPrice: 16500,
    installPrice: 8000,
    description: 'Prisgunstig og pålitelig. God ytelse for mellomstore rom.',
    noiseIndoorDb: '21–38',
    noiseOutdoorDb: 47,
  },
  {
    id: 'panasonic-hz25zke',
    brand: 'Panasonic',
    name: 'Panasonic CS-HZ25ZKE',
    shortName: 'Panasonic CS-HZ25ZKE (Flagship)',
    capacity: '2,5 kW / 3,2 kW',
    heatingKw: 2.5,
    scop: 5.3,
    unitPrice: 22000,
    installPrice: 8500,
    description: 'Flaggskip fra Panasonic med nanoe™ X luftrensing. Ekstremt stillegående fra 18 dB(A).',
    noiseIndoorDb: '18–45',
    noiseOutdoorDb: 47,
  },
  {
    id: 'panasonic-hz35xke',
    brand: 'Panasonic',
    name: 'Panasonic CS-HZ35ZKE',
    shortName: 'Panasonic CS-HZ35ZKE (Flagship)',
    capacity: '3,5 kW / 4,2 kW',
    heatingKw: 3.5,
    scop: 5.3,
    unitPrice: 26000,
    installPrice: 9000,
    description: 'Toppmodellen fra Panasonic. Svært lavt støynivå og høy energieffektivitet.',
    noiseIndoorDb: '18–45',
    noiseOutdoorDb: 50,
  },

  // --- Toshiba ---
  {
    id: 'toshiba-daiseikai-10',
    brand: 'Toshiba',
    name: 'Toshiba Daiseikai 10 R32',
    shortName: 'Toshiba Daiseikai 10',
    capacity: '2,5 kW / 3,0 kW',
    heatingKw: 2.5,
    scop: 5.5,
    unitPrice: 23000,
    installPrice: 8500,
    description: 'Høyest SCOP i klassen (5,5 A+++). Effektiv ned til -30°C. Wi-Fi inkludert.',
    noiseIndoorDb: '~20–43',  // estimert fra LWA 54 dB(A) — databladet oppgir lydeffekt, ikke lydtrykk
    noiseOutdoorDb: 49,       // estimert fra LWA 60 dB(A)
  },
]
