import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {fromEvent, map, noop, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

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
  @ViewChild('dialogContainer', {read: ViewContainerRef}) public dialogContainer: ViewContainerRef;

  public close: () => void;

  constructor(private _el: ElementRef<HTMLElement>) {}

  public dismiss$(): Observable<void> {
    this._el.nativeElement.style.animation = 'fadeOut var(--dialog-animation-duration, 160ms)';

    return fromEvent<AnimationEvent>(this._el.nativeElement, 'animationend').pipe(
      filter((event) => event.animationName === 'fadeOut'),
      map(noop)
    );
  }
}
