import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RoutesModule} from './routes/routes.module';
import {HttpClientModule} from '@angular/common/http';




/** ag-Grid */
import {AgGridModule} from 'ag-grid-angular';
import 'ag-grid-enterprise';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from './layout/layout.module';

/** ng-zorro */
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoutesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    LayoutModule,
    IconsProviderModule,
    NgZorroAntdModule,
  ],
  entryComponents: [],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN }
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
