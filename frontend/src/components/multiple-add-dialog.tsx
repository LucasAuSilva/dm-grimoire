import type { UseFormWatch } from "react-hook-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface MultipleAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  watch: UseFormWatch<any>
  count: string
  onCountChange: (val: string) => void
  onSubmit: () => void
}

export function MultipleAddDialog({
  open,
  onOpenChange,
  watch,
  count,
  onCountChange,
  onSubmit,
}: MultipleAddDialogProps) {
  const name = watch('name')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Multiple Monsters</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm text-muted-foreground">
            How many{' '}
            <span className="font-semibold text-foreground">
              {name || 'monsters'}
            </span>{' '}
            should join the fight? Each will get a unique adjective nickname.
          </p>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Count</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={count}
              autoFocus
              onChange={e => onCountChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSubmit()}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Preview:{' '}
            <span className="text-foreground font-mono">
              {name
                ? `${name} Ugly, ${name} Scarred...`
                : 'Goblin Ugly, Goblin Scarred...'}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Add {count} Monsters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
