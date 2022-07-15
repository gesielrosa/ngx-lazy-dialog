import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LazyDialogComponent} from './component';
import {LazyDialogService} from './services';

@NgModule({
  declarations: [LazyDialogComponent],
  imports: [CommonModule],
  exports: [LazyDialogComponent],
})
export class LazyDialogModule {
  static forRoot(): ModuleWithProviders<LazyDialogModule> {
    return {
      ngModule: LazyDialogModule,
      providers: [LazyDialogService],
    };
  }
}
