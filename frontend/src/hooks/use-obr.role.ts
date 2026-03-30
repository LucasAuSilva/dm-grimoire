import OBR from '@owlbear-rodeo/sdk'
import { useEffect, useState } from 'react'

export function useObrRole() {
  const [role, setRole] = useState<'GM' | 'PLAYER' | null>(null)

  useEffect(() => {
    if (!OBR.isAvailable) {
      // Not in Owlbear — treat as GM so the full UI shows
      setRole('GM')
      return
    }

    OBR.onReady(async () => {
      const r = await OBR.player.getRole()
      setRole(r)

      // Also subscribe to role changes (e.g. GM hands off to someone else)
      return OBR.player.onChange(player => {
        setRole(player.role)
      })
    })
  }, [])

  return {
    role,
    isGM: role === 'GM',
    isPlayer: role === 'PLAYER',
  }
}
