import { useRef, useState } from "react"
import { Input } from "./ui/input"

// Resolves "+10", "-5", "10" relative to a base value, clamped between 0 and max
function resolveValue(input: string, base: number, min: number, max: number): number | null {
  const raw = input.trim()
  if (!raw) return null
  if (raw.startsWith('+') || raw.startsWith('-')) {
    const delta = Number(raw)
    if (isNaN(delta)) return null
    return Math.min(max, Math.max(min, base + delta))
  }
  const abs = Number(raw)
  if (isNaN(abs)) return null
  return Math.min(max, Math.max(min, abs))
}

interface EditableHpProps {
  value: number
  base: number
  min: number
  max: number
  className?: string
  onCommit: (next: number) => void
}

export function EditableField({ value, base, min, max, className = '', onCommit }: EditableHpProps) {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const open = () => {
    setInput(String(value))
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const commit = () => {
    const next = resolveValue(input, base, min, max)
    if (next !== null) onCommit(next)
    setEditing(false)
    setInput('')
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={input}
        className={`h-5 w-14 text-xs font-mono px-1 ${className}`}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
        onBlur={commit}
      />
    )
  }

  return (
    <span
      className={`font-mono font-semibold cursor-pointer select-none hover:underline hover:underline-offset-2 ${className}`}
      onClick={open}
      title="Click to edit (+10, -5, or absolute value)"
    >
      {value}
    </span>
  )
}
