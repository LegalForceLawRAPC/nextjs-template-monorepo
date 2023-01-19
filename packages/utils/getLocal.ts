export const getLocal = <T = any>(key: string): null | T => {
  try {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(key)
    return data ? (JSON.parse(data) as T) : null
  } catch (error) {
    return null
  }
}
