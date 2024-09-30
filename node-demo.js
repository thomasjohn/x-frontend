
import jsdom from "jsdom"
import X from './public/x/x.js'


// main

const test1HTML = `
  <!DOCTYPE html>
  <body>
    <!-- Test Area -->
      <div id="test_area">
        <div></div>

        <div id="root" widget="widgets/a">
          <div widget="widgets/a" id="1">
            <div></div>
            <div widget="widgets/a" id="2">
              <div widget="widgets/a" id="3"></div>
            </div>
            <div widget="widgets/a" id="4">
              <div widget="widgets/a" id="5"></div>
            </div>
          </div>
          <div></div>
          <div widget="widgets/b" id="6">
            <div widget="widgets/b" id="7"></div>
          </div>
        </div>

        <div></div>
      </div>
    <!-- / Test Area -->
  </body>
  `

const test2HTML = `
  <!DOCTYPE html>
  <body>
    <!-- Test Area -->
      <div id="test_area">
        <div></div>

        <div id="root" widget="widgets/a">
          <div widget="widgets/a" id="1">
            <div></div>
            <div widget="widgets/a" id="2">
              <div widget="widgets/a" id="3"></div>
            </div>
            <div widget="widgets/a-user" id="4">
              <div widget="widgets/a" id="5"></div>
            </div>
          </div>
          <div></div>
          <div widget="widgets/b" id="6">
            <div widget="widgets/b" id="7"></div>
          </div>
        </div>

        <div></div>
      </div>
    <!-- / Test Area -->
  </body>
  `

const { JSDOM } = jsdom
let dom

const showCurrentWidgets = () => {
  console.log('Current State:')

  const result = X.initializedWidgets
  for (const item of result)
    console.log(
      'id=' + item[0].id,
      'widget=' + item[0].getAttribute('widget'),
      item[1].status,
      '/',
      item[1].widgetInstance.status
    )
}

const XInit = (selector) =>
  X.init(dom.window.document.querySelector(selector), widgets => {
  }, dom)

const XDestroy = (selector) =>
  X.destroy(dom.window.document.querySelector(selector), (widgets, errors) => {
    console.log('Errors:', errors)
  }, dom)




// tests


// test 1
const test1 = () => {
  dom = new JSDOM(test1HTML)
  XInit("#root")

  setTimeout(() => {

    // after 1s:

    showCurrentWidgets()
    console.log('TEST .init - initializedWidgets size', X.initializedWidgets.size === 8)

    setTimeout(() => {
      XDestroy("#root")

      showCurrentWidgets()
      console.log('TEST .init - initializedWidgets size', X.initializedWidgets.size === 0)

      test2()
    }, 3000)

  }, 3000)
}


// test 2
const test2 = () => {
  dom = new JSDOM(test2HTML)
  X.reset()
  XInit("#root")

  setTimeout(() => {

    // after 1s:

    showCurrentWidgets()
    console.log('TEST .destroy - initializedWidgets size', X.initializedWidgets.size === 7)

    setTimeout(() => {
      XDestroy("#root")

      showCurrentWidgets()
      console.log('TEST .destroy - initializedWidgets size', X.initializedWidgets.size === 1)
    }, 3000)

  }, 3000)
}


// run tests

test1()