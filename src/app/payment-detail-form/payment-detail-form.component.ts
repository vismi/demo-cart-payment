import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { RxFormBuilder } from "@rxweb/reactive-form-validators";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Moment } from "moment";

import Swal from "sweetalert2";
import { select, Store } from "@ngrx/store";
import { PaymentDetailState } from "../common/store/reducer/payment-detail-model.reducer";
import { PaymentDetailModel } from "../common/models/payment-detail.model";
import { selectPaymentDetails } from "../common/store/selector/payment-detail-model.selectors";

import { addPaymentDetail } from "../common/store/action/payment-detail-model.actions";
import { PaymentService } from "./services/payment.service";

export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY"
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: "app-payment-detail-form",
  templateUrl: "./payment-detail-form.component.html",
  styleUrls: ["./payment-detail-form.component.scss"],
  providers: [
    RxFormBuilder,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class PaymentDetailFormComponent implements OnInit {
  constructor(
    private formBuilder: RxFormBuilder,
    private paymentService: PaymentService,
    private store: Store<PaymentDetailState>,
    private router: Router
  ) {
    this.paymentDetails$ = this.store.pipe(select(selectPaymentDetails));
    this.paymentDetails$.forEach(savedPaymentDetail => {
      if (savedPaymentDetail.length) {
        this.storedPaymentMethods = true;
        this.savedTransactions = savedPaymentDetail;
      }
    });

    this.paymentForm = this.formBuilder.formGroup(new PaymentDetailModel());
  }

  paymentDetails$: Observable<PaymentDetailModel[]>;
  paymentForm: FormGroup;
  storedPaymentMethods: boolean = false;
  availableCurrencies: Array<string> = ["INR", "GBP", "USD"];
  transactionNumber: number;
  savedTransactions: Array<PaymentDetailModel>;
  duplicatePaymentUsed: boolean = false;
  amountToPay: any = {
    price: 2000,
    currency: "GBP"
  };

  ngOnInit(): void {
    this.transactionNumber = this.paymentService.getMockTransactionNumber();
  }

  get paymentFormControl() {
    return this.paymentForm.controls;
  }

  submitPaymentDetails() {
    if (
      this.paymentForm.valid &&
      this.paymentForm.value.amountToPay === this.amountToPay.price
    ) {
      // Store card in state only if not already saved
      if (this.savedTransactions && !this.duplicatePaymentUsed) {
        this.savedTransactions.forEach(savedPaymentDetail => {
          if (
            this.paymentForm.value.cardNumber ===
              savedPaymentDetail.cardNumber &&
            this.paymentForm.value.cardExpiryDate.getMonth() ===
              savedPaymentDetail.cardExpiryDate.getMonth() &&
            this.paymentForm.value.cardExpiryDate.getFullYear() ===
              savedPaymentDetail.cardExpiryDate.getFullYear()
          ) {
            this.duplicatePaymentUsed = true;
          }
        });
      }

      if (!this.duplicatePaymentUsed) {
        let newPaymentDetail = new PaymentDetailModel();
        newPaymentDetail = this.paymentForm.value;
        this.store.dispatch(addPaymentDetail(newPaymentDetail));
      }

      //Duplicate Success
      Swal.fire({
        title: "Payment Complete!",
        text:
          "Your cart has been confirmed. The transaction ID for your reference is #" +
          this.transactionNumber +
          ".",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "New Transaction, Going Back to cart"
      }).then(result => {
        if (result.isConfirmed) {
          this.paymentService.increaseMockTransactionNumber();
          this.transactionNumber = this.paymentService.getMockTransactionNumber();
          this.router.navigate(["cartSummary"]);
        }
      });
      //Duplicate success
      this.paymentService
        .savePaymentDetails(this.paymentForm.value)
        .subscribe(response => {
          Swal.fire({
            title: "Payment Complete!",
            text: "Your cart has been confirmed.",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "New Transaction, Going Back to cart"
          }).then(result => {
            if (result.isConfirmed) {
              this.paymentService.increaseMockTransactionNumber();
              this.transactionNumber = this.paymentService.getMockTransactionNumber();
              this.router.navigate(["cartSummary"]);
            }
          });
        })
        .unsubscribe();
    }
  }

  selectedPreviousPaymentDetail(paymentDetailToUpdate) {
    this.paymentForm.setValue(paymentDetailToUpdate);
    this.duplicatePaymentUsed = true;
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.paymentForm.controls.cardExpiryDate.value;
    ctrlValue.setYear(normalizedYear.year());
    this.paymentForm.controls.cardExpiryDate.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.paymentForm.controls.cardExpiryDate.value;
    ctrlValue.setMonth(normalizedMonth.month());
    this.paymentForm.controls.cardExpiryDate.setValue(ctrlValue);
    datepicker.close();
  }
}
