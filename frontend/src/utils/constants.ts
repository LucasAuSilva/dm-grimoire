

export const PLUGIN_ID = "com.lucassilvadev.dm-grimoire"
export const COMBAT_STATE_KEY = `${PLUGIN_ID}/combat-state`

export const COMMON_CONDITIONS = [
  'Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened',
  'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'
]

export type PaperSizes = "A4" | "A5" | "A6" | "BINDER"

export const PAPER_RATIOS = {
  A4: { 
    height: "297mm",
    width: "210mm",
    marginTop: "12mm",
    marginBottom: "12mm",
    marginLeft: "12mm",
    marginRight: "12mm"
  },
  A5: { 
    height: "210mm",
    width: "148mm",
    marginTop: "12mm",
    marginBottom: "12mm",
    marginLeft: "12mm",
    marginRight: "12mm"
  },
  A6: {
    height: "148mm",
    width: "105mm",
    marginTop: "10mm",
    marginBottom: "10mm",
    marginLeft: "10mm",
    marginRight: "10mm"
  },
  BINDER: { 
    height: "275mm",
    width: "200mm",
    marginTop: "8mm",
    marginBottom: "8mm",
    marginLeft: "22mm",
    marginRight: "10mm"
 },
}
