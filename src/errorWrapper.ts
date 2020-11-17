export function createWrapperError<T extends object>(
  wrapperType: 'DOMWrapper' | 'VueWrapper'
) {
  // why use Proxy and  diff with throw new Error(`Unable to get ${selector} within: ${this.html()}`)
  return new Proxy<T>(Object.create(null), {
    get(obj, prop) {
      switch (prop) {
        case 'exists':
          return () => false
        default:
          throw new Error(
            `Cannot call ${String(prop)} on an empty ${wrapperType}.`
          )
      }
    }
  })
}
