import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleWithLazyDialog} from '../../../../../ngx-lazy-dialog/src/lib';

import {AlertComponent} from './alert.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, FormsModule],
})
export class AlertModule implements ModuleWithLazyDialog<AlertComponent> {
  getDialog(): Type<AlertComponent> {
    return AlertComponent;
  }
}
