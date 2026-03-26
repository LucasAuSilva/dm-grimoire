import type { CombatLog, LogEvent } from "@/utils/types"

// ── Rebuild round/turn structure from flat event list ────────────────────────

interface TurnEntry {
  combatantName: string
  events: LogEvent[]
}

interface RoundEntry {
  round: number
  turns: TurnEntry[]
}

function buildStructure(events: LogEvent[]): RoundEntry[] {
  const rounds: RoundEntry[] = []
  let currentRound: RoundEntry | null = null
  let currentTurn: TurnEntry | null = null

  for (const event of events) {
    if (event.type === 'combat_start' || event.type === 'combat_end') continue

    if (event.type === 'round_start') {
      currentTurn = null
      currentRound = { round: event.round!, turns: [] }
      rounds.push(currentRound)
      continue
    }

    if (event.type === 'turn_start') {
      if (!currentRound) {
        // safety: create round 1 if missing
        currentRound = { round: 1, turns: [] }
        rounds.push(currentRound)
      }
      currentTurn = { combatantName: event.combatantName!, events: [] }
      currentRound.turns.push(currentTurn)
      continue
    }

    // hp_change, condition_added, condition_expired, condition_removed
    if (currentTurn) {
      currentTurn.events.push(event)
    }
  }

  return rounds
}

// ── Formatters ───────────────────────────────────────────────────────────────

function formatHpEvent(e: LogEvent): string {
  const delta = e.delta!
  const sign = delta > 0 ? `+${delta}` : `${delta}`
  let line = `${sign} hp to ${e.targetName}`

  if (e.newHp === 0 && delta < 0) {
    line += e.isPlayer
      ? ` - ${e.targetName} is unconscious`
      : ` - ${e.targetName} is dead`
  } else if (delta > 0 && e.newHp! > 0 && (e.newHp! - delta) <= 0) {
    line += ` - ${e.targetName} is back up`
  }

  return ` - ${line}`
}

function formatConditionEvent(e: LogEvent): string {
  if (e.type === 'condition_added') return ` - ${e.conditionName} condition added to ${e.targetName}`
  if (e.type === 'condition_expired') return ` - ${e.conditionName} condition expired on ${e.targetName}`
  return ` - ${e.conditionName} condition removed from ${e.targetName}`
}

function formatEvent(e: LogEvent): string {
  if (e.type === 'hp_change') return formatHpEvent(e)
  return formatConditionEvent(e)
}

function formatTurn(turn: TurnEntry): string {
  if (turn.events.length === 0) return ''
  const lines = [`\n**${turn.combatantName} turn**`]
  for (const event of turn.events) lines.push(formatEvent(event))
  return lines.join('\n')
}

function formatRound(round: RoundEntry): string {
  const lines = [`### Round ${round.round}`]
  for (const turn of round.turns) {
    const formatted = formatTurn(turn)
    if (formatted) lines.push(formatted)
  }
  return lines.join('\n')
}

// ── Public API ───────────────────────────────────────────────────────────────

export function logToMarkdown(log: CombatLog): string {
  const rounds = buildStructure(log.events)
  const lines: string[] = []

  for (const round of rounds) {
    lines.push(formatRound(round))
    lines.push('')
  }

  lines.push('**End combat**')
  return lines.join('\n')
}

export function downloadLog(log: CombatLog) {
  const md = logToMarkdown(log)
  const date = new Date(log.startedAt)
  const pad = (n: number) => String(n).padStart(2, '0')
  const filename = `combat-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}.md`

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
