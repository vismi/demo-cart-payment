import * as fromPaymentDetailModel from './payment-detail-model.actions';

describe('loadPaymentDetailModels', () => {
  it('should return an action', () => {
    expect(fromPaymentDetailModel.loadPaymentDetailModels().type).toBe('[PaymentDetailModel] Load PaymentDetailModels');
  });
});
