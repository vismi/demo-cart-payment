import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Observable } from "rxjs";
import { Router } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { select, Store } from '@ngrx/store';
import { PaymentDetailState } from '../common/store/reducer/payment-detail-model.reducer';
import { PaymentDetailModel } from '../common/models/payment-detail.model';
import { selectPaymentDetails } from '../common/store/selector/payment-detail-model.selectors';

import { addPaymentDetail } from '../common/store/action/payment-detail-model.actions';
import { PaymentService } from "./services/payment.service";

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-payment-detail-form',
  templateUrl: './payment-detail-form.component.html',
  styleUrls: ['./payment-detail-form.component.scss'],
  providers: [
    RxFormBuilder,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})

export class PaymentDetailFormComponent implements OnInit {

  constructor(  private formBuilder: RxFormBuilder,
    private paymentService: PaymentService,
    private store: Store<PaymentDetailState>,
    private router: Router ) {

    this.paymentDetails$ = this.store.pipe(select(selectPaymentDetails))
    console.log('this.paymentDetails$', this.paymentDetails$)
    this.paymentDetails$.forEach(savedPaymentDetail => {
      if(savedPaymentDetail.length) {
        this.storedPaymentMethods = true;
      }
    })

    this.paymentForm = this.formBuilder.formGroup(new PaymentDetailModel());
    console.log('this.paymentForm', this.paymentForm)
  }

  paymentDetails$: Observable<PaymentDetailModel[]>
  paymentForm: FormGroup;
  storedPaymentMethods : boolean = false;

  ngOnInit(): void {
    
  }

  get paymentFormControl() {
    return this.paymentForm.controls;
  }

  submitPaymentDetails() {
    console.log('dispatching!', this.paymentForm);
    let newPaymentDetail = new PaymentDetailModel();
      newPaymentDetail = this.paymentForm.value;
      this.store.dispatch(addPaymentDetail(newPaymentDetail));
      this.router.navigate(['cartSummary']);
    this.paymentService.savePaymentDetails(this.paymentForm.value).subscribe(response => {
      Swal.fire('Payment Complete!',
      'Your cart has been confirmed.',
      'success')
    }).unsubscribe();
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.paymentForm.controls.cardExpiryDate.value;
    ctrlValue.setYear(normalizedYear.year());
    this.paymentForm.controls.cardExpiryDate.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.paymentForm.controls.cardExpiryDate.value;
    ctrlValue.setMonth(normalizedMonth.month());
    this.paymentForm.controls.cardExpiryDate.setValue(ctrlValue);
    datepicker.close();
  }
}
