import { Pipe, PipeTransform } from "@angular/core";
/*
 * Show Expiry date in MM/YYYY format
 * Takes an string argument that returns * hidden string, with only last four digits visible.
 * Usage:
 *   value | dateCardExpiryPipe:exponent
 * Example:
 *   {{ 2222222 | dateCardExpiryPipe }}
 *   formats to: ***2222
 */
@Pipe({ name: "dateCardExpiryPipe" })
export class DateCardExpiryPipe implements PipeTransform {
  transform(value: Date): String {
    var monthToReturn = value.getMonth() + 1;
    return (
      (monthToReturn > 9 ? monthToReturn : "0" + monthToReturn) +
      "/" +
      value.getFullYear()
    );
  }
}
