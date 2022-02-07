export function base64toBlob(base64Buf: string, type?: string): Blob {
  const arr = base64Buf.split(',')
  const mime = (() => {
    if (/^data:(\w|\/)+;base64/.test(base64Buf) && arr[0]) {
      const mineRegexp = arr[0].match(/:(.*?);/)
      return mineRegexp ? mineRegexp[1] : ''
    } else {
      return type || ''
    }
  })()
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  if (!mime) {
    throw new Error('Mime is not type.')
  }
  return new Blob([u8arr], { type: mime })
}

export async function blobToBase64(blob: Blob): Promise<string> {
  let binary = ''
  const blobText = await blob.text()
  for (let i = 0; i < blobText.length; i++) {
    binary += String.fromCharCode(blobText.charCodeAt(i) & 255)
  }
  return 'data:' + blob.type + ';base64,' + window.btoa(binary)
}
