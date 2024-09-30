export default class X {
  static initializedWidgets = new Map()
  static window
  static document
  static #resolver
  static #modules = new Map()


  constructor(resolver) {
    X.#resolver = resolver
  }


  static async reset() {
    X.initializedWidgets = new Map()
    X.#modules = new Map()
  }


  // init

  static async init(root, callback, dom) {
    if (dom) {
      X.window = dom.window
      X.document = dom.window.document
    }
    else {
      X.window = window
      X.document = window.document
    }

    X.#initWidgets([root], root, callback)
  }


  // test if nodes are widgets
  // widget - init the widget
  // just a node - call init initChildWidgets
  static async #initWidgets(nodes, root, callback) {
    for (const node of nodes) {
      // findWidget will only test if target is a widget and return if so, if not - return null
      const widgetNode = X.#findWidgets(node, 'first-only')

      // if the target is a widget will init the widget, if not will look inside
      if (widgetNode) {
        X.#initWidget(widgetNode, root, callback) // add await
      }
      else {
        X.#initChildWidgets(node, root, callback) // add await
      }
    }
  }


  // init widgets inside parenNode
  static async #initChildWidgets(parentNode, root, callback) {
    // get widgets inside node (without recursion)
    const widgetNodes = X.#findWidgets(parentNode)

    // init all parallel widgets inside node
    for (const widgetNode of widgetNodes) {
      X.#initWidget(widgetNode, root, callback) // add await
    }
  }


  // main widget init function
  static async #initWidget(widgetNode, root, callback) {
    try {
      // test if widget already exist
      if (X.initializedWidgets.get(widgetNode)) { // widget exist
        return
      }

      //console.log('initWidget', widgetNode.id)

      // new widget

      // set status to "loading"
      X.initializedWidgets.set(widgetNode, {
        status: 'loading',
      })

      // load widget code
      const widgetInstance = await X.#loadWidget(widgetNode)

      // set state to "loaded"
      X.initializedWidgets.set(widgetNode, {
        ...X.initializedWidgets.get(widgetNode),
        widgetInstance,
        status: 'loaded'
      })

      // init widget - widget will call initChildWidgets for himself (by default) or for other nodes (importamt if the widget replace own node to one or more other)
      const toVisitNodes = await widgetInstance.init(widgetNode)

      // next nodes
      if (!toVisitNodes) {
        X.#initChildWidgets(widgetNode, root, callback) // add await
      } else {
        X.#initWidgets(toVisitNodes, root, callback) // add await
      }
    }
    catch (error) {
      // widget code not exist or error inside widget
    }

    // check if all widgets have status "ok"
    for (const widget of X.initializedWidgets) {
      if (X.#isChildNode(widget[0], root)
        && (widget[1].status === 'loading'
          || !widget[1].widgetInstance.hasFinished())) {
        return
      }
    }

    // all widget are initialized
    callback(X.initializedWidgets)
  }


  // destroy

  static destroy(root, callback) {
    const widgets = X.#findWidgets(root, 'all', false)
    const errors = new Map()

    for (let widgetNode of widgets) {
      const widget = X.initializedWidgets.get(widgetNode)

      if (widget
        && widget.widgetInstance
        && widget.status !== 'loading'
        && widget.widgetInstance.hasFinished()) {
        try {
          if (widget.widgetInstance.destroy() === true) {
            // remove from initializedWidgets after destruction
            X.initializedWidgets.delete(widgetNode)
          }
          else {
            errors.set(widgetNode, 'error')
          }
        }
        catch (error) {
          errors.set(widgetNode, error)
        }
      }
      else if (!widget) {
        // widget infor dont exists
        errors.set(widgetNode, 'not initialized')
      }
      else {
        // widget is initializing
        errors.set(widgetNode, 'initializing')
      }
    }

    callback(X.initializedWidgets, errors.size ? errors : null)
  }


  // helper

  static #isChildNode(node, parentNode) {
    return parentNode.contains(node)
  }


  static #findWidgets(root, type = 'children', topToBottom = true) {
    // type = first-only - test root node only
    // type = default - test node children only without the root node
    if (type === 'first-only') {
      if (root.hasAttribute('widget')) {
        return root
      }
      else {
        return
      }
    }

    // children - include widget nodes but do not check whats inside widget
    // all - all included root and sub-children

    const walker = X.document.createTreeWalker(
      root,
      X.window.NodeFilter.SHOW_ELEMENT,
      (node) => {
        return node.hasAttribute('widget')
          ? X.window.NodeFilter.FILTER_ACCEPT
          : X.window.NodeFilter.FILTER_SKIP
      })

    // create array with widgets
    const widgetNodes = []
    let node // = walker.nextNode()
    if (type !== 'all') {
      node = walker.nextNode()
    }
    else {
      node = walker.currentNode
    }

    while (node) {
      widgetNodes.push(node)
      if (type !== 'all') {
        node = walker.nextSibling()
      }
      else {
        node = walker.nextNode()
      }
    }

    // optionally reverse the order for destroy
    return topToBottom ? widgetNodes : widgetNodes.reverse()
  }


  // method to load widgets dynamically
  static async #loadWidget(element) {
    const widgetPath = element.getAttribute('widget')
    try {
      let module = X.#modules.get(widgetPath)
      if (!module) {
        console.log('load module for ' + widgetPath)

        if (X.#resolver)
          module = await X.#resolver(widgetPath)
        else {
          // dynamic import with default export
          module = await import(`../${widgetPath}.js`)
          X.#modules.set(widgetPath, module)
        }
      }

      return new module.default()
    }
    catch (error) {
      console.log(error)
      throw `Failed to load widget: ${widgetPath}`
    }
  }
}