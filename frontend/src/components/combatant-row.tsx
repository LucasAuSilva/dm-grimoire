import type { Combatant, Condition, LogEvent } from "@/utils/types"

import { useState } from "react"
import { Badge } from "./ui/badge"
import { IconPlus, IconShield, IconTrash } from "@tabler/icons-react"
import { Button } from "./ui/button"
import { ConditionBadge } from "./condition-badge"
import { EditableField } from "./editable-field"
import { AddConditionDialog } from "./add-condition-dialog"

interface CombatantRowProps {
  combatant: Combatant
  isActive: boolean
  currentRound: number
  onChange: (updated: Combatant) => void
  onRemove: () => void
  onLog: (event: Omit<LogEvent, 'timestamp'>) => void
}

export function CombatantRow({ combatant: c, isActive, currentRound, onChange, onRemove, onLog }: CombatantRowProps) {
  const [conditionOpen, setConditionOpen] = useState(false)

  const addCondition = (condition: Condition) => {
    onChange({ ...c, conditions: [...c.conditions, condition] })
    onLog({
      type: 'condition_added',
      targetName: c.name,
      conditionName: condition.name,
      round: currentRound,
    })
  }

  const removeCondition = (id: string) => {
    const cond = c.conditions.find(x => x.id === id)
    onChange({ ...c, conditions: c.conditions.filter(x => x.id !== id) })
    if (cond) {
      onLog({
        type: 'condition_expired',
        targetName: c.name,
        conditionName: cond.name,
        round: currentRound,
      })
    }
  }

  const handleHpCommit = (next: number) => {
    const delta = next - c.currentHp
    if (delta === 0) return
    onChange({ ...c, currentHp: next })
    onLog({
      type: 'hp_change',
      targetName: c.name,
      delta,
      previousHp: c.currentHp,
      newHp: next,
      maxHp: c.maxHp,
      round: currentRound,
    })
  }

  const handleMaxHpCommit = (next: number) => {
    const newCurrentHp = Math.min(c.currentHp, next)
    onChange({ ...c, maxHp: next, currentHp: newCurrentHp })
  }

  const hpPercent = c.maxHp > 0 ? (c.currentHp / c.maxHp) * 100 : 100
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <>
      <div className={`rounded-lg border transition-all ${
        c.currentHp === 0 && c.maxHp !== 0
          ? c.isPlayer
            ? 'border-gray-500/40 bg-gray-500/10 opacity-60'
            : 'border-red-900/40 bg-red-950/20 opacity-50'
          : isActive
            ? 'border-primary bg-primary/5 shadow-md'
            : 'border-border bg-background'
      }`}>
        <div className="flex items-center gap-3 p-3">

          {/* Initiative bubble */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${c.isPlayer ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            <EditableField
              value={c.initiative}
              base={c.initiative}
              min={-20}
              max={99}
              className="text-sm"
              onCommit={next => onChange({ ...c, initiative: next })}
            />
          </div>

          {/* Name + conditions */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-semibold truncate ${isActive ? 'text-primary' : ''} ${c.currentHp === 0 ? 'line-through opacity-60' : ''}`}>
                {c.name}
              </span>
              {c.isPlayer && <Badge variant="secondary" className="text-xs py-0">PC</Badge>}
              {c.currentHp === 0 && (
                <Badge variant="outline" className={`text-xs py-0 ${c.isPlayer ? 'border-gray-400 text-gray-400' : 'border-red-700 text-red-600'}`}>
                  {c.isPlayer ? 'Unconscious' : 'Dead'}
                </Badge>
              )}
            </div>
            {c.conditions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {c.conditions.map(cond => (
                  <ConditionBadge
                    key={cond.id}
                    condition={cond}
                    currentRound={currentRound}
                    onRemove={() => removeCondition(cond.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* AC */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
            <IconShield size={14} />
            <EditableField
              value={c.ac}
              base={c.ac}
              min={0}
              max={100}
              onCommit={next => onChange({ ...c, ac: next })}
            />
          </div>

          {/* HP section */}
          <div className="flex flex-col gap-1 w-36 shrink-0">
            <div className="flex items-center gap-1 text-xs">
              <EditableField
                value={c.currentHp}
                base={c.currentHp}
                min={0}
                max={c.maxHp}
                className={hpPercent <= 25 ? 'text-red-400' : hpPercent <= 50 ? 'text-yellow-400' : 'text-green-400'}
                onCommit={handleHpCommit}
              />
              <span className="text-muted-foreground">/</span>
              <EditableField
                value={c.maxHp}
                base={c.maxHp}
                min={0}
                max={9999}
                className="text-muted-foreground"
                onCommit={handleMaxHpCommit}
              />
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${hpColor}`} style={{ width: `${hpPercent}%` }} />
            </div>
          </div>

          {/* Add condition + remove */}
          <div className="flex gap-1 shrink-0">
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Add condition" onClick={() => setConditionOpen(true)}>
              <IconPlus size={14} />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onRemove}>
              <IconTrash size={14} />
            </Button>
          </div>
        </div>
      </div>

      <AddConditionDialog
        open={conditionOpen}
        onOpenChange={setConditionOpen}
        currentRound={currentRound}
        onAdd={addCondition}
      />
    </>
  )
}
