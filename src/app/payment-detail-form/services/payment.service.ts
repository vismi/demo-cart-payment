import { Injectable } from "@angular/core";
import { Observable, throwError, of } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { PaymentDetailModel } from "../../common/models/payment-detail.model";

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) {}

  /**
   * Method to use Mock Transaction number between scenarios
   * @param detail
   */
  transactionNumber: number = 11110;

  public getMockTransactionNumber() {
    return this.transactionNumber;
  }

  public increaseMockTransactionNumber() {
    this.transactionNumber = this.transactionNumber + 1;
  }

  /**
   * Method to POST payment details to DB
   * The param mockAPI is used to determine and generate sample error and success scenarios
   * @param detailToPost
   * @param mockAPI
   */
  public savePaymentDetails(detailToPost: PaymentDetailModel, mockAPI: string) {
    // Since a valid API is not available mocking the Observable response
    if (mockAPI) {
      if (mockAPI === "success") {
        // Mocking Success Scenario
        return of(PaymentDetailModel);
      } else {
        // Mocking Failure Scenario
        return throwError(new Error("Mock Service Failure!"));
      }
    } else {
      return this.http
        .post("http://www.vismita.com", detailToPost)
        .pipe(catchError(this.handleError));
    }
  }

  /**
   * Method handle error assording to error message received from API
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error event occurred:", error.error);
    } else {
      console.error(`We encountered an unhandled error:`, error.error);
    }

    return throwError("Encountered an error; Please try again later.");
  }
}
