import {ComponentRef, NgModuleRef} from '@angular/core';
import {Subject} from 'rxjs';

import {LazyDialogComponent} from '../component';
import {LazyDialog} from './lazy-dialog.model';

export class LazyDialogRef {
  private _close$ = new Subject<any>();

  constructor(
    private _containerComponentRef: ComponentRef<LazyDialogComponent>,
    private _componentRef: ComponentRef<LazyDialog>,
    private _moduleRef: NgModuleRef<any>
  ) {
    this._componentRef.instance.dialogRef = this;
  }

  public close(output?: any): void {
    this._close$.next(output);
    this.destroy$();
  }

  public onClose(): Promise<any> {
    return this._close$.toPromise();
  }

  private destroy$(): void {
    this._containerComponentRef.destroy();
    this._componentRef.destroy();
    this._moduleRef.destroy();
    this._close$.complete();
  }
}
