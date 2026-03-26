import type { Condition } from "@/utils/types"
import { Badge } from "./ui/badge"
import { IconX } from "@tabler/icons-react"

interface ConditionBadgeProps {
  condition: Condition
  currentRound: number
  onRemove: () => void
}
 
export function ConditionBadge({ condition, currentRound, onRemove }: ConditionBadgeProps) {
  const roundsLeft = condition.endsOnRound !== undefined
    ? condition.endsOnRound - currentRound
    : null
 
  const isExpiring = roundsLeft !== null && roundsLeft <= 1
 
  return (
    <Badge
      variant="outline"
      className={`gap-1 text-xs pr-1 ${isExpiring ? 'border-red-400 text-red-400' : ''}`}
    >
      {condition.name}
      {roundsLeft !== null && (
        <span className="opacity-60">({roundsLeft}r)</span>
      )}
      <button type="button" onClick={onRemove} className="ml-0.5 opacity-60 hover:opacity-100">
        <IconX size={10} />
      </button>
    </Badge>
  )
}
