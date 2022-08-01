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

import {LazyDialogConfig, LazyDialogRef, ModuleWithLazyDialog} from '../models';
import {LAZY_DIALOG_CONFIG} from '../tokens';

@Injectable()
export class LazyDialogService {
  private _renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(LAZY_DIALOG_CONFIG) private _config: LazyDialogConfig,
    private _appRef: ApplicationRef,
    private _rendererFactory: RendererFactory2,
    private _injector: Injector
  ) {
    this._renderer = this._rendererFactory.createRenderer(null, null);
  }

  async create<ComponentType, DataType>(
    module: Type<ModuleWithLazyDialog<ComponentType>>,
    data?: DataType,
    config?: LazyDialogConfig
  ): Promise<LazyDialogRef> {
    const moduleRef = createNgModuleRef(module);

    const customComponent = moduleRef.instance?.getDialog();

    if (!customComponent) {
      throw 'Dialog module not implements ModuleWithLazyDialog class';
    }

    const containerElement = this._setupContainerDiv(config?.customClasses || this._config?.customClasses);

    const containerComponent = await import('../component/lazy-dialog.component');

    const containerComponentRef = this._appRef.bootstrap(containerComponent.LazyDialogComponent, containerElement);

    const dialogRef = new LazyDialogRef<DataType>(containerComponentRef, moduleRef, data);

    containerComponentRef.instance.close = () => dialogRef.close();

    if (config) {
      containerComponentRef.instance.config = config;
    }

    const dialogContainerVr = containerComponentRef.instance.dialogContainer;

    const injector = this._createInjector(dialogRef);

    dialogContainerVr.createComponent<ComponentType>(customComponent, {
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
