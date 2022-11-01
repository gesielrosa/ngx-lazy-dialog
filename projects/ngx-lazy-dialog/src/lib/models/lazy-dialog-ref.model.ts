import {ComponentRef, NgModuleRef} from '@angular/core';
import {firstValueFrom, Subject, take} from 'rxjs';

import {LazyDialogComponent} from '../component';
import {ModuleWithLazyDialog} from './module-with-lazy-dialog.model';

export class LazyDialogRef<DataType = any, OutputType = any, ComponentType = any> {
  private _close$ = new Subject<OutputType | undefined>();

  public get data(): DataType | undefined {
    return this._data;
  }

  private _moduleRef: NgModuleRef<ModuleWithLazyDialog<ComponentType>>;

  public setModuleRef(moduleRef: NgModuleRef<ModuleWithLazyDialog<ComponentType>>): void {
    this._moduleRef = moduleRef;
  }

  private _componentRef: ComponentRef<ComponentType>;

  public setComponentRef(componentRef: ComponentRef<ComponentType>): void {
    this._componentRef = componentRef;
  }

  public constructor(private _containerComponentRef: ComponentRef<LazyDialogComponent>, private _data?: DataType) {}

  public close(output?: OutputType): void {
    this._close$.next(output);
    this._containerComponentRef.instance
      .dismiss$()
      .pipe(take(1))
      .subscribe(() => this._destroy());
  }

  public onClose(): Promise<OutputType | undefined> {
    return firstValueFrom(this._close$.asObservable());
  }

  private _destroy(): void {
    this._close$.complete();
    this._containerComponentRef.destroy();
    this._moduleRef?.destroy();
    this._componentRef?.destroy();
  }
}
