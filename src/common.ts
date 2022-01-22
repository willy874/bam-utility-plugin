export interface JsonObject {
  [k: string]: JsonValue 
}

export type JsonValue = null | boolean | string | number  | JsonObject

export interface FormDataObject {
  [k: string]: FormDataValue 
}

export type FormDataValue = JsonValue | Blob | FormDataObject

export function formDataFormat(data: FormDataObject): FormData {
  const format = (obj: FormDataObject, keys: string[] = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      const formName = [...keys, key].map((k, i) => (i ? `[${k}]` : k)).join('')
      if (value instanceof Blob) {
        if (value instanceof File) {
          formData.append(formName, value , value.name)
        } else {
          formData.append(formName, value)
        }
      } else if (typeof value === 'object' && value !== null) {
        const obj = value[key] as FormDataObject
        format(obj, [...keys, key])
      } else if (value !== undefined) {
        formData.append(formName, String(value))
      }
    })
  }
  const formData = new FormData()
  format(data)
  return formData
}

export function formUrlEncodedFormat(data: JsonObject): URLSearchParams {
  const queryParams = new URLSearchParams()
  for (const key in data) {
    const value = data[key]
    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v))
    } else if (typeof value === 'object') {
      queryParams.append(key, JSON.stringify(value))
    } else {
      queryParams.append(key, String(value))
    }
  }
  return queryParams
}

 export function cloneJson(obj: unknown): JsonObject {
  return JSON.parse(JSON.stringify(obj))
}
