import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxFroggerModule} from '../../projects/ngx-frogger/src/lib/ngx-frogger.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxFroggerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
