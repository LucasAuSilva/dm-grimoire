import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { IconSearch } from "@tabler/icons-react"
import type { Monster } from "@/utils/types"
import { SearchMonsterCombobox } from "./search-monster-combobox"
import React from "react"

interface SearchMonsterDialogProps {
  onSelect: (monster: Monster) => void
}

export function SearchMonsterDialog({ onSelect }: SearchMonsterDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' type="button">
          <IconSearch /> Search Monster
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search for Open5e Monster</DialogTitle>
          <DialogDescription>
            Add a monster from{' '}
            <a href="https://open5e.com/" target="_blank" rel="noopener noreferrer">
              Open5e website.
            </a>
          </DialogDescription>
        </DialogHeader>
        <SearchMonsterCombobox onSelectChange={(m) => {
          onSelect(m)
          setOpen(false)
        }}
        />
      </DialogContent>
    </Dialog>
  )
}

