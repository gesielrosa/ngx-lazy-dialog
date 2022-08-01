import {ComponentRef, NgModuleRef} from '@angular/core';
import {firstValueFrom, Subject, take} from 'rxjs';

import {LazyDialogComponent} from '../component';

export class LazyDialogRef<T = any> {
  private _close$ = new Subject<any>();

  get data(): T | undefined {
    return this._data;
  }

  constructor(
    private _containerComponentRef: ComponentRef<LazyDialogComponent>,
    private _moduleRef: NgModuleRef<any>,
    private _data?: T
  ) {}

  public close(output?: any): void {
    this._close$.next(output);
    this._containerComponentRef.instance
      .dismiss$()
      .pipe(take(1))
      .subscribe(() => this._destroy());
  }

  public onClose(): Promise<any> {
    return firstValueFrom(this._close$);
  }

  private _destroy(): void {
    this._containerComponentRef.destroy();
    this._moduleRef.destroy();
    this._close$.complete();
  }
}
