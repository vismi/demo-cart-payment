import {
  alpha,
  required,
  minLength,
  maxLength,
  range,
  pattern,
  upperCase
} from "@rxweb/reactive-form-validators";

export class PaymentDetailModel {
  @minLength({ value: 12 })
  @maxLength({ value: 12 })
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
  amountPaid: number = 0;

  @minLength({ value: 3 })
  @maxLength({ value: 3 })
  @required()
  currency: string = "";

  setCardNumber(cardNumber: string) {
    if (this.validCardNumber(cardNumber)) {
      this.cardNumber = cardNumber;
    }
  }

  setCardHolderName(cardHolderName: string) {
    if (this.validName(cardHolderName)) {
      this.cardHolderName = cardHolderName;
    }
  }

  setCardExpiryDate(cardExpiryDate: Moment) {
    if (this.validExpiryDate(cardExpiryDate)) {
      this.cardExpiryDate = cardExpiryDate;
    }
  }

  setSecurityNumber(securityNumber: string) {
    if (this.validCVV(securityNumber)) {
      this.securityNumber = securityNumber;
    }
  }

  setAmountPaid(amountPaid: number, currency: string) {
    if (this.validCurrency(currency) && !isNaN(amountPaid) && amountPaid > 0) {
      this.amountPaid = amountPaid;
      this.currency = currency;
    }
  }

  validCardNumber(cardNumber: string) {
    return /^[0-9]{12}$/.test(cardNumber);
  }

  validName(name: string) {
    return /^[a-zA-Z]+$/.test(name);
  }

  validExpiryDate(date: Moment) {
    return moment(date) > moment();
  }

  validCVV(cvv: string) {
    return /^[0-9]{12}$/.test(cvv);
  }

  validCurrency(currencyCode: string) {
    return /^[a-zA-Z]{3}$/.test(currencyCode);
  }
}
