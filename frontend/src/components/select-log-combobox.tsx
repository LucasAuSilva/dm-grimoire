"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { CombatLog } from "@/utils/types"
import { getSavedLogs } from "@/hooks/combat-log"
import { IconChevronDown } from "@tabler/icons-react"

interface SelectLogComboboxProps {
  onSelectChange: (log: CombatLog) => void
  compact?: boolean
}

export function SelectLogCombobox({ onSelectChange, compact = false }: SelectLogComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState<CombatLog[]>()
  const [selected, setSelected] = React.useState<CombatLog>()

  React.useEffect(() => {
    const logs = getSavedLogs()
    setData(logs)
  }, [])

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between truncate"
          >
            {selected
              ? new Date(selected.startedAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })
              : "Select an log"}
            <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-[400px] p-0`}>
          <Command>
            <CommandInput placeholder="Procure a empresa..." />
            <CommandList
            >
              <CommandEmpty>There is no combat logs yet</CommandEmpty>
              <CommandGroup>
                {data?.map((log) => (
                  <CommandItem
                    key={log.startedAt}
                    value={log.startedAt.toString()}
                    defaultValue={log.startedAt}
                    keywords={[log.startedAt]}
                    onSelect={(currentValue) => {
                      const log = data.find(l => l.startedAt === currentValue)
                      if (log === undefined) return
                      onSelectChange(log)
                      setSelected(log)
                      setOpen(false)
                    }}
                  >
                    {new Date(log.startedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
