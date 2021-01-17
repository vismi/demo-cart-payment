import {
  alpha,
  required,
  minLength,
  maxLength,
  minNumber,
  pattern,
  upperCase
} from "@rxweb/reactive-form-validators";

export class PaymentDetailModel {
  @minLength({ value: 16 })
  @maxLength({ value: 16 })
  @required()
  cardNumber: string = "";

  @alpha()
  @upperCase()
  @minLength({ value: 4 })
  @maxLength({ value: 40 })
  @required()
  cardHolderName: string = "";

  @required()
  cardExpiryDate: Date = new Date();

  @minLength({ value: 3 })
  @maxLength({ value: 4 })
  @pattern({ expression: { pattern: /^[0-9]{3}$/ } })
  @required()
  securityNumber: string = "";

  @required()
  @minNumber({ value: 2000 })
  amountPaid: number = 0;

  @minLength({ value: 3 })
  @maxLength({ value: 3 })
  @required()
  currency: string = "";
}
