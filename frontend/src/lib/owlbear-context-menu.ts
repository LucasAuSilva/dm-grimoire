import OBR from '@owlbear-rodeo/sdk'
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
        name: item.name,
      }))

      await OBR.room.setMetadata({
        [`${PLUGIN_ID}/pending-initiative`]: pending,
      })
    },
  })
}
