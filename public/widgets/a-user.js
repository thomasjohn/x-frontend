import XWidget from '../x/xWidget.js'

export default class WidgetAUser extends (XWidget) {
  // promise-based version of user defined run method

  #resolveByUser
  #rejectByUser

  doneHandler() {
    this.#resolveByUser()
  }

  failHandler() {
    this.#rejectByUser()
  }

  async onInit(target) {
    try {
      target.classList.remove('ok')
      target.classList.remove('failed')
      target.classList.add('initializing')
      target.appendChild(this.document.createTextNode("AUser (user action is required)"))

      // test code 2 - wait fr user:
      await new Promise((resolve, reject) => {
        this.#resolveByUser = resolve
        this.#rejectByUser = reject
      })

      target.classList.remove('initializing')
      target.classList.remove('failed')
      target.classList.add('ok')
      target.removeChild(target.lastChild)
    }
    catch (error) {
      target.classList.remove('initializing')
      target.classList.remove('ok')
      target.classList.add('failed')
      target.removeChild(target.lastChild)
      throw new Error(`Failed to run widget AUser`)
    }
  }

  onDestroy() {
    const target = this.target

    target.classList.remove('initializing')
    target.classList.remove('failed')
    target.classList.remove('ok')
    target.removeChild(target.lastChild)

    console.log("AUser destroyed")

    return true
  }
} 