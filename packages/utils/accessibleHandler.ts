export function filterKeyEnter(handler: any) {
  return (e: any) => {
    if (e.keyCode === 13) {
      handler(e)
    }
  }
}

export function accessibleOnClick(handler: any) {
  return {
    role: 'button',
    tabIndex: 0,
    onKeyDown: filterKeyEnter(handler),
    onClick: handler,
  }
}
