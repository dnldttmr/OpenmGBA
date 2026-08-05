import { create } from 'zustand'

export type FolderPermissionState = 'granted' | 'prompt' | 'denied'

export interface LibraryFolder {
  id: string
  name: string
  handle: FileSystemDirectoryHandle | null
  permissionState: FolderPermissionState
}

interface FolderState {
  folders: LibraryFolder[]
  addFolder: (folder: LibraryFolder) => void
  removeFolder: (id: string) => void
  setFolderPermission: (id: string, permissionState: FolderPermissionState) => void
}

export const useFolderStore = create<FolderState>((set) => ({
  folders: [],
  addFolder: (folder) =>
    set((state) => ({ folders: [...state.folders, folder] })),
  removeFolder: (id) =>
    set((state) => ({ folders: state.folders.filter((folder) => folder.id !== id) })),
  setFolderPermission: (id, permissionState) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, permissionState } : folder,
      ),
    })),
}))
