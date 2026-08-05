import { createStore, del, entries, set } from 'idb-keyval'

export interface StoredFolder {
  id: string
  name: string
  handle: FileSystemDirectoryHandle
}

const folderHandleStore = createStore('openmgba-folders', 'handles')

export async function saveFolderHandle(
  id: string,
  name: string,
  handle: FileSystemDirectoryHandle,
): Promise<void> {
  await set(id, { id, name, handle }, folderHandleStore)
}

export async function deleteFolderHandle(id: string): Promise<void> {
  await del(id, folderHandleStore)
}

export async function loadStoredFolders(): Promise<StoredFolder[]> {
  const stored = await entries<string, StoredFolder>(folderHandleStore)
  return stored.map(([, value]) => value)
}
