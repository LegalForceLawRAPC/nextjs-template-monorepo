export const copyWithFormatting = (str: string) => {
  const listener: (this: Document, ev: ClipboardEvent) => any = e => {
    e.clipboardData?.setData('text/html', str)
    e.clipboardData?.setData('text/plain', str)
    e.preventDefault()
  }
  document.addEventListener('copy', listener)
  document.execCommand('copy')
  document.removeEventListener('copy', listener)
}
