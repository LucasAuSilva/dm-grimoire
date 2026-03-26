import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

import { useState, useCallback, useEffect } from "react"

import { IconPlayerSkipBack, IconPlayerSkipForward } from "@tabler/icons-react"
import type { Combatant } from "@/utils/types"
import { CombatantForm } from "./combatant-form"
import { CombatantRow } from "./combatant-row"
import { ImportCharactersDialog } from "./import-characters-dialog"

const sorted = (list: Combatant[]) =>
  [...list].sort((a, b) => b.initiative - a.initiative)

export function CombatTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [started, setStarted] = useState(false)

  const order = sorted(combatants)

  const addCombatant = (c: Combatant) => {
    setCombatants(prev => [...prev, c])
  }

  const addMultipleCombatants = (combatants: Combatant[]) => {
    setCombatants(prev => [...prev, ...combatants])
  }

  const updateCombatant = (updated: Combatant) =>
    setCombatants(prev => prev.map(c => c.id === updated.id ? updated : c))

  const removeCombatant = (id: string) => {
    setCombatants(prev => prev.filter(c => c.id !== id))
    setActiveIndex(0)
  }

  const next = useCallback(() => {
    if (order.length === 0) return

    const nextIdx = (activeIndex + 1) % order.length
    const nextRound = nextIdx === 0 ? round + 1 : round

    if (nextIdx === 0) setRound(r => r + 1)
    setActiveIndex(nextIdx)

    // Auto-remove expired conditions using nextRound (not stale round)
    const active = order[activeIndex]
    if (active) {
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

  // inside CombatTracker, after your next/prev definitions:
  useEffect(() => {
    if (!started) return

    const handleKey = (e: KeyboardEvent) => {
      // ignore if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [started, next, prev])

  const reset = () => {
    setActiveIndex(0)
    setRound(1)
    setStarted(false)
    setCombatants([])
  }

  const closeCombat = () => {
    setActiveIndex(0)
    setRound(1)
    setStarted(false)
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Combat Tracker</h2>
          {!started && (
            <div className="flex justify-end">
              <ImportCharactersDialog onImport={addMultipleCombatants} />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {combatants.length > 0 && !started && (
            <Button type="button" size="sm" onClick={() => setStarted(true)}>
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
            </>
          )}
          {combatants.length > 0 && (
            <Button type="button" size="sm" variant="destructive" onClick={reset}>
              Reset
            </Button>
          )}
          {started && (
            <Button type="button" size="sm" variant="destructive" onClick={closeCombat}>
              Close combat
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Import + Add form */}
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

      {/* Combatant list */}
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
            />
          ))}
        </div>
      )}
    </div>
  )
}
