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
    const type = name.includes('.') ? 'file' : 'none'
    this.name = type === 'none' ? name : getFile(name)
    this.ext = type === 'none' ? '' : getExt(name)
    if (/[A-Z]/.test(this.name)) {
      const arr = this.name.split('')
      arr.forEach((s, i) => {
        if (/[A-Z]/.test(s)) {
          arr[i] = '-' + s.toLowerCase()
        }
        this.data = arr
          .join('')
          .split('-')
          .filter((p) => p)
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
