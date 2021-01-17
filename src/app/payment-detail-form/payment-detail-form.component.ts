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
    this.paymentForm.controls.amountPaid.setValue(this.amountToPay.price);
    this.paymentForm.controls.currency.setValue(this.amountToPay.currency);
  }

  paymentDetails$: Observable<PaymentDetailModel[]>;
  paymentForm: FormGroup;
  storedPaymentMethods: boolean = false;
  isSubmitted: Boolean = false;
  isAPIAvailable: Boolean = false;
  transactionNumber: number;
  savedTransactions: Array<PaymentDetailModel>;
  duplicatePaymentUsed: boolean = false;
  availableCurrencies: Array<string> = ["INR", "GBP", "USD"];
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

  /**
   * Method to complete submission validations
   * @param mockAPI used to emulate success and error scenarios
   */
  submitPaymentDetails(mockAPI) {
    this.isSubmitted = true;
    if (
      this.paymentForm.valid &&
      this.paymentForm.value.amountPaid === this.amountToPay.price
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

      this.paymentService
        .savePaymentDetails(this.paymentForm.value, mockAPI)
        .subscribe(
          response => {
            Swal.fire({
              title: "Payment Complete!",
              text:
                "Your cart has been confirmed. The transaction ID for your reference is #" +
                this.transactionNumber +
                ".",
              icon: "success",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "New Transaction, Going Back to dummy cart."
            }).then(result => {
              if (result.isConfirmed) {
                this.paymentService.increaseMockTransactionNumber();
                this.transactionNumber = this.paymentService.getMockTransactionNumber();
                if (!this.duplicatePaymentUsed) {
                  // Store card in state only if payment successful
                  let newPaymentDetail = new PaymentDetailModel();
                  newPaymentDetail = this.paymentForm.value;
                  this.store.dispatch(addPaymentDetail(newPaymentDetail));
                }
                this.router.navigate(["cartSummary"]);
              }
            });
          },
          error => {
            Swal.fire({
              title: "Payment Error!",
              text: "You have not been charged.",
              icon: "error",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Try payment again with another method?"
            }).then(result => {
              if (result.isConfirmed) {
                this.paymentForm = this.formBuilder.formGroup(
                  new PaymentDetailModel()
                );
                this.paymentForm.controls.amountPaid.setValue(
                  this.amountToPay.price
                );
                this.paymentForm.controls.currency.setValue(
                  this.amountToPay.currency
                );
              }
            });
          }
        )
        .unsubscribe();
    }
  }

  // User can select a previously used card to auto fill the form
  selectedPreviousPaymentDetail(paymentDetailToUpdate) {
    this.paymentForm.setValue(paymentDetailToUpdate);
    this.paymentForm.controls.amountPaid.setValue(this.amountToPay.price);
    this.paymentForm.controls.currency.setValue(this.amountToPay.currency);
    this.duplicatePaymentUsed = true;
  }

  // Aids in Custom Datepicker functionality
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
