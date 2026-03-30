import OBR from '@owlbear-rodeo/sdk'
import { useEffect, useState } from 'react'

export function useObrRole() {
  const [role, setRole] = useState<'GM' | 'PLAYER' | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setup = async () => {
      try {
        const role = await OBR.player.getRole()
        setRole(role)

        unsubscribe = OBR.player.onChange((player) => {
          setRole(player.role)
        })
      } catch (error) {
        console.error('[DM Grimoire] failed to resolve role', error)
      }
    }

    if (!OBR.isAvailable) {
      setRole('GM')
      return
    }

    if (OBR.isReady) {
      void setup()
    } else {
      OBR.onReady(() => {
        void setup()
      })
    }

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
