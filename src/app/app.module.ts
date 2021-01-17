import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { PaymentDetailFormComponent } from "./payment-detail-form/payment-detail-form.component";
import { PaymentService } from "./payment-detail-form/services/payment.service";
import { CardLastFourDigitsPipe } from "./common/pipes/card-last-four-digits.pipe";
import { DateCardExpiryPipe } from "./common/pipes/date-card-expiry.pipe";
import { StoreModule } from "@ngrx/store";
import { reducers, metaReducers } from "./reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";

import {
  paymentDetailModelFeatureKey,
  reducer
} from "./common/store/reducer/payment-detail-model.reducer";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PaymentDetailFormComponent,
    CardLastFourDigitsPipe,
    DateCardExpiryPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatTooltipModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature(paymentDetailModelFeatureKey, reducer),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [PaymentService],
  bootstrap: [AppComponent]
})
export class AppModule {}
