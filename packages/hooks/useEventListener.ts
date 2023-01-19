/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react'

export const useEventListener = <K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (...p: any[]) => any,
    element = typeof window === 'undefined' ? undefined : window,
) => {
    const savedHandler = useRef<any>()
    useEffect(() => {
        savedHandler.current = handler
    }, [handler])
    useEffect(() => {
        const isSupported = element && element?.addEventListener
        if (!isSupported) return
        const eventListener = (event: any) => savedHandler.current(event)
        element?.addEventListener(eventName, eventListener)
        return () => {
            element?.removeEventListener(eventName, eventListener)
        }
    }, [eventName, element])
}