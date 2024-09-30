import XWidget from '../x/xWidget.js'

export default class WidgetB extends (XWidget) {
  onInit(target) {
    target.classList.remove('ok')
    target.classList.remove('failed')
    target.classList.add('initializing')
    target.appendChild(this.document.createTextNode("B"))
    
    new Promise(resolve => setTimeout(() => {
      resolve()
    }, 100))
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

        this.fail(new Error(`Failed to run widget B`))
      })
  }

  onDestroy() {
    const target = this.target

    target.classList.remove('initializing')
    target.classList.remove('failed')
    target.classList.remove('ok')
    target.removeChild(target.lastChild)
    
    console.log("Widget/B destroyed")

    return true
  }
} 