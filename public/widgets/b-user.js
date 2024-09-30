import XWidget from '../x/xWidget.js'

export default class WidgetBUser extends (XWidget) {
  // promise-based version of user defined run method

  #resolveByUser
  #rejectByUser

  doneHandler() {
    this.#resolveByUser()
  }

  failHandler() {
    this.#rejectByUser()
  }

  onInit(target) {
    target.classList.remove('ok')
    target.classList.remove('failed')
    target.classList.add('initializing')
    target.appendChild(this.document.createTextNode("BUser (user action is required)"))

    // test code 2 - wait fr user:
    new Promise((resolve, reject) => {
      this.#resolveByUser = resolve
      this.#rejectByUser = reject
    })
      .then(() => {
        target.classList.remove('initializing')
        target.classList.remove('failed')
        target.classList.add('ok')

        this.done()
      })
      .catch(error => {
        target.classList.remove('initializing')
        target.classList.remove('ok')
        target.classList.add('failed')
        target.removeChild(target.lastChild)

        this.fail(new Error(`Failed to run widget BUser`))
      })
  }

  onDestroy() {
    const target = this.target

    target.classList.remove('initializing')
    target.classList.remove('failed')
    target.classList.remove('ok')
    target.removeChild(target.lastChild)

    console.log("BUser destroyed")

    return true
  }
} 