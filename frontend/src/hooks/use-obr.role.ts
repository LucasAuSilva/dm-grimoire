import OBR from '@owlbear-rodeo/sdk'
import { useEffect, useState } from 'react'

export function useObrRole() {
  const [role, setRole] = useState<'GM' | 'PLAYER' | null>(null)

  useEffect(() => {
    OBR.onReady(async () => {
      const r = await OBR.player.getRole()
      setRole(r)

      return OBR.player.onChange(player => {
        setRole(player.role)
      })
    })
  }, [])

  return { role, isGM: role === 'GM', isPlayer: role === 'PLAYER' }
}
