import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {LazyDialogModule} from '../../../ngx-lazy-dialog/src/lib/';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, LazyDialogModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
