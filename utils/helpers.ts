type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<SnakeToCamel<U>>}` : S

export type ConvertKeysToCamelCase<T> = T extends (infer U)[]
  ? ConvertKeysToCamelCase<U>[]
  : {
      [K in keyof T as SnakeToCamel<string & K>]: T[K] extends object ? ConvertKeysToCamelCase<T[K]> : T[K]
    }

const snakeToCamel = (snakeCaseString: string): string => {
  return snakeCaseString.replace(/_./g, (match) => match.charAt(1).toUpperCase())
}

export const convertKeysToCamelCase = <T extends object>(obj: T): ConvertKeysToCamelCase<T> => {
  if (typeof obj !== "object" || obj === null) return obj as ConvertKeysToCamelCase<T>

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item)) as unknown as ConvertKeysToCamelCase<T>
  }

  const newObj: any = {}
  Object.keys(obj).forEach((key) => {
    const camelCaseKey = snakeToCamel(key)
    newObj[camelCaseKey] = convertKeysToCamelCase((obj as any)[key])
  })

  return newObj
}
