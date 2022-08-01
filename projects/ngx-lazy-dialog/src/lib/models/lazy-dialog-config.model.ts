export interface LazyDialogGlobalConfig {
  closeOnBackdropClick?: boolean;
  closeButton?: boolean;
}

export interface LazyDialogConfig extends LazyDialogGlobalConfig {
  customClasses?: string;
}
