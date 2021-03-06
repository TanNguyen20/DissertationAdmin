import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------
// numeral.register('locale', 'vi', {
//   delimiters: {
//       thousands: ' ',
//       decimal: ','
//   },
//   currency: {
//       symbol: '₫'
//   }
// });

// // switch between locales
// numeral.locale('vi');
export function fCurrency(number) {
  // return numeral(number).format(Number.isInteger(number) ? '0,0$' : '0,0.00$');
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
