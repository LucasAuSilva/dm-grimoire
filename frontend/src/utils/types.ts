
export interface RequestOpen5e<T> {
  count: number
  next: any
  previous: any
  results: T[]
}

export interface Monster {
  slug: string
  name: string
  armor_class: number
  armor_desc: any
  hit_points: number
  document__title: string
}


export interface Condition {
  id: string
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

export interface LogEvent {
  type: 'combat_start' | 'combat_end' | 'round_start' | 'turn_start' 
      | 'hp_change' | 'condition_added' | 'condition_removed' | 'condition_expired'
  timestamp: number
  round?: number
  combatantName?: string  // for turn_start
  targetName?: string     // for hp/condition events
  delta?: number
  previousHp?: number
  newHp?: number
  maxHp?: number
  isPlayer?: boolean      // so we know dead vs unconscious
  conditionName?: string
}

export interface CombatLog {
  startedAt: string
  events: LogEvent[]
}

