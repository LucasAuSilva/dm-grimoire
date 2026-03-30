import type { CombatLog, LogEvent } from "@/utils/types"
import { useRef, useCallback } from "react"

const STORAGE_KEY = 'dm-grimoire:dm_combat_logs'
const MAX_LOGS = 20

export function useCombatLog() {
  const logRef = useRef<CombatLog | null>(null)

  const startLog = useCallback(() => {
    const log: CombatLog = {
      startedAt: new Date().toISOString(),
      events: [{ type: 'combat_start', timestamp: Date.now() }],
    }
    logRef.current = log
  }, [])

  const addEvent = useCallback((event: Omit<LogEvent, 'timestamp'>) => {
    if (!logRef.current) return
    logRef.current.events.push({ ...event, timestamp: Date.now() })
  }, [])

  const endLog = useCallback(() => {
    if (!logRef.current) return
    logRef.current.events.push({ type: 'combat_end', timestamp: Date.now() })

    // Persist to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as CombatLog[]
      existing.push(logRef.current)
      const trimmed = existing.slice(-MAX_LOGS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch {
      console.error('Failed to save combat log')
    }

    const saved = logRef.current
    logRef.current = null
    return saved
  }, [])

  return { startLog, addEvent, endLog }
}

export function getSavedLogs(): CombatLog[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
