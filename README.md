# Ngx Lazy Dialog

[![npm version](https://badge.fury.io/js/ngx-lazy-dialog.svg)](https://www.npmjs.com/package/ngx-lazy-dialog)


This library allows you to create lazy loading dialogs without the need for root app
dependency injections. Each dialog is completely independent of the rest of the application.

The dialog is fully customizable!

**Standalone components are supported now!**

| Version | Angular Version |
|---------|-----------------|
| 3.x.x   | 15.x.x          |
| 2.x.x   | 14.x.x          |
| 1.x.x   | 13.x.x          |

---

## Table of Contents

- [Installation](#installation)
- [How to use](#how-to-use)
  * [Module tutorial](#module-tutorial)
  * [Standalone tutorial](#standalone-tutorial)
  * [Customizing the container and backdrop](#customizing-the-container-and-backdrop)
- [Breaking Changes](#breaking-changes)
  * [3.0.0 (2022-12-08)](#200--2022-12-08-)
  * [2.0.0 (2022-11-01)](#200--2022-11-01-)
  * [1.0.0 (2022-08-01)](#100--2022-08-01-)

---

## Installation

The ngx-lazy-dialog can be installed with npm:

`npm i ngx-lazy-dialog --save`

Import `LazyDialogModule` in your app root module like `app.module.ts`:

```ts
// ...
import { LazyDialogModule } from 'ngx-lazy-dialog';
// ...
@NgModule({
  // ...
  imports: [
    LazyDialogModule.forRoot({ 
      closeOnBackdropClick: true,
      closeButton: true,
    })
  ],
  // ...
})
export class AppModule {}
```
Import styles to `styles.scss` of your project:

```scss
@import 'node_modules/ngx-lazy-dialog/styles/ngx-lazy-dialog.scss';
```
---

## How to use

### Module tutorial

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

We need to modify the `alert.component.ts` file if you want to call close function or receive data in the dialog:

```ts
// ...
import { LazyDialogRef } from 'ngx-lazy-dialog';
// ...
export class AlertComponent implements OnInit {
  public myData: any
  
  constructor(private _dialogRef: LazyDialogRef) {
  }
  
  ngOnInit() {
    // getting data
    this.myData = this._dialogRef.data;
  }
  
  close(data?: any) {
    // closing dialog
    this._dialogRef.close(data);
  }
}
```

After, we are going to modify `alert.module.ts`:

```ts
// ...
import { ModuleWithLazyDialog } from 'ngx-lazy-dialog';
// ...
export class AlertModule implements ModuleWithLazyDialog<AlertComponent> {
  // Implementing 'getDialog' to return module bootstrap component
  getDialog() {
    return AlertComponent;
  }
}
```

In `alert.component.html` file, we can add a simple template as example:

```angular2html
<p>Alert dialog</p>
<button (click)="close()">Close</button>
<button (click)="close({bar: 'foo'})">Close with output data</button>
```

It's done. Now we are going to open the dialog in another component from our app:

```ts
// ...
import { LazyDialogService } from 'ngx-lazy-dialog';
// ...
constructor(private _service: LazyDialogService) {
}
// ...
async openDialog() {
  const module = await import('./dialogs/alert/alert.module').then(m => m.AlertModule);
  this._service.create({module});
}
//...
```

You can try to add data and config to dialog creation or get a callback data:

```ts
// ...
async openDialog(): Promise<void> {
  const module = await import('./dialogs/alert/alert.module').then(m => m.AlertModule);
  
  const data = {
    foo: 'bar'
  };

  const config: LazyDialogConfig = {
    closeOnBackdropClick: false,
    closeButton: false,
    customClasses: 'my-custom-class',
  };

  const dialog = await this._service.create({module, data, config});
  dialog.onClose().then((output) => {
    console.log(output);
  });
}
// ...
```

### Standalone tutorial

Generate a standalone dialog component using Angular CLI:

```
ng g component --standalone dialogs/alert
```

After generating dialog and module, the folder structure should be like this:

```
app   
└───dialogs
│   │   alert
│   │   │   alert.component.html
│   │   │   alert.component.scss
│   │   │   alert.component.ts
```

We need to modify the `alert.component.ts` file if you want to call close function or receive data in the dialog:

```ts
// ...
import { LazyDialogRef } from 'ngx-lazy-dialog';
// ...
@Component({
  // ...
  standalone: true
})
export class AlertComponent implements OnInit {
  public myData: any
  
  constructor(private _dialogRef: LazyDialogRef) {
  }
  
  ngOnInit() {
    // getting data
    this.myData = this._dialogRef.data;
  }
  
  close(data?: any) {
    // closing dialog
    this._dialogRef.close(data);
  }
}
```
In `alert.component.html` file, we can add a simple template as example:

```angular2html
<p>Alert dialog</p>
<button (click)="close()">Close</button>
<button (click)="close({bar: 'foo'})">Close with output data</button>
```

It's done. Now we are going to open the dialog in another component from our app:

```ts
// ...
import { LazyDialogService } from 'ngx-lazy-dialog';
// ...
constructor(private _service: LazyDialogService) {
}
// ...
async openDialog() {
  const component = await import('./dialogs/alert/alert.component').then(m => m.AlertComponent);
  this._service.create({component});
}
//...
```

You can try to add data and config to dialog creation or get a callback data:

```ts
// ...
async openDialog() {
  const component = await import('./dialogs/alert/alert.component').then(m => m.AlertComponent);
  
  const data = {
    foo: 'bar'
  };

  const config: LazyDialogConfig = {
    closeOnBackdropClick: false,
    closeButton: false,
    customClasses: 'my-custom-class',
  };

  const dialog = await this._service.create({component, data, config});
  dialog.onClose().then((output) => {
    console.log(output);
  });
}
// ...
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
this.service.create({component, data, config: {customClasses: 'custom-dialog'}});
```

---

## Breaking Changes

### 3.0.0 (2022-12-08)

- Need to import new `ngx-lazy-dialog.scss` file to your app global style file (like styles.scss)

### 2.0.0 (2022-11-01)

- New argument type to the `create` function on `LazyDialogService`. Now you need to pass only one object: `LazyDialogCreateConfig`.

### 1.0.0 (2022-08-01)

- Dialog Ref by DI (It is no longer necessary to extend the Lazy Dialog class)
- Custom classes on config

---
