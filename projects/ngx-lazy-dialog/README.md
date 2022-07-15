# Ngx Lazy Dialog

[![npm version](https://badge.fury.io/js/ngx-lazy-dialog.svg)](https://www.npmjs.com/package/ngx-lazy-dialog)


This library allows you to create lazy loading dialogs without the need for root app
dependency injections. Each dialog is completely independent of the rest of the application.

The dialog is fully customizable!

Angular version `>=13.0.0`

---

### Installation

The ngx-lazy-dialog can be installed with npm:

`npm i ngx-lazy-dialog --save`

---

### How to use (a simple approach tutorial)

To start, import `LazyDialogModule` in your app root module like `app.module.ts`:

```ts
...
import { LazyDialogModule } from 'ngx-lazy-dialog';
...
@NgModule({
  ...
  imports: [
    LazyDialogModule.forRoot()
  ],
  ...
})
export class AppModule {}
```

Each dialog component should have your own module, so generate a dialog component and module using Angular CLI:

```
ng g module dialogs/alert

ng g component dialogs/alert
```

After generating dialog and module, the folder structure should be like this:

```
app   
└───dialogs
│   │   alert
│   │   │   alert.component.html
│   │   │   alert.component.scss
│   │   │   alert.component.ts
│   │   │   alert.module.ts
```

We need to modify the `alert.component.ts` file, extending `LazyDialog`
class and implementing params function to receive params on dialog:

```ts
...
import { LazyDialog } from 'ngx-lazy-dialog'; // Importing
...
export class AlertComponent extends LazyDialog { // Extending class
  constructor() {
    super(); // Adding super to constructor
  }
  
  // Implementing 'onParams' to receive params on dialog
  onParams(params: any): void {
    console.log(params); // receiving parameters
  }
}
```

After, we are going to modify `alert.module.ts`:

```ts
...
import { ModuleWithLazyDialog } from 'ngx-lazy-dialog'; // Importing
...
export class AlertModule implements ModuleWithLazyDialog<AlertComponent> { // Implementing class
  // Implementing 'getDialog' to return module bootstrap component
  getDialog() {
    return AlertComponent;
  }
}
```

In `alert.component.html` file, we can add a simple template as example:

```angular2html
<p>alert works!</p>
<button (click)="close()">Close</button>
<button (click)="close({bar: 'foo'})">Close with callback params</button>
```

It's done. Now we are going to open the dialog in another component from our app:

```ts
...
import { LazyDialogService } from 'ngx-lazy-dialog'; // Importing service
...
constructor(private _service: LazyDialogService) { // Injecting on constructor
}
...
// A function to create dialog
async openDialog(): Promise<void> {
  const module = await import('./dialogs/alert/alert.module').then(m => m.AlertModule);
  this._service.create(module);
}
...
```

You can try to add a params to dialog creation or get a callback params:

```ts
...
async openDialog(): Promise<void> {
  const module = await import('./dialogs/alert/alert.module').then(m => m.AlertModule);
  const params = {
    foo: 'bar'
  };

  const dialog = await this._service.create(module, params);
  dialog.onClose().then(callbackParams => {
    console.log(callbackParams);
  });
}
...
```

---

### Customizing the container and backdrop

You can customize the dialog container and backdrop using CSS variables. See the list of variables and their default
values below:

| Var | Default                                                                      | Description                |
| ----------- |------------------------------------------------------------------------------|----------------------------|
| --dialog-backdrop-bg | rgba(0, 0, 0, 0.25)                                                          | Backdrop color             |
| --dialog-bg | #FFFFFF                                                                      | Container background color |
| --dialog-padding | 24px                                                                         | Container padding          |
| --dialog-border-radius | 8px                                                                          | Container border radius    |
| --dialog-shadow | rgba(9, 30, 66, 0.25) 0 4px 8px -2px, <br>  rgba(9, 30, 66, 0.08) 0 0 0 1px) | Container box shadow       |
| --dialog-max-width | 90vw                                                                         | Max container width        |
| --dialog-max-height | 90vh                                                                         | Max container height       |
| --dialog-min-width | 200px                                                                        | Min container width        |
| --dialog-min-height | 100px                                                                        | Min container height       |
| --dialog-z-index | 1001                                                                         | Z-index                    |
| --dialog-close-color | #000000                                                                      | Close icon color           |
| --dialog-close-size | 24px                                                                         | Close icon size            |
| --dialog-close-position | 24px                                                                         | Close icon position        |
| --dialog-animation-duration | 160ms                                                                        | Animation duration         |

Example:

Add custom css vars to your app global style file (like styles.scss):

``` css
:root {
  --dialog-bg: #E7EAEF;
  --dialog-close-color: #123661;
}
```

Or create a css class and add to dialog creation:

``` css
.custom-dialog {
  --dialog-bg: #E7EAEF;
  --dialog-close-color: #123661;
}
```

```ts
this.service.create(component, params, 'custom-dialog')
```
