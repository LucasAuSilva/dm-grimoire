import OBR, { isImage, isLabel, type Image } from '@owlbear-rodeo/sdk'
import { PLUGIN_ID } from '@/utils/constants'

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${PLUGIN_ID}/add-to-initiative`,
    icons: [
      {
        icon: '/icon.svg',
        label: 'Add to Initiative',
        filter: {
          every: [{ key: 'layer', value: 'CHARACTER' }],
        },
      },
    ],
    async onClick(context) {
      const pending = context.items.map(item => ({
        id: item.id,
        name: item.text?.plainText ?? item.name,
      }))

      await OBR.room.setMetadata({
        [`${PLUGIN_ID}/pending-initiative`]: pending,
      })
    },
  })
}

export async function goToToken(name: string): Promise<boolean> {
  if (!OBR.isAvailable) return false
 
  const allItems = await OBR.scene.items.getItems()
  const characters = allItems.filter(i => i.layer === 'CHARACTER') as Image[]
  const searchName = name.toLowerCase().trim()
 
  // Match by label text first, then fall back to asset name
  const target = characters.find(item => {
    const labelText = item.text?.plainText?.toLowerCase().trim()
    const assetName = item.name.toLowerCase().trim()
    return labelText === searchName || assetName === searchName
  })
 
  if (!target) {
    console.warn(`goToToken: no token found for "${name}"`)
    return false
  }
 
  await OBR.player.select([target.id])
 
  const bounds = await OBR.scene.items.getItemBounds([target.id])
 
  const padding = 600
  await OBR.viewport.animateToBounds({
    min: { x: bounds.min.x - padding, y: bounds.min.y - padding },
    max: { x: bounds.max.x + padding, y: bounds.max.y + padding },
    width: (bounds.max.x - bounds.min.x) + padding * 2,
    height: (bounds.max.y - bounds.min.y) + padding * 2,
    center: bounds.center,
  })
 
  return true
}
