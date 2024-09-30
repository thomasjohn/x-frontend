import XWidget from '../x/xWidget.js'

export default class WidgetA extends (XWidget) {
  async onInit(target) {
    try {
      // Widget code
      // change subtree - with html or X
      // change himself or replace him with few others (check )

      // test code:
      target.classList.remove('ok')
      target.classList.remove('failed')
      target.classList.add('initializing')

      await new Promise(resolve => setTimeout(() => {
        resolve()
      }, 100))

      target.classList.remove('initializing')
      target.classList.remove('failed')
      target.classList.add('ok')
    }
    catch (error) {
      target.classList.remove('initializing')
      target.classList.remove('ok')
      target.classList.add('failed')
      throw new Error(`Failed to run widget A`)
    }

    // example: 
    // to return same target as starting point instead of children, to avoid infinity loop attribute widget was removed
    // target.removeAttribute("widget")
    // return [target]?
  }

  onDestroy() {
    const target = this.target

    target.classList.remove('initializing')
    target.classList.remove('failed')
    target.classList.remove('ok')

    console.log("Widget/A destroyed")

    return true
  }
} 