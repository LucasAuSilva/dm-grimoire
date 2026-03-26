import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { IconPlus } from "@tabler/icons-react"
import type { Condition } from "@/utils/types"
import { uid } from "@/utils/helpers"
import { COMMON_CONDITIONS } from "@/utils/constants"

interface AddConditionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRound: number
  onAdd: (condition: Condition) => void
}

export function AddConditionDialog({ open, onOpenChange, currentRound, onAdd }: AddConditionDialogProps) {
  const [conditionInput, setConditionInput] = useState('')
  const [conditionRounds, setConditionRounds] = useState('')

  const submit = (name: string) => {
    if (!name.trim()) return
    const endsOnRound = conditionRounds
      ? currentRound + Number(conditionRounds)
      : undefined
    onAdd({ id: uid(), name: name.trim(), endsOnRound })
    setConditionInput('')
    setConditionRounds('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Condition</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Custom condition input */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <Label className="text-xs">Condition</Label>
                <Input
                  placeholder="e.g. Poisoned"
                  value={conditionInput}
                  autoFocus
                  onChange={e => setConditionInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit(conditionInput)}
                />
              </div>
              <div className="flex flex-col gap-1 w-20">
                <Label className="text-xs">Rounds</Label>
                <Input
                  type="number"
                  placeholder="∞"
                  value={conditionRounds}
                  onChange={e => setConditionRounds(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit(conditionInput)}
                />
              </div>
            </div>
          </div>

          {/* Quick pick */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Quick pick</Label>
            <div className="flex flex-wrap gap-1">
              {COMMON_CONDITIONS.map(cond => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => submit(cond)}
                  className="text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => submit(conditionInput)} disabled={!conditionInput.trim()} className="gap-1">
            <IconPlus size={14} /> Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
