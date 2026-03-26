import type { Combatant } from "@/utils/types"

import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { IconUpload, IconPlayerSkipForward } from "@tabler/icons-react"
import { uid } from "@/utils/helpers"

interface ImportedCharacter {
  name: string
  maxHp: number
  ac: number
}

interface ImportCharactersDialogProps {
  onImport: (combatants: Combatant[]) => void
}

// Parse YAML frontmatter from .md content
function parseFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const result: Record<string, any> = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (!key || !rest.length) continue
    const value = rest.join(':').trim().replace(/^["']|["']$/g, '')
    if (value && value !== 'null' && value !== '') {
      result[key.trim()] = isNaN(Number(value)) ? value : Number(value)
    }
  }
  return result
}

export function ImportCharactersDialog({ onImport }: ImportCharactersDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [characters, setCharacters] = useState<ImportedCharacter[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [initiativeInput, setInitiativeInput] = useState('')

  const handleFiles = async (files: FileList) => {
    const parsed: ImportedCharacter[] = []

    for (const file of Array.from(files)) {
      const content = await file.text()
      const fm = parseFrontmatter(content)
      const name = file.name.replace(/\.md$/i, '')
      parsed.push({
        name,
        maxHp: Number(fm.hp) || 0,
        ac: Number(fm.ac) || 0,
      })
    }

    if (parsed.length === 0) return
    setCharacters(parsed)
    setCurrentIndex(0)
    setInitiativeInput('')
    setOpen(true)
  }

  const current = characters[currentIndex]
  const isLast = currentIndex === characters.length - 1
  const collected = useRef<Combatant[]>([])

  const confirmInitiative = () => {
    if (!current) return
    const initiative = Number(initiativeInput)
    if (isNaN(initiative)) return

    collected.current.push({
      id: uid(),
      name: current.name,
      initiative,
      ac: current.ac,
      maxHp: current.maxHp,
      currentHp: current.maxHp,
      conditions: [],
      isPlayer: true,
    })

    if (isLast) {
      onImport(collected.current)
      collected.current = []
      setOpen(false)
      setCharacters([])
    } else {
      setCurrentIndex(i => i + 1)
      setInitiativeInput('')
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md"
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => fileInputRef.current?.click()}
      >
        <IconUpload size={14} /> Import Characters
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Set Initiative</DialogTitle>
          </DialogHeader>

          {current && (
            <div className="flex flex-col gap-4 py-2">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Character {currentIndex + 1} of {characters.length}</span>
                <div className="flex gap-1">
                  {characters.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < currentIndex ? 'bg-primary' : i === currentIndex ? 'bg-primary/60' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Character info */}
              <div className="rounded-lg border bg-muted/30 p-3 flex flex-col gap-1">
                <p className="font-semibold">{current.name}</p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>HP: <span className="text-foreground font-mono">{current.maxHp}</span></span>
                  <span>AC: <span className="text-foreground font-mono">{current.ac}</span></span>
                </div>
              </div>

              {/* Initiative input */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs">
                  What did <span className="text-foreground font-semibold">{current.name}</span> roll for initiative?
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 14"
                  value={initiativeInput}
                  autoFocus
                  onChange={e => setInitiativeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && confirmInitiative()}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={confirmInitiative} disabled={!initiativeInput} className="gap-1">
              {isLast ? 'Add to Combat' : <>Next <IconPlayerSkipForward size={14} /></>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
