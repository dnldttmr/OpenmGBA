import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useLibraryStore } from '../../store/libraryStore'
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
  const hasRoms = useLibraryStore((state) => state.roms.length > 0)

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
        <SidebarItem icon={<GridIcon className="h-4 w-4" />} label="Alle Spiele" to="/" end />
      </nav>

      <div className="flex flex-col gap-1">
        <span className="px-3 font-mono text-xs tracking-widest text-neutral-500">PLATTFORMEN</span>
        <SidebarItem
          icon={<GamepadIcon className="h-4 w-4" />}
          label="GBA"
          to="/game-boy-advance"
          disabled={!hasRoms}
        />
        <SidebarItem icon={<GamepadIcon className="h-4 w-4" />} label="GBC" disabled />
        <SidebarItem icon={<GamepadIcon className="h-4 w-4" />} label="Gameboy" disabled />
      </div>
    </aside>
  )
}

interface SidebarItemProps {
  icon: ReactNode
  label: string
  to?: string
  end?: boolean
  disabled?: boolean
}

function SidebarItem({ icon, label, to, end, disabled }: SidebarItemProps) {
  const baseClasses =
    'flex items-center gap-2 rounded-md border-l-2 px-3 py-2 text-left transition-colors'

  if (to && !disabled) {
    return (
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `${baseClasses} ${
            isActive
              ? 'border-violet-500 bg-violet-500/10 text-violet-300'
              : 'border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    )
  }

  return (
    <button
      type="button"
      disabled
      className={`${baseClasses} cursor-not-allowed border-transparent text-neutral-400 opacity-40`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
