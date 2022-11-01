import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ModuleWithLazyDialog} from '../../../../../ngx-lazy-dialog/src/lib';

import {AlertComponent} from './alert.component';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, FormsModule],
})
export class AlertModule implements ModuleWithLazyDialog<AlertComponent> {
  public getDialog(): Type<AlertComponent> {
    return AlertComponent;
  }
}
