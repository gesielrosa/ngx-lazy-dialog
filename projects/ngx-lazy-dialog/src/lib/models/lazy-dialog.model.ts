import {LazyDialogRef} from './lazy-dialog-ref.model';

export abstract class LazyDialog {
  public dialogRef: LazyDialogRef;

  public onParams(params: any): void {}

  public close: (output?: any) => void;
}
