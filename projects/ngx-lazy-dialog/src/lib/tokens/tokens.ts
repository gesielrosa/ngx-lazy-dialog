import {InjectionToken} from '@angular/core';

import {LazyDialogConfig} from '../models';

export const LAZY_DIALOG_CONFIG = new InjectionToken<LazyDialogConfig>('Lazy dialog config token');
