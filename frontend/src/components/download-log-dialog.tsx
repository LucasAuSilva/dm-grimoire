import React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { SelectLogCombobox } from "@/components/select-log-combobox"

import type { CombatLog } from "@/utils/types"
import { downloadLog } from "@/utils/combat-utils"

import { IconDownload } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface DownlaodLogDialogProps {
  compact?: boolean
}

export function DownloadLogDialog({ compact = false }: DownlaodLogDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [logSelected, setLogSelected] = React.useState<CombatLog>()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1"
            >
              <IconDownload size={14} />
              {compact ? "" : " Download Logs"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download combat logs as .md</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an log to download</DialogTitle>
        </DialogHeader>
        <SelectLogCombobox onSelectChange={setLogSelected} />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          disabled={logSelected === undefined}
          onClick={() => {
            downloadLog(logSelected!)
            setIsOpen(false)
          }}
        >
          <IconDownload size={14} />
          Download log
        </Button>
      </DialogContent>
    </Dialog>
  )
}
