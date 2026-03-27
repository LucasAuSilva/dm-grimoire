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
import { CommandLoading } from 'cmdk'
import type { Monster, RequestOpen5e } from "@/utils/types"
import { useLoadingContext } from "@/context/loading-context"
import api from "@/lib/api"
import { IconChevronDown } from "@tabler/icons-react"
import { Spinner } from "./ui/spinner"
import { ScrollArea } from "./ui/scroll-area"

interface SearchMonsterCombobox {
  onSelectChange: (value: Monster) => void
}

export function SearchMonsterCombobox({ onSelectChange }: SearchMonsterCombobox) {
  const { isLoading, updateLoading } = useLoadingContext()
  const [selected, setSelected] = React.useState<Monster>()
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState<Monster[]>([])
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    updateLoading(true)
    const query = search?.toLowerCase()
    api.get<RequestOpen5e<Monster>>(
      `https://api.open5e.com/v1/monsters/?name__icontains=${query ?? ''}`,
    )
    .then(res => {
      setData(res.data.results)
    })
    updateLoading(false)
  }, [search])

  // const { data, isLoading: isGetAllCompaniesLoading } = useQuery({
  //   queryKey: ["companies", "all"],
  //   queryFn: getCompaniesAll
  // })

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
              ? selected.name
              : "Search for monster"}
            <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-100 p-0`}>
          <Command>
            <CommandInput
              placeholder="Search an monster..."
              onValueChange={(e) => {
                setSearch(e)
              }}
            />
            <CommandList
              className="scroll-auto"
            >
            <ScrollArea className="h-72">
              {isLoading
              ? (
                <CommandLoading>
                  <Spinner />
                </CommandLoading>
              ) : (
                <CommandEmpty>Not found any monsters</CommandEmpty>
              )}
                <CommandGroup >
                    {data !== undefined ? data?.map((monster) => (
                      <CommandItem
                        key={monster.slug}
                        value={monster.slug}
                        defaultValue={monster.slug}
                        keywords={[monster.name, monster.slug.toString()]}
                        onSelect={(current) => {
                          const value = data.find(d => d.slug === current)
                          if (value === undefined) return
                          setSelected(value)
                          onSelectChange(value)
                          // onChange?.(parseInt(currentValue))
                          // field.onChange(parseInt(currentValue))
                          setOpen(false)
                        }}
                      >
                        {`${monster.name} - AC: ${monster.armor_class} - HP: ${monster.hit_points} - ${monster.document__title}`}
                      </CommandItem>
                    )) : null}
                </CommandGroup>
            </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

