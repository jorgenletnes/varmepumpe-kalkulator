// Prisestimater for utvendige screens inkl. montering (Østlandet, 2025).
// Kilde: markedssjekk mot Solskjerming AS, Markisepriser.no, lokale håndverkere.

export const SCREEN_PRICES = {
  // Materialpris per screen (ekskl. motor)
  pricePerM2: 2800,          // kr/m² for manuell screen inkl. montering

  // Tillegg for automatisering
  motorSolar: 6500,          // kr/screen: motor + solcellepanel + batteri + fjernkontroll
  motorWired: 3200,          // kr/screen: motor + fjernkontroll

  // Elektriker for tilkoblet strøm — skalerer ikke lineært:
  // første screen krever oppmøte + kabelføring, etterfølgende er billigere
  electricianFixed: 5000,    // kr: engangsutgift uavhengig av antall screens
  electricianPerScreen: 800, // kr: tillegg per screen (stikkontakt + tilkobling)
}

export const PREDEFINED_SIZES = [
  { label: '0,95 × 1,25 m (soveromsvindu, lite)', width: 0.95, height: 1.25 },
  { label: '1,85 × 1,25 m (soveromsvindu, stort)', width: 1.85, height: 1.25 },
  { label: '0,95 × 1,85 m (standardvindu)', width: 0.95, height: 1.85 },
  { label: '2,35 × 1,85 m (stort vindu)', width: 2.35, height: 1.85 },
  { label: '0,95 × 2,00 m (terrassedør)', width: 0.95, height: 2.0 },
]
