export const duplicate = <T>(data: T): T => JSON.parse(JSON.stringify(data))

export const filterRepetition = <T>(
  data: T[],
  repeater: (item: T) => string | number | symbol,
): T[] =>
  Object.values(
    data.reduce(
      (acc, curr) => ({
        ...acc,
        [repeater(curr)]: curr,
      }),
      {} as Record<keyof T, T>,
    ),
  )

export const removeKeys = (obj: any, keys: string[]) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key)) return acc
    return {
      ...acc,
      [key]: value,
    }
  }, {})
