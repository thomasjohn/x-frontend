# x-frontend PL

npm run dev - starts the server on port 3000

npm run demo-node - demo and testing in node

The file x-one-by-one.js contains a version of X that waits for the widget to initialize before the parallel one does (no dependency) and waits for the children to initialize before returning to the parent (different order but worse performance).

Coming soon:
- better enum implementation with Proxy:
```js
export const STATUS = new Proxy({
  LOADIG: 1,
  LOADED: 2
}, {
  get(target, prop) {
    if (prop in target) {
      return target[prop]
    } else {
      throw new Error(`Property "${prop}" does not exist in STATUS`)
    }
  }
})
```


## X Class

### init

static async init(root, callback, dom, resolver)

```js
import X from '...x.js'
...
X.init(rootNode,
  (widgetsInfo => {
    console.log(widgetInfo)
  }),
  dom,
  widgetPath => {
    switch (widgetPath) {
      case 'widget/a':
        return () => class FWidget {
          ...
        }
      break
    }
  })
```

Only the first parameter is mandatory.


### destroy

static destroy(root, callback)

```js
import X from '...x.js'
...
// init X
X.destroy(rootNode, (widgetsInfo, errors) => {
  console.log(widgetsInfo, errors)
})
```

To check the current status of widgets use:
```js
console.log(X.initializedWidgets)
```



## XWidget Class

async init(node, done) - called by X to initialize the widget

destroy() - called by X to remove the widget

getStatus() - returns widget status

hasFinished() - returns true if the widget status is ok or error



### User Widget Definition

Creating a class based on XWidget.
The user should add the onInit and onDestroy methods.

#### onInit

onInit function should optionally return a list of nodes that should be analyzed by X next. If it is not defined, the widget's children will be analyzed by default.

oInit can change the node attributes of the widget, generate content, including generating children with subsequent widgets. It is also possible to replace itself with one or more other widgets.

The onInit function can be async or normal function.
For a normal function, you should call this.done([...next nodes]) after completion and in case of an error you should call this.fail(error).
Access to window via this.window, to document via this.document.

#### onDestroy

The onDestroy function should clean up and return true if the deletion was successful, otherwise false.


---


### Demo

After clicking on an element, you can select it. Gray elements are those with the widget attribute.

X Init - run X Init for selected node

X Destroy - run X Destroy for selected node

User Widget Init - Done / User Widget Init - Fail — for user widget demo (...-user.js) allows to complete initialization (correctly or with error)

@ - shows the current state of widgets in X (useful when a widget is being initialized)
