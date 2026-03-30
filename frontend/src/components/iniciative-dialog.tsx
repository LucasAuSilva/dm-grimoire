import type { Combatant } from "@/utils/types"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconPlayerSkipForward } from "@tabler/icons-react"
import { uid } from "@/utils/helpers"

interface PendingToken {
  id: string
  name: string
}

interface InitiativeDialogProps {
  tokens: PendingToken[]
  onConfirm: (combatants: Combatant[]) => void
  onClose: () => void
}

export function InitiativeDialog({ tokens, onConfirm, onClose }: InitiativeDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [initiativeInput, setInitiativeInput] = useState('')
  const [isPlayer, setIsPlayer] = useState(true)
  const [collected, setCollected] = useState<Combatant[]>([])

  useEffect(() => {
    setCurrentIndex(0)
    setInitiativeInput('')
    setIsPlayer(true)
    setCollected([])
  }, [tokens])

  const current = tokens[currentIndex]
  const isLast = currentIndex === tokens.length - 1

  const confirm = () => {
    const initiative = Number(initiativeInput)
    if (isNaN(initiative) || initiativeInput.trim() === '') return

    const newCombatant: Combatant = {
      id: uid(),
      name: current.name,
      initiative,
      ac: 0,
      maxHp: 0,
      currentHp: 0,
      conditions: [],
      isPlayer,
      isHidden: false,
    }

    const updatedCollected = [...collected, newCombatant]

    if (isLast) {
      onConfirm(updatedCollected)
    } else {
      setCollected(updatedCollected)
      setCurrentIndex(i => i + 1)
      setInitiativeInput('')
      setIsPlayer(true)
    }
  }

  if (!current) return null

  return (
    <Dialog open={tokens.length > 0} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Set Initiative</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">

          {/* Progress dots */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Token {currentIndex + 1} of {tokens.length}</span>
            <div className="flex gap-1">
              {tokens.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentIndex
                      ? 'bg-primary'
                      : i === currentIndex
                        ? 'bg-primary/60'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Token name */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="font-semibold">{current.name}</p>
            <p className="text-xs text-muted-foreground mt-1">From Owlbear Rodeo map</p>
          </div>

          {/* Player / Monster toggle */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={isPlayer ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setIsPlayer(true)}
              >
                Player
              </Button>
              <Button
                type="button"
                size="sm"
                variant={!isPlayer ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setIsPlayer(false)}
              >
                Monster
              </Button>
            </div>
          </div>

          {/* Initiative input */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs">
              What did <span className="font-semibold text-foreground">{current.name}</span> roll for initiative?
            </Label>
            <Input
              type="number"
              placeholder="e.g. 14"
              value={initiativeInput}
              autoFocus
              onChange={e => setInitiativeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirm()}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={confirm}
            disabled={isNaN(Number(initiativeInput)) || initiativeInput.trim() === ''}
            className="gap-1"
          >
            {isLast ? 'Add to Combat' : <>Next <IconPlayerSkipForward size={14} /></>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
