import {Component, ElementRef, Inject, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {fromEvent, map, noop, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

import {LAZY_DIALOG_CONFIG} from '../tokens';
import {LazyDialogConfig, LazyDialogGlobalConfig} from '../models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lazy-dialog',
  template: `
    <div class="lazy-dialog-container">
      <div aria-label="Close" class="lazy-dialog-close" *ngIf="shouldShowClose" (click)="close()">&times;</div>
      <ng-template #dialogContainer></ng-template>
    </div>
    <div class="lazy-dialog-backdrop" (click)="onClickBackdrop()"></div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class LazyDialogComponent {
  @ViewChild('dialogContainer', {read: ViewContainerRef}) public dialogContainer: ViewContainerRef;

  public config: LazyDialogConfig;

  public close: () => void;

  public get shouldCloseOnClackDropClick(): boolean {
    return this.config && 'closeOnBackdropClick' in this.config
      ? this.config.closeOnBackdropClick!
      : this._globalConfig && 'closeOnBackdropClick' in this._globalConfig
      ? this._globalConfig.closeOnBackdropClick!
      : true;
  }

  public get shouldShowClose(): boolean {
    return this.config && 'closeButton' in this.config
      ? this.config.closeButton!
      : this._globalConfig && 'closeButton' in this._globalConfig
      ? this._globalConfig.closeButton!
      : true;
  }

  public constructor(
    @Inject(LAZY_DIALOG_CONFIG) private _globalConfig: LazyDialogGlobalConfig,
    private _el: ElementRef<HTMLElement>
  ) {}

  public dismiss$(): Observable<void> {
    this._el.nativeElement.style.animation = 'lazyDialogFadeOut var(--dialog-animation-duration, 160ms)';

    return fromEvent<AnimationEvent>(this._el.nativeElement, 'animationend').pipe(
      filter((event) => event.animationName === 'lazyDialogFadeOut'),
      map(noop)
    );
  }

  public onClickBackdrop(): void {
    if (this.shouldCloseOnClackDropClick) {
      this.close();
    }
  }
}
