export const valueString = function (value: Array<unknown> | unknown, type = 'json'): string {
  switch (true) {
    case value === undefined:
      return 'undefined'
    case value === null:
      return 'null'
    case value === 0:
      return '0'
    case value === '':
      return "''"
    case isNaN(Number(value)):
      return 'NaN'
    case typeof value === 'string':
      return `'${value}'`
    case typeof value === 'function':
      return (value + '').replace(/\\{2}?/g, '')
    case typeof value === 'object' && !Array.isArray(value):
      if (value instanceof Array) {
        return type === 'sql' && value instanceof Array
          ? `[${value.map((v: unknown) => valueString(v)).join(',')}]`
          : `(${value.map((v: unknown) => valueString(v)).join(',')})`
      }
      return JSON.stringify(value).replace(/\\{2}?/g, '')
    default:
      return value + ''
  }
}
