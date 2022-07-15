import {
  Component,
  ComponentRef,
  ElementRef,
  Injector,
  NgModuleRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {fromEvent} from 'rxjs';
import {filter} from 'rxjs/operators';

import {LazyDialog} from '../models';

@Component({
  selector: 'lazy-dialog',
  template: `
    <div class="dialog-container">
      <div aria-label="Close" class="dialog-close" (click)="close()">&times;</div>
      <ng-template #dialogContainer></ng-template>
    </div>
  `,
  styleUrls: ['./lazy-dialog.component.scss'],
})
export class LazyDialogComponent {
  @ViewChild('dialogContainer', {read: ViewContainerRef}) private _dialogContainer: ViewContainerRef;

  private _dialogComponentRef: LazyDialog;

  constructor(private _injector: Injector, private _el: ElementRef<HTMLElement>) {}

  public create<T extends LazyDialog>(component: Type<T>, ngModuleRef: NgModuleRef<any>): ComponentRef<T> {
    this._dialogContainer.clear();
    const componentRef = this._dialogContainer.createComponent<T>(component, {injector: this._injector, ngModuleRef});
    this._dialogComponentRef = componentRef.instance;
    this._dialogComponentRef.close = this.close.bind(this);
    return componentRef;
  }

  public close(output?: any): void {
    const subs = fromEvent<AnimationEvent>(this._el.nativeElement, 'animationend')
      .pipe(filter((event) => event.animationName === 'fadeOut'))
      .subscribe(() => {
        this._dialogComponentRef.dialogRef?.close(output);
        subs.unsubscribe();
      });

    this._el.nativeElement.style.animation = 'fadeOut var(--dialog-animation-duration, 160ms)';
  }
}
