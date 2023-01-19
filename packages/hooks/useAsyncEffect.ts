import { DependencyList, useCallback, useEffect } from 'react'

export const useAsyncEffect = (
  effect: () => Promise<any>,
  deps: DependencyList = [],
  destructor?: () => void,
) => {
  const asyncFunction = useCallback(effect, deps)
  useEffect(() => {
    asyncFunction()
    return destructor
  }, [asyncFunction])
}
