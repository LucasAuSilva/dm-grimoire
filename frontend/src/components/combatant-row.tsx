import type { Combatant } from "@/utils/types"

import { useState, useRef } from "react"
import { Badge } from "./ui/badge"
import { IconChevronDown, IconChevronUp, IconPlus, IconShield, IconTrash } from "@tabler/icons-react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { ConditionBadge } from "./condition-badge"
import { COMMON_CONDITIONS } from "@/utils/constants"
import { uid } from "@/utils/helpers"
import { EditableField } from "./editable-field"

interface CombatantRowProps {
  combatant: Combatant
  isActive: boolean
  currentRound: number
  onChange: (updated: Combatant) => void
  onRemove: () => void
}

export function CombatantRow({ combatant: c, isActive, currentRound, onChange, onRemove }: CombatantRowProps) {
  const [conditionInput, setConditionInput] = useState('')
  const [conditionRounds, setConditionRounds] = useState('')
  const [expanded, setExpanded] = useState(false)

  const addCondition = (name: string) => {
    if (!name.trim()) return
    const endsOnRound = conditionRounds
      ? currentRound + Number(conditionRounds)
      : undefined
    onChange({
      ...c,
      conditions: [...c.conditions, { id: uid(), name: name.trim(), endsOnRound }]
    })
    setConditionInput('')
    setConditionRounds('')
  }

  const removeCondition = (id: string) =>
    onChange({ ...c, conditions: c.conditions.filter(cond => cond.id !== id) })

  const hpPercent = c.maxHp > 0 ? (c.currentHp / c.maxHp) * 100 : 100
  const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className={`rounded-lg border transition-all ${isActive ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-background'}`}>

      {/* Main row */}
      <div className="flex items-center gap-3 p-3">

        {/* Initiative bubble — double-click to edit, auto-sorts */}
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
            <span className={`font-semibold truncate ${isActive ? 'text-primary' : ''}`}>{c.name}</span>
            {c.isPlayer && <Badge variant="secondary" className="text-xs py-0">PC</Badge>}
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
          <span>{c.ac}</span>
        </div>

        {/* HP section */}
        <div className="flex flex-col gap-1 w-36 shrink-0">

          {/* Current / Max — both double-click to edit */}
          <div className="flex items-center gap-1 text-xs">
            <EditableField
              value={c.currentHp}
              base={c.currentHp}
              min={0}
              max={c.maxHp}
              className={hpPercent <= 25 ? 'text-red-400' : hpPercent <= 50 ? 'text-yellow-400' : 'text-green-400'}
              onCommit={next => onChange({ ...c, currentHp: next })}
            />
            <span className="text-muted-foreground">/</span>
            <EditableField
              value={c.maxHp}
              base={c.maxHp}
              min={0}
              max={9999}
              className="text-muted-foreground"
              onCommit={next => onChange({ ...c, maxHp: next, currentHp: Math.min(c.currentHp, next) })}
            />
          </div>

          {/* HP bar */}
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full transition-all ${hpColor}`} style={{ width: `${hpPercent}%` }} />
          </div>
        </div>

        {/* Expand (conditions) + remove */}
        <div className="flex gap-1 shrink-0">
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(e => !e)}>
            {expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onRemove}>
            <IconTrash size={14} />
          </Button>
        </div>
      </div>

      {/* Expanded panel — conditions only */}
      {expanded && (
        <div className="px-3 pb-3 flex flex-col gap-3 border-t pt-3">
          <div className="flex flex-col gap-2">
            <Label className="text-xs">Add Condition</Label>
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Condition name..."
                value={conditionInput}
                className="h-8 text-sm flex-1 min-w-32"
                onChange={e => setConditionInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCondition(conditionInput)}
              />
              <Input
                type="number"
                placeholder="Rounds"
                value={conditionRounds}
                className="h-8 text-sm w-20"
                onChange={e => setConditionRounds(e.target.value)}
              />
              <Button type="button" size="sm" className="h-8" onClick={() => addCondition(conditionInput)}>
                <IconPlus size={12} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {COMMON_CONDITIONS.map(cond => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => addCondition(cond)}
                  className="text-xs px-2 py-0.5 rounded border border-border hover:bg-muted transition-colors"
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
