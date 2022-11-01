import {Type} from '@angular/core';

import {ModuleWithLazyDialog} from './module-with-lazy-dialog.model';
import {LazyDialogConfig} from './lazy-dialog-config.model';

export interface LazyDialogCreateConfig<DataType, ComponentType> {
  module?: Type<ModuleWithLazyDialog<ComponentType>>;
  component?: Type<ComponentType>;
  data?: DataType;
  config?: LazyDialogConfig;
}
