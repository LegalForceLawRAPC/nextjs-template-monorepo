export const ifSpreadArray = <T>(condition: boolean, data: T, elseData?: T) =>
  condition ? [data] : elseData ? [elseData] : []

export const ifSpreadObject = <T>(condition: boolean, data: T) =>
  condition ? data : {}

export const ifSpreadArrayFunc = <T>(condition: boolean, func: () => T) =>
  condition ? [func()] : []
