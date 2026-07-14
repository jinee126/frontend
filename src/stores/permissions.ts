import { atom } from 'nanostores'
import type { SideSubMenu } from '@/types/mens.ts'

export const $permissions = atom<SideSubMenu[]>([])
