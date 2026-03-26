
export interface Condition {
  name: string
  endsOnRound?: number
}

export interface Combatant {
  id: string
  name: string
  initiative: number
  ac: number
  currentHp: number
  maxHp: number
  conditions: Condition[]
  isPlayer: boolean 
}

