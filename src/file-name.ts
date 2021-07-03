const getFile = (name: string) => {
  const file = name.split('.')
  if (file.length) {
    file.splice(file.length - 1, 1)
    return file.join('.')
  }
  return name
}
const getExt = (name: string) => {
  const file = name.split('.')
  if (file.length) {
    return file[file.length - 1]
  }
  return ''
}

/**
 * 大小寫與連接符無法混用，連接符的優先級比駝峰高
 */
export class FileName {
  data: Array<string>
  ext: string
  name: string

  constructor(name: string) {
    this.data = []
    const type: string = name.includes('.') ? 'file' : 'none'
    this.name = type === 'none' ? name : getFile(name)
    this.ext = type === 'none' ? '' : getExt(name)
    if (/[A-Z]/.test(this.name)) {
      const arrIndex: Array<number> = this.name
        .split('')
        .map((s, i) => (/[A-Z]/.test(s) ? i : 0))
        .filter((p) => p)
      arrIndex.unshift(0)
      this.data = arrIndex.map((num, index, arr) => {
        const nextIndex: number = arr[index + 1]
        if (nextIndex) {
          return this.name.substring(num, nextIndex)
        }
        return this.name.substring(num, arr.length)
      })
    } else if (/\.|-|_|\s/.test(this.name)) {
      this.data = this.name.split(/\.|-|_|\s/)
    } else {
      this.data = [this.name]
    }
  }

  ConverBigHump(): string {
    const arr: Array<string> = []
    this.data.forEach((s) => {
      if (s[0]) {
        arr.push(s[0].toUpperCase() + s.substring(1))
      }
    })
    return arr.join('')
  }

  ConverLittleHump(): string {
    const arr: Array<string> = []
    this.data.forEach((s) => {
      if (s[0]) {
        if (arr.length === 0) {
          arr.push(s.toLowerCase())
        } else {
          arr.push(s[0].toUpperCase() + s.substring(1))
        }
      }
    })
    return arr.join('')
  }
}
