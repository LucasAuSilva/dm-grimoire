import type { Combatant } from "@/utils/types"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { IconPlus, IconUsers } from "@tabler/icons-react"
import { uid } from "@/utils/helpers"
import { MultipleAddDialog } from "./multiple-add-dialog"
import { SearchMonsterDialog } from "./search-monster-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface AddFormProps {
  onAdd: (c: Combatant) => void
  onAddMultiple: (combatants: Combatant[]) => void
  compact?: boolean
}

interface CombatantFormData {
  name: string
  initiative: number
  ac: number
  maxHp: number
  isPlayer: boolean
}

const ADJECTIVES = [
  "Ugly", "Scarred", "Tiny", "Fat", "Sneaky", "Limping", "Blind",
  "One-Eyed", "Toothless", "Stinky", "Rusty", "Angry", "Cowardly",
  "Hungry", "Nervous", "Sleepy", "Grumpy", "Loud", "Smelly", "Clumsy",
  "Brave", "Lucky", "Cursed", "Ancient", "Young", "Twisted", "Scaredy",
  "Big-Nosed", "Tattooed", "Helmeted", "Barefoot", "Howling", "Silent",
]

function pickAdjectives(count: number): string[] {
  const shuffled = [...ADJECTIVES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function CombatantForm({ onAdd, onAddMultiple, compact = false }: AddFormProps) {
  const [multipleOpen, setMultipleOpen] = useState(false)
  const [multipleCount, setMultipleCount] = useState('2')

  const { register, handleSubmit, reset, watch, setValue, getValues } =
    useForm<CombatantFormData>({
      defaultValues: {
        name: '',
        initiative: undefined,
        ac: 0,
        maxHp: 0,
        isPlayer: false,
      }
    })

  const isPlayer = watch('isPlayer')

  const submit = (data: CombatantFormData) => {
    if (!data.name.trim() || !data.initiative) return
    onAdd({
      id: uid(),
      name: data.name.trim(),
      initiative: Number(data.initiative),
      ac: Number(data.ac) || 0,
      maxHp: Number(data.maxHp) || 0,
      currentHp: Number(data.maxHp) || 0,
      conditions: [],
      isPlayer: data.isPlayer,
      isHidden: false
    })
    reset()
  }

  const submitMultiple = () => {
    const data = getValues()
    if (!data.name.trim()) return
    const count = Math.max(1, Math.min(20, Number(multipleCount) || 2))
    const adjectives = pickAdjectives(count)

    const combatants: Combatant[] = adjectives.map(adj => ({
      id: uid(),
      name: `${data.name.trim()} ${adj}`,
      initiative: Number(data.initiative) || 0,
      ac: Number(data.ac) || 0,
      maxHp: Number(data.maxHp) || 0,
      currentHp: Number(data.maxHp) || 0,
      conditions: [],
      isPlayer: false,
      isHidden: false
    }))

    onAddMultiple(combatants)
    setMultipleOpen(false)
    setMultipleCount('2')
    reset()
  }

  return (
    <>
      <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/30">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Add Combatant</p>
        <form onSubmit={handleSubmit(submit)}>
          <div className="flex gap-2 flex-wrap">
            <div className="flex flex-col gap-1 flex-1 min-w-32">
              <Label className="text-xs">Name</Label>
              <Input placeholder="Goblin" {...register('name')} />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <Label className="text-xs">Initiative</Label>
              <Input type="number" placeholder="12" {...register('initiative', { valueAsNumber: true })} />
            </div>
            <div className="flex flex-col gap-1 w-16">
              <Label className="text-xs">AC</Label>
              <Input type="number" placeholder="13" {...register('ac', { valueAsNumber: true })} />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <Label className="text-xs">Max HP</Label>
              <Input type="number" placeholder="20" {...register('maxHp', { valueAsNumber: true })} />
            </div>
            <div className="flex flex-col gap-1 w-24">
              <Label className="text-xs">Type</Label>
              <Button
                type="button"
                variant={isPlayer ? 'default' : 'outline'}
                className="h-10 text-xs"
                onClick={() => setValue('isPlayer', !isPlayer)}
              >
                {isPlayer ? 'Player' : 'Monster'}
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" className="gap-1" size="sm">
                  <IconPlus size={14} />
                  {compact ? "" : " Add"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add</p>
              </TooltipContent>
            </Tooltip>
            {!isPlayer && (
              <>
                <SearchMonsterDialog
                  onSelect={(monster) => {
                    setValue('name', monster.name)
                    setValue('ac', monster.armor_class)
                    setValue('maxHp', monster.hit_points)
                  }}
                  compact
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setMultipleOpen(true)}
                >
                  <IconUsers size={14} /> Add Multiple
                </Button>
              </>
            )}
          </div>
        </form>
      </div>

      <MultipleAddDialog
        open={multipleOpen}
        onOpenChange={setMultipleOpen}
        watch={watch}
        count={multipleCount}
        onCountChange={setMultipleCount}
        onSubmit={submitMultiple}
      />
    </>
  )
}
