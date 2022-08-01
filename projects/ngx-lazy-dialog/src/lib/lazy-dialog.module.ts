import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LazyDialogComponent} from './component';
import {LazyDialogService} from './services';
import {LAZY_DIALOG_CONFIG} from './tokens';
import {LazyDialogGlobalConfig} from './models';

@NgModule({
  declarations: [LazyDialogComponent],
  imports: [CommonModule],
  exports: [LazyDialogComponent],
})
export class LazyDialogModule {
  static forRoot(config?: LazyDialogGlobalConfig): ModuleWithProviders<LazyDialogModule> {
    return {
      ngModule: LazyDialogModule,
      providers: [
        LazyDialogService,
        {
          provide: LAZY_DIALOG_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
