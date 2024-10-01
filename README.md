# x-frontend PL

npm run dev - uruchamia serwer na porcie 3000

npm run demo-node - demo i testy w node



## X

Używanie biblioteki:

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

Tylko pierwszy parametr jest obowiązkowy.


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

Aby sprawdzić aktualny stan widgetów użyj:
```js
console.log(X.initializedWidgets)
```



## XWidget

async init(node, done)
destroy()
getStatus()
hasFinished()


### Definicja widgetu użytkownika

Stworzenie klasy na bazie XWidget.
Użytkownik powinien dodać metodę onInit i onDestroy.

#### onInit

funkcja onInit powinna opcjonalnie zwrócić listę node, które powinny być analizowane przez X jako następne. Jeżeli nie będzie zdefiniowany to domyślnie będą analizowane dzieci widgetu.

oInit może zmienić atrybuty node widgetu, wygenerować content w tym wygenerowanie dzieci z kolejnymi widgetami. Możliwe jest też podmiana siebie na jeden lub kilka innych widgetów.

Funckcja onInit może być async lub normalna.
normalna - należy wywołać this.done([...next nodes])
w przypadku błędu należy wywołać this.fail(error)
Dostęp do window przez this.window, do document przez this.document.

#### onDestroy

Funkcja onDestroy powinna posprzątać i zwrócić true jeżeli się udało usunięcie, Jeżeli nie - false.


---


### Demo

Po klikięciu na element możliwe jest jego wybranie. Szare elementy to te z atrybutem widget.

X Init - uruchamia X Init dla wybranego node

X Destroy - uruchamia Destroy dla wybranego node

User Widget Init - Done / User Widget Init - Fail — dla demo widgetów użytkownika (...-user.js) pozwala na zakończenie inicjalizacji

@ - pokazuje aktualny stan widgetów w X (pomocne gdy jakiś widget jest inicjalizowany)
