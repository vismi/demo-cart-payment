import { createAction, props } from '@ngrx/store';
import { PaymentDetailModel } from '../../models/payment-detail.model';
export const addPaymentDetail = createAction(
  '[PaymentDetailModel] Add PaymentDetail',
  (paymentDetail: PaymentDetailModel) => ({paymentDetail})
);
export const loadPaymentDetail = createAction(
  '[PaymentDetailModel] Load PaymentDetail',
  (paymentDetail: PaymentDetailModel) => ({paymentDetail})
);