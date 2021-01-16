import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPaymentDetail from '../reducer/payment-detail-model.reducer';
export const selectCustomerState = createFeatureSelector<fromPaymentDetail.PaymentDetailState>(
    fromPaymentDetail.paymentDetailModelFeatureKey,
);
export const selectPaymentDetails = createSelector(
  selectCustomerState,
  (state: fromPaymentDetail.PaymentDetailState) => state.paymentDetails 
);