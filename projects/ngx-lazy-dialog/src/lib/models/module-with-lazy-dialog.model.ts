import {Type} from '@angular/core';

export abstract class ModuleWithLazyDialog<T> {
  public abstract getDialog(): Type<T>;
}
