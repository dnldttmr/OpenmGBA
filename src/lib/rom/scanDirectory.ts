import { parseRomHeader } from './parseRomHeader'
import type { LibraryRom } from '../../store/libraryStore'

const ROM_EXTENSION = '.gba'

async function* walk(
  handle: FileSystemDirectoryHandle,
  path: string,
): AsyncGenerator<{ file: File; relativePath: string }> {
  for await (const entry of handle.values()) {
    const entryPath = path ? `${path}/${entry.name}` : entry.name
    if (entry.kind === 'directory') {
      yield* walk(entry, entryPath)
    } else if (entry.name.toLowerCase().endsWith(ROM_EXTENSION)) {
      const file = await entry.getFile()
      yield { file, relativePath: entryPath }
    }
  }
}

export async function scanDirectoryForRoms(
  folderId: string,
  handle: FileSystemDirectoryHandle,
): Promise<LibraryRom[]> {
  const roms: LibraryRom[] = []
  for await (const { file, relativePath } of walk(handle, '')) {
    const data = await file.arrayBuffer()
    roms.push({
      id: `${folderId}/${relativePath}`,
      folderId,
      fileName: file.name,
      relativePath,
      size: file.size,
      data,
      header: parseRomHeader(data),
    })
  }
  return roms
}
