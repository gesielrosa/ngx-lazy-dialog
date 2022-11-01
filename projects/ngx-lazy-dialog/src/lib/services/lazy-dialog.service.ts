import {
  ApplicationRef,
  createNgModule,
  Inject,
  Injectable,
  Injector,
  NgModuleRef,
  Renderer2,
  RendererFactory2,
  Type,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {LazyDialogConfig, LazyDialogCreateConfig, LazyDialogRef, ModuleWithLazyDialog} from '../models';
import {LAZY_DIALOG_CONFIG} from '../tokens';

@Injectable()
export class LazyDialogService {
  private _renderer: Renderer2;

  public constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(LAZY_DIALOG_CONFIG) private _config: LazyDialogConfig,
    private _appRef: ApplicationRef,
    private _rendererFactory: RendererFactory2,
    private _injector: Injector
  ) {
    this._renderer = this._rendererFactory.createRenderer(null, null);
  }

  public async create<DataType = any, OutputType = any, ComponentType = any>(
    options: LazyDialogCreateConfig<DataType, ComponentType>
  ): Promise<LazyDialogRef<DataType, OutputType, ComponentType>> {
    if (!options.component && !options.module) {
      throw 'NgxLazyDialog: A module or a component must be provided';
    }

    const containerElement = this._setupContainerDiv(options?.config?.customClasses || this._config?.customClasses);
    const containerComponent = await import('../component/lazy-dialog.component');
    const containerComponentRef = this._appRef.bootstrap(containerComponent.LazyDialogComponent, containerElement);
    const dialogContainerViewRef = containerComponentRef.instance.dialogContainer;

    if (options?.config) {
      containerComponentRef.instance.config = options?.config;
    }

    const dialogRef = new LazyDialogRef<DataType, OutputType, ComponentType>(containerComponentRef, options?.data);

    containerComponentRef.instance.close = (): void => dialogRef.close();

    const injector = this._createInjector<DataType, OutputType, ComponentType>(dialogRef);

    let moduleRef: NgModuleRef<ModuleWithLazyDialog<ComponentType>> | undefined;
    let customComponent: Type<ComponentType> | undefined = options.component;

    if (options.module) {
      moduleRef = createNgModule<ModuleWithLazyDialog<ComponentType>>(options?.module!);

      customComponent = moduleRef.instance?.getDialog();
      if (!customComponent) {
        throw 'NgxLazyDialog: Dialog module not implements ModuleWithLazyDialog class';
      }

      dialogRef.setModuleRef(moduleRef);
    }

    const componentRef = dialogContainerViewRef.createComponent<ComponentType>(customComponent!, {
      injector,
      ngModuleRef: moduleRef,
    });

    dialogRef.setComponentRef(componentRef);

    return dialogRef;
  }

  private _createInjector<DataType, OutputType, ComponentType>(
    dialogRef: LazyDialogRef<DataType, OutputType, ComponentType>
  ): Injector {
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
