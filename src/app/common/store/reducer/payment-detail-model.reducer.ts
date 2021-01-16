import { Action, createReducer, on } from '@ngrx/store';
import * as PaymentDetailActions from '../action/payment-detail-model.actions';
import { PaymentDetailModel } from '../../models/payment-detail.model';

export const paymentDetailModelFeatureKey = 'paymentDetail';

export interface PaymentDetailState {
  paymentDetails: PaymentDetailModel[];
}

export const initialState: PaymentDetailState = {
  paymentDetails: []
};

export const paymentDetailReducer = createReducer(
  initialState,
  on(PaymentDetailActions.addPaymentDetail,
    (state: PaymentDetailState, {paymentDetail}) =>
      ({...state,
        paymentDetails: [...state.paymentDetails, paymentDetail]
      }))
);

export function reducer(state: PaymentDetailState | undefined, action: Action): any {
    return paymentDetailReducer(state, action);
}