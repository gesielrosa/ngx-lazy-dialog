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

import {LazyDialog, LazyDialogRef, ModuleWithLazyDialog} from '../models';

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

  async create<T extends LazyDialog>(
    module: Type<ModuleWithLazyDialog<T>>,
    params?: any,
    customClass?: string
  ): Promise<LazyDialogRef> {
    // fix "ApplicationRef.tick() is called recursively" error
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 50));

    const container = this._setupContainerDiv(customClass);

    const dialogComponentContainer = await import('../component/lazy-dialog.component');

    const containerRef = this._appRef.bootstrap(dialogComponentContainer.LazyDialogComponent, container);

    const moduleRef = createNgModuleRef(module, this._injector);

    const component = moduleRef.instance?.getDialog();

    if (!component) {
      throw 'Dialog module not extends or implements ModuleWithLazyDialog class';
    }

    const componentRef = containerRef.instance.create<T>(component, moduleRef);

    if (params) {
      componentRef.instance.onParams(params);
    }

    return new LazyDialogRef(containerRef, componentRef, moduleRef);
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
