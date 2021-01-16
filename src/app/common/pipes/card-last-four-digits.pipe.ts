import { Pipe, PipeTransform } from "@angular/core";
/*
 * Hide card number characters, except last 4 digits
 * Takes an string argument that returns * hidden string, with only last four digits visible.
 * Usage:
 *   value | cardLastFourDigitsPipe:exponent
 * Example:
 *   {{ 2222222 | cardLastFourDigitsPipe }}
 *   formats to: ***2222
 */
@Pipe({ name: "cardLastFourDigitsPipe" })
export class CardLastFourDigitsPipe implements PipeTransform {
  transform(value: number): string {
    var stringified = value.toString(),
      firstPart = stringified.slice(0, -4).replaceAll(/[0-9]/gi, "*"),
      secondPart = stringified.slice(-4);
    return firstPart.concat(secondPart);
  }
}
