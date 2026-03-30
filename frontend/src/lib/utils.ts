import type { Combatant } from "@/utils/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const sortedByIniciative = (list: Combatant[]) =>
  [...list].sort((a, b) => b.initiative - a.initiative)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
