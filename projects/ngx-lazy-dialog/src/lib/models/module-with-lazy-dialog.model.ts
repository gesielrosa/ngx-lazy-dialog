import {Type} from '@angular/core';

import {LazyDialog} from './lazy-dialog.model';

export abstract class ModuleWithLazyDialog<T extends LazyDialog> {
  abstract getDialog(): Type<T>;
}
