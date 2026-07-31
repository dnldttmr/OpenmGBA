import type { ReactNode } from 'react'
import {
  FlameIcon,
  FolderPlusIcon,
  GamepadIcon,
  GridIcon,
  PlayCircleIcon,
  PlusIcon,
} from '../icons/Icons'

interface SidebarProps {
  onPickFolder: () => void
  isScanning: boolean
}

export function Sidebar({ onPickFolder, isScanning }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-neutral-800 px-4 py-6">
      <button
        type="button"
        onClick={onPickFolder}
        disabled={isScanning}
        className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 font-mono text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <PlusIcon className="h-4 w-4" />
        {isScanning ? 'Wird gescannt…' : 'Spiel hinzufügen'}
      </button>

      <nav className="flex flex-col gap-1 font-mono text-sm">
        <SidebarItem icon={<PlayCircleIcon className="h-4 w-4" />} label="Kürzlich gespielt" disabled />
        <SidebarItem icon={<FolderPlusIcon className="h-4 w-4" />} label="Kürzlich hinzugefügt" disabled />
        <SidebarItem icon={<FlameIcon className="h-4 w-4" />} label="Meistgespielt" disabled />
        <SidebarItem icon={<GridIcon className="h-4 w-4" />} label="Alle Spiele" active />
      </nav>

      <div className="flex flex-col gap-1">
        <span className="px-3 font-mono text-xs tracking-widest text-neutral-500">PLATTFORMEN</span>
        <SidebarItem icon={<GamepadIcon className="h-4 w-4" />} label="GBA" active />
        <SidebarItem icon={<GamepadIcon className="h-4 w-4" />} label="GBC" disabled />
        <SidebarItem icon={<GamepadIcon className="h-4 w-4" />} label="Gameboy" disabled />
      </div>
    </aside>
  )
}

interface SidebarItemProps {
  icon: ReactNode
  label: string
  active?: boolean
  disabled?: boolean
}

function SidebarItem({ icon, label, active, disabled }: SidebarItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex items-center gap-2 rounded-md border-l-2 px-3 py-2 text-left transition-colors ${
        active
          ? 'border-violet-500 bg-violet-500/10 text-violet-300'
          : 'border-transparent text-neutral-400'
      } ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-neutral-900 hover:text-neutral-100'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
