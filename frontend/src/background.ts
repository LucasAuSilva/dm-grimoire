import OBR from '@owlbear-rodeo/sdk'
import { PLUGIN_ID } from './utils/constants'
import { setupContextMenu } from './lib/owlbear'

OBR.onReady(async () => {
  // Setup context menu for ALL users persistently
  setupContextMenu()

  // Broadcast room metadata changes to keep popover in sync
  // This runs even when the popover is closed
  OBR.room.onMetadataChange((metadata) => {
    metadata[`${PLUGIN_ID}/pending-initiative`] as any[]
    // Just keeping the listener alive — popover handles the actual UI
  })
})
