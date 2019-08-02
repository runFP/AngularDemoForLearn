import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RoutesModule} from './routes/routes.module';
import {HttpClientModule} from '@angular/common/http';


/* ag-Grid */
import {AgGridModule} from 'ag-grid-angular';
import 'ag-grid-enterprise';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MyOwnCustomMaterialModule} from './my-own-custom-material/my-own-custom-material-module';
import {LayoutModule} from './layout/layout.module';




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoutesModule,
    HttpClientModule,
    MyOwnCustomMaterialModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    LayoutModule,
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
