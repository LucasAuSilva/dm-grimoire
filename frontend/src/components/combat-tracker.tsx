import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

import { useState, useCallback, useEffect } from "react"

import { IconDownload, IconPlayerSkipBack, IconPlayerSkipForward } from "@tabler/icons-react"
import type { Combatant } from "@/utils/types"
import { CombatantForm } from "./combatant-form"
import { CombatantRow } from "./combatant-row"
import { ImportCharactersDialog } from "./import-characters-dialog"
import { useCombatLog } from "@/hooks/combat-log"
import { downloadLog } from "@/utils/combat-utils"
import type { CombatLog } from "@/hooks/combat-log"

const sorted = (list: Combatant[]) =>
  [...list].sort((a, b) => b.initiative - a.initiative)

export function CombatTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [started, setStarted] = useState(false)
  const [lastLog, setLastLog] = useState<CombatLog | null>(null)

  const { startLog, addEvent, endLog } = useCombatLog()

  const order = sorted(combatants)

  const addCombatant = (c: Combatant) =>
    setCombatants(prev => [...prev, c])

  const addMultipleCombatants = (cs: Combatant[]) =>
    setCombatants(prev => [...prev, ...cs])

  const updateCombatant = (updated: Combatant) =>
    setCombatants(prev => prev.map(c => c.id === updated.id ? updated : c))

  const removeCombatant = (id: string) => {
    setCombatants(prev => prev.filter(c => c.id !== id))
    setActiveIndex(0)
  }

  const startCombat = () => {
    setStarted(true)
    startLog()
    addEvent({ type: 'round_start', round: 1 })
    if (order[0]) addEvent({ type: 'turn_start', combatantName: order[0].name, round: 1 })
  }

  const next = useCallback(() => {
    if (order.length === 0) return

    const nextIdx = (activeIndex + 1) % order.length
    const nextRound = nextIdx === 0 ? round + 1 : round

    if (nextIdx === 0) {
      setRound(r => r + 1)
      addEvent({ type: 'round_start', round: nextRound })
    }

    setActiveIndex(nextIdx)

    // Log next turn
    if (order[nextIdx]) {
      addEvent({ type: 'turn_start', combatantName: order[nextIdx].name, round: nextRound })
    }

    // Auto-remove expired conditions and log them
    const active = order[activeIndex]
    if (active) {
      const expired = active.conditions.filter(
        cond => cond.endsOnRound !== undefined && cond.endsOnRound <= nextRound
      )
      expired.forEach(cond =>
        addEvent({ type: 'condition_expired', targetName: active.name, conditionName: cond.name, round: nextRound })
      )
      updateCombatant({
        ...active,
        conditions: active.conditions.filter(
          cond => cond.endsOnRound === undefined || cond.endsOnRound > nextRound
        )
      })
    }
  }, [order, activeIndex, round])

  const prev = useCallback(() => {
    if (order.length === 0) return
    const prevIdx = (activeIndex - 1 + order.length) % order.length
    if (activeIndex === 0 && round > 1) setRound(r => r - 1)
    setActiveIndex(prevIdx)
  }, [order, activeIndex, round])

  useEffect(() => {
    if (!started) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [started, next, prev])

  const finishCombat = (clearCombatants = false) => {
    const log = endLog()
    if (log) setLastLog(log)
    setActiveIndex(0)
    setRound(1)
    setStarted(false)
    if (clearCombatants) setCombatants([])
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Combat Tracker</h2>
          {!started && (
            <ImportCharactersDialog onImport={addMultipleCombatants} />
          )}
        </div>
        <div className="flex gap-2 items-center">

          {/* Download last log */}
          {lastLog && !started && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => downloadLog(lastLog)}
            >
              <IconDownload size={14} /> Download Log
            </Button>
          )}

          {combatants.length > 0 && !started && (
            <Button type="button" size="sm" onClick={startCombat}>
              Start Combat
            </Button>
          )}
          {started && (
            <>
              <Button type="button" size="sm" variant="outline" onClick={prev}>
                <IconPlayerSkipBack size={14} />
              </Button>
              <Button type="button" size="sm" onClick={next}>
                <IconPlayerSkipForward size={14} /> Next Turn
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => finishCombat(false)}>
                End Combat
              </Button>
            </>
          )}
          {combatants.length > 0 && (
            <Button type="button" size="sm" variant="destructive" onClick={() => finishCombat(true)}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <CombatantForm onAdd={addCombatant} onAddMultiple={addMultipleCombatants} />

      {started && (
        <div className="flex items-center gap-3 text-sm">
          <Badge variant="outline" className="text-base font-mono px-3 py-1">
            Round {round}
          </Badge>
          {order[activeIndex] && (
            <span className="text-muted-foreground">
              → <span className="text-foreground font-medium">{order[activeIndex].name}</span>
            </span>
          )}
        </div>
      )}

      {order.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 text-sm">
          No combatants yet — add some above to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {order.map((c, idx) => (
            <CombatantRow
              key={c.id}
              combatant={c}
              isActive={started && idx === activeIndex}
              currentRound={round}
              onChange={updateCombatant}
              onRemove={() => removeCombatant(c.id)}
              onLog={addEvent}
            />
          ))}
        </div>
      )}
    </div>
  )
}
