import { useCallback, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { CombatantRow } from '@/components/combatant-row'
import { CombatantForm } from '@/components/combatant-form'
import { ImportCharactersDialog } from '@/components/import-characters-dialog'

import { useCombatLog } from '@/hooks/combat-log'

import { sortedByIniciative } from '@/lib/utils'
import type { Combatant, CombatLog } from '@/utils/types'

import { IconChevronsDown, IconPlayerSkipBack, IconPlayerSkipForward } from '@tabler/icons-react'

import { createFileRoute } from '@tanstack/react-router'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import OBR from '@owlbear-rodeo/sdk'
import { COMBAT_STATE_KEY, PLUGIN_ID } from '@/utils/constants'
import { InitiativeDialog } from '@/components/iniciative-dialog'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { useObrRole } from '@/hooks/use-obr.role'
import { goToToken } from '@/lib/owlbear'
import { DownloadLogDialog } from '@/components/download-log-dialog'

export const Route = createFileRoute('/(extensions)/_layout/combat-tracker')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true)
  const [lastLog, setLastLog] = useState<CombatLog | null>(null)
  const [pendingTokens, setPendingTokens] = useState<{ id: string, name: string }[]>([])

  const [combatants, setCombatants] = usePersistedState<Combatant[]>('combat-tracker:combatants', [])
  const [activeIndex, setActiveIndex] = usePersistedState<number>('combat-tracker:activeIndex', 0)
  const [round, setRound] = usePersistedState<number>('combat-tracker:round', 1)
  const [started, setStarted] = usePersistedState<boolean>('combat-tracker:started', false)

  // role is null while OBR is initializing — wait for it to resolve
  const { role, isGM } = useObrRole()

  const { startLog, addEvent, endLog } = useCombatLog()

  const order = sortedByIniciative(combatants)

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
    setIsCollapsibleOpen(false)
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
    if (order[nextIdx]) {
      addEvent({ type: 'turn_start', combatantName: order[nextIdx].name, round: nextRound })
    }
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
    setIsCollapsibleOpen(true)
    if (clearCombatants) setCombatants([])
  }

  // Listen for tokens added via context menu
  useEffect(() => {
    const unsubscribe = OBR.room.onMetadataChange((metadata) => {
      const pending = metadata[`${PLUGIN_ID}/pending-initiative`] as { id: string, name: string }[] | undefined
      if (pending && pending.length > 0) {
        setPendingTokens(pending)
        OBR.room.setMetadata({ [`${PLUGIN_ID}/pending-initiative`]: [] })
      }
    })
    return () => unsubscribe()
  }, [])

  // GM Update Metadata
  useEffect(() => {
    if (role === null || !isGM) return

    OBR.room.setMetadata({
      [COMBAT_STATE_KEY]: { combatants, activeIndex, round, started },
    })
  }, [role, isGM, combatants, activeIndex, round, started])

  // Player Receives Metadata
  useEffect(() => {
    if (role === null || isGM) return

    let cancelled = false

    const applyState = (state: any) => {
      if (!state || cancelled) return
      setCombatants(state.combatants ?? [])
      setActiveIndex(state.activeIndex ?? 0)
      setRound(state.round ?? 1)
      setStarted(state.started ?? false)
    }

    let unsubscribe: (() => void) | undefined

    ;(async () => {
      const metadata = await OBR.room.getMetadata()
      applyState(metadata[COMBAT_STATE_KEY])

      unsubscribe = OBR.room.onMetadataChange((metadata) => {
        applyState(metadata[COMBAT_STATE_KEY])
      })
    })()

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [role, isGM])

  // If role not resolved yet, show nothing
  if (role === null) return null

  return (
    <Collapsible
      open={isCollapsibleOpen}
      onOpenChange={setIsCollapsibleOpen}
      className="flex flex-col gap-4 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Combat Tracker</h2>
          {isGM && !started && (
            <ImportCharactersDialog onImport={addMultipleCombatants} compact />
          )}
          {pendingTokens.length > 0 && (
            <InitiativeDialog
              tokens={pendingTokens}
              onConfirm={(combatants) => {
                addMultipleCombatants(combatants)
                setPendingTokens([])
              }}
              onClose={() => setPendingTokens([])}
            />
          )}
        </div>
        <div className="flex gap-2 items-center">
          {lastLog && !started && (
            <DownloadLogDialog compact />
          )}
          {isGM && combatants.length > 0 && !started && (
            <Button type="button" size="sm" onClick={startCombat}>
              Start Combat
            </Button>
          )}
          {isGM && started && (
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
          {isGM && combatants.length > 0 && (
            <Button type="button" size="sm" variant="destructive" onClick={() => finishCombat(true)}>
              Reset
            </Button>
          )}
          {isGM && (
            <CollapsibleTrigger asChild>
              <Button variant='ghost' size='icon' className='size-8'>
                <IconChevronsDown />
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
      </div>

      <Separator />

      {isGM && (
        <CollapsibleContent>
          <CombatantForm onAdd={addCombatant} onAddMultiple={addMultipleCombatants} compact />
        </CollapsibleContent>
      )}

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
          {isGM ? 'No combatants yet — add some above to get started.' : 'Waiting for the GM to start combat...'}
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
              readonly={!isGM}
              onGoToToken={goToToken}
            />
          ))}
        </div>
      )}
    </Collapsible>
  )
}
