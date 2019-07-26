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
import {CustomStepperComponent} from './app-custom-stepper/custom-stepper.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {OverlayModule} from '@angular/cdk/overlay';
import {OverlayPanelComponent} from './overlay-panel/overlay-panel.component';
import {CdkOverlayComponent} from './cdk-overlay/cdk-overlay.component';
import {LayoutModule} from './layout/layout.module';


const cdcMoudle = [CdkStepperModule, OverlayModule];

@NgModule({
  declarations: [
    AppComponent,
    CustomStepperComponent,
    OverlayPanelComponent,
    CdkOverlayComponent
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
    ...cdcMoudle,
  ],
  entryComponents: [OverlayPanelComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
