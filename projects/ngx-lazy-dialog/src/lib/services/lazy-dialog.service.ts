import {
  ApplicationRef,
  createNgModuleRef,
  Inject,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
  Type,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {LazyDialogRef, ModuleWithLazyDialog} from '../models';

@Injectable()
export class LazyDialogService {
  private _renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _appRef: ApplicationRef,
    private _rendererFactory: RendererFactory2,
    private _injector: Injector
  ) {
    this._renderer = this._rendererFactory.createRenderer(null, null);
  }

  async create<T>(module: Type<ModuleWithLazyDialog<T>>, data?: any, customClass?: string): Promise<LazyDialogRef> {
    const moduleRef = createNgModuleRef(module);

    const customComponent = moduleRef.instance?.getDialog();

    if (!customComponent) {
      throw 'Dialog module not implements ModuleWithLazyDialog class';
    }

    const containerElement = this._setupContainerDiv(customClass);

    const containerComponent = await import('../component/lazy-dialog.component');

    const containerComponentRef = this._appRef.bootstrap(containerComponent.LazyDialogComponent, containerElement);

    const dialogRef = new LazyDialogRef(containerComponentRef, moduleRef, data);

    containerComponentRef.instance.close = () => dialogRef.close();

    const dialogContainerVr = containerComponentRef.instance.dialogContainer;

    const injector = this._createInjector(dialogRef);

    dialogContainerVr.createComponent<T>(customComponent, {
      injector,
      ngModuleRef: moduleRef,
    });

    return dialogRef;
  }

  private _createInjector(dialogRef: LazyDialogRef): Injector {
    return Injector.create({
      parent: this._injector,
      providers: [{provide: LazyDialogRef, useValue: dialogRef}],
    });
  }

  private _setupContainerDiv(customClass?: string): HTMLElement {
    const dialogContainer = this._renderer.createElement('div');
    this._renderer.addClass(dialogContainer, 'dialog-root');

    if (customClass) {
      this._renderer.addClass(dialogContainer, customClass);
    }

    this._renderer.appendChild(this._document.body, dialogContainer);
    return dialogContainer;
  }
}
