import OBR from '@owlbear-rodeo/sdk'
import { useEffect, useState } from 'react'

export function useObrRole() {
  const [role, setRole] = useState<'GM' | 'PLAYER' | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    if (!OBR.isAvailable) {
      setRole('GM')
      return
    }

    OBR.onReady(async () => {
      try {
        const role = await OBR.player.getRole()
        console.log('[DM Grimoire] player role:', role)
        setRole(role)

        unsubscribe = OBR.player.onChange((player) => {
          setRole(player.role)
        })
      } catch (error) {
        console.error('[DM Grimoire] failed to resolve role', error)
      }
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return {
    role,
    isGM: role === 'GM',
    isPlayer: role === 'PLAYER',
  }
}
