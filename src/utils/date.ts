import { Between, LessThanOrEqual, MoreThan, MoreThanOrEqual } from 'typeorm';
import {
  addYears,
  endOfDay,
  format,
  isDate,
  parseISO,
  startOfDay,
  subYears,
} from 'date-fns';
import { date } from 'joi';

// TypeORM Query Operators
// export const BetweenDates = (from: Date | string, to: Date | string) =>
//   Between(
//     format(
//       typeof from === 'string' ? new Date(from) : from,
//       'YYYY-MM-DD HH:MM:ss',
//     ),
//     format(typeof to === 'string' ? new Date(to) : to, 'YYYY-MM-DD HH:MM:ss'),
//   );

export const parseISODate = (dateString: string | Date): Date => {
  return isDate(dateString) ? dateString : parseISO(dateString);
};

export const BetweenDates = (from: Date | string, to: Date | string) => {
  const fromDate = isDate(from) ? from : parseISO(from);
  const toDate = isDate(to) ? to : parseISO(to);

  return Between(startOfDay(fromDate), endOfDay(toDate));
};
export const AfterDate = (date: Date | string) => {
  const fromDate = isDate(date) ? date : parseISO(date);

  return MoreThanOrEqual(startOfDay(fromDate));
};
export const BeforeDate = (date: Date | string) => {
  const fromDate = isDate(date) ? date : parseISO(date);

  return LessThanOrEqual(endOfDay(fromDate));
};
