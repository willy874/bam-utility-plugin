export class FileName {
  readonly data: string[] = []
  readonly ext: string
  readonly name: string

  constructor(name: string) {
    const last = name.lastIndexOf('.') 
    this.ext = last >= 0 ? name.substring(last) : ''
    this.name = name.replace(this.ext, '')
    let index = 0
    let isBlack = false
    for (let i = 0; i < this.name.length; i++) {
      const str = this.name[i]
      if (i === 0) {
        index = this.data.push(str)
      } else if (/\.|-|_|\s/.test(str)) {
        isBlack = true
      } else if (isBlack) {
        isBlack = false
        index = this.data.push(str) 
      } else if (/[A-Z]/.test(str)) {
        index = this.data.push(str)
      } else {
        this.data[index - 1] += str
      }
    }
  }

  transformUpperHump(): string {
    return this.data.filter(s => s).map((s) => s[0].toUpperCase() + s.substring(1)).join('')
  }

  transformLowerHump(): string {
    return this.data.filter(s => s).map((s, i) => {
      if (i === 0) {
       return s[0].toLowerCase() + s.substring(1) 
      }
      return s[0].toUpperCase() + s.substring(1)
    }).join('')
  }

  transformKebabCase(): string {
    return this.data.join('-')
  }

  transformSnakeCase(): string {
    return this.data.join('_')
  }
}
