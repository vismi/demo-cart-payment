import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { PaymentDetailModel } from "../../common/models/payment-detail.model";

@Injectable()

export class PaymentService {

    constructor(private http: HttpClient) {

    }

    /**
     * Method to POST payment details to DB
     * @param detail
     */
    public savePaymentDetails(detailToPost: PaymentDetailModel) {
        return this.http.post('http://www.vismita.com', detailToPost).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('An error event occurred:', error.error);
        } else {
          console.error(
            `We encountered an unhandled error:`, error.error);
        }

        return throwError(
          'Encountered an error; Please try again later.');
      }
}