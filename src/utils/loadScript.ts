export function loadScript(src) {
  const headElement = document.head || document.getElementsByTagName('head')[0]
  const $importedScript = {}

  return new Promise<void>((resolve, reject) => {
    if (src in $importedScript) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onerror = err => {
      headElement.removeChild(script)
      reject(new URIError(`The Script ${src} is no accessible.`))
    }
    script.onload = () => {
      $importedScript[src] = true
      resolve()
    }
    headElement.appendChild(script)
    script.src = src
  })
}
