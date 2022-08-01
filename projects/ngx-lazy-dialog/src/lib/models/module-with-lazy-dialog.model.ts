import {Type} from '@angular/core';

export abstract class ModuleWithLazyDialog<T> {
  abstract getDialog(): Type<T>;
}
