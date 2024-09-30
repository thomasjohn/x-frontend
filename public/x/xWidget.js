import X from './x.js'


export default class XWidget {
  target
  status = 'new' // new | initializing | error | ok
  window = X.window
  document = X.document
  #resolveByCallback
  #rejectByCallback

  constructor() {
    // auto-bind handlers that end with 'Handler' to the instance
    const prototype = Object.getPrototypeOf(this)
    Object.getOwnPropertyNames(prototype).forEach((key) => {
      if (typeof this[key] === 'function' && key.endsWith('Handler')) {
        this[key] = this[key].bind(this)
      }
    })
  }


  // helper methods for not async onInit user method

  done(toVisitNodes) {
    this.#resolveByCallback?.(toVisitNodes)
  }

  fail(error) {
    this.#rejectByCallback?.(error)
  }


  // init 

  async init(node, done) {
    try {
      this.status = 'initializing'
      this.target = node

      // common async code for all widgets (part of X)...

      console.log(`Initializing widget on ${node}...`)

      // run widget code

      let toVisitNodes = this.onInit(node)
      if (toVisitNodes instanceof Promise) {
        await toVisitNodes
      }
      else {
        toVisitNodes = await new Promise((resolve, reject) => {
          this.#resolveByCallback = resolve
          this.#rejectByCallback = reject
        })
      }

      // done
      this.status = 'ok'

      done?.(toVisitNodes)
      return toVisitNodes
    }
    catch (error) {
      this.status = 'error'

      console.log("XWidget Init error:", error)
      throw error
    }
  }

  async onInit() {
    console.warn('default onInit method')
  }


  // finish

  getStatus() {
    return this.status
  }


  hasFinished() {
    if (this.status === 'new'
      || this.status == 'initializing') {
      return false
    }
    return true
  }


  // destroy

  destroy() {
    console.log(`Destroying widget...`)

    if (this.status === "new" || this.status === 'initializing') {
      return false
    }

    // common code for all widgets...

    try {
      return this.onDestroy()
    }
    catch (error) {
      console.log("XWidget Destroy error:", error)
      throw error
    }
  }

  onDestroy() {
    console.warn('default onDestroy method')
  }
}