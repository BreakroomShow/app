export const isIframe = window.top !== window
export const isAdmin = process.env.REACT_APP_TARGET === 'admin'
