const HEADER_TITLE_OFFSET = 0xa0
const HEADER_TITLE_LENGTH = 12
const HEADER_GAME_CODE_OFFSET = 0xac
const HEADER_GAME_CODE_LENGTH = 4
const HEADER_MAKER_CODE_OFFSET = 0xb0
const HEADER_MAKER_CODE_LENGTH = 2
const HEADER_FIXED_VALUE_OFFSET = 0xb2
const HEADER_FIXED_VALUE = 0x96
const MIN_HEADER_SIZE = 0xc0

export interface RomHeader {
  title: string
  gameCode: string
  makerCode: string
  isValid: boolean
}

function readAsciiString(bytes: Uint8Array, offset: number, length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    const byte = bytes[offset + i]
    if (!byte) break
    result += String.fromCharCode(byte)
  }
  return result.trim()
}

// GBA header layout: https://problemkaputt.de/gbatek.htm#gbacartridgeheader
export function parseRomHeader(buffer: ArrayBuffer): RomHeader {
  const bytes = new Uint8Array(buffer)
  if (bytes.length < MIN_HEADER_SIZE) {
    return { title: '', gameCode: '', makerCode: '', isValid: false }
  }

  return {
    title: readAsciiString(bytes, HEADER_TITLE_OFFSET, HEADER_TITLE_LENGTH),
    gameCode: readAsciiString(bytes, HEADER_GAME_CODE_OFFSET, HEADER_GAME_CODE_LENGTH),
    makerCode: readAsciiString(bytes, HEADER_MAKER_CODE_OFFSET, HEADER_MAKER_CODE_LENGTH),
    isValid: bytes[HEADER_FIXED_VALUE_OFFSET] === HEADER_FIXED_VALUE,
  }
}
