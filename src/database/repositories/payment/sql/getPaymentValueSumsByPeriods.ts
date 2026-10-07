import { Prisma } from '@prisma/client';
import {
  PaymentMethod,
  PaymentStatus,
} from 'src/modules/payments/domain/payment.domain';
import { PaymentValuePeriodType } from 'src/modules/payments/use-cases/get-payment-value-sum-by-period/get-payment-value-by-period.query';

export interface IResultByDay {
  sum: number;
  localDay: number;
  localMonth: number;
  localYear: number;
}

export interface IResultByWeek {
  sum: number;
  localWeek: number;
  localYear: number;
}

export interface IResultByMonth {
  sum: number;
  localMonth: number;
  localYear: number;
}

export interface IResultByYear {
  sum: number;
  localYear: number;
}

export type IGetPaymentValueSumsByPeriodsResponse =
  | IResultByDay[]
  | IResultByWeek[]
  | IResultByMonth[]
  | IResultByYear[];

export interface IGetPaymentValueSymsByPeriodsQuery {
  // Obrigatory
  since: Date;
  until: Date;
  timezone: string;
  periodType: PaymentValuePeriodType;
  requesterId: string;

  // Optional
  minValue?: number;
  maxValue?: number;
  categoryId?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  searchBy?: string;
  tagIds?: string[];
  familyId?: string;
  recurringPaymentId?: string;
  accountId?: string;
  hasRecurringPayment?: boolean;
}

interface IProps {
  query: IGetPaymentValueSymsByPeriodsQuery;
}

/**
 * The offset is interpolated into SQL text (CONVERT_TZ cannot take it as a
 * repeated bound parameter here), so only strict `+HH:MM` / `-HH:MM` values
 * are allowed through.
 */
export const toSqlTimezoneOffset = (timezone: string): string => {
  if (timezone === 'Z') return '+00:00';
  const match = /^([+-])(\d{2})(?::?(\d{2}))?$/.exec(timezone);
  if (!match) throw new Error(`Invalid timezone offset: ${timezone}`);
  const [, sign, hours, minutes = '00'] = match;
  if (Number(hours) > 14 || Number(minutes) > 59) {
    throw new Error(`Invalid timezone offset: ${timezone}`);
  }
  return `${sign}${hours}:${minutes}`;
};

const getSelect = (query: IGetPaymentValueSymsByPeriodsQuery) => {
  const { periodType } = query;
  const timezone = toSqlTimezoneOffset(query.timezone);
  const selects = [`SUM(value) as sum`];
  const localPaymentDate = `CONVERT_TZ(paymentDate, '+00:00', '${timezone}')`;
  const separators: string[] = [];

  switch (periodType) {
    case PaymentValuePeriodType.Daily:
      separators.push(
        `DAY(${localPaymentDate}) AS localDay`,
        `MONTH(${localPaymentDate}) AS localMonth`,
        `YEAR(${localPaymentDate}) AS localYear`,
      );
      break;
    case PaymentValuePeriodType.Monthly:
      separators.push(
        `MONTH(${localPaymentDate}) AS localMonth`,
        `YEAR(${localPaymentDate}) AS localYear`,
      );
      break;
    case PaymentValuePeriodType.Weekly:
      separators.push(
        `WEEK(${localPaymentDate}) AS localWeek`,
        `MONTH(${localPaymentDate}) AS localMonth`,
        `YEAR(${localPaymentDate}) AS localYear`,
      );
      break;
    case PaymentValuePeriodType.Yearly:
      separators.push(`YEAR(${localPaymentDate}) AS localYear`);
      break;
  }

  selects.push(...separators);

  return `SELECT ` + selects.join(', ');
};

const getGroupBy = (periodType: PaymentValuePeriodType) => {
  switch (periodType) {
    case PaymentValuePeriodType.Daily:
      return 'GROUP BY localDay, localMonth, localYear';
    case PaymentValuePeriodType.Weekly:
      return 'GROUP BY localWeek, localMonth, localYear';
    case PaymentValuePeriodType.Monthly:
      return 'GROUP BY localMonth, localYear';
    case PaymentValuePeriodType.Yearly:
      return 'GROUP BY localYear';
  }
};

const getArguments = (
  query: IGetPaymentValueSymsByPeriodsQuery,
): (string | number)[] => {
  const joins = [query.requesterId];
  const wheres: (string | number)[] = [
    query.since.toISOString(),
    query.until.toISOString(),
  ];

  if (query.accountId) wheres.push(query.accountId);
  if (query.categoryId) wheres.push(query.categoryId);
  if (query.familyId) wheres.push(query.familyId);

  if (query.maxValue) wheres.push(query.maxValue);
  if (query.minValue) wheres.push(query.minValue);
  if (query.paymentMethod) wheres.push(query.paymentMethod);
  if (query.recurringPaymentId) wheres.push(query.recurringPaymentId);
  if (query.searchBy) wheres.push(`%${query.searchBy}%`);
  if (query.status) wheres.push(query.status);

  return [...joins, ...wheres];
};

const getWhere = (query: IGetPaymentValueSymsByPeriodsQuery): string => {
  const whereStatements = ['(paymentDate BETWEEN ? AND ?)'];
  if (query.accountId) whereStatements.push('accountId = ?');
  if (query.categoryId) whereStatements.push('categoryId = ?');
  if (query.familyId) whereStatements.push('Account.familyId = ?');
  if (query.hasRecurringPayment !== undefined) {
    if (query.hasRecurringPayment) {
      whereStatements.push('recurringPaymentId IS NOT NULL');
    } else {
      whereStatements.push('recurringPaymentId IS NULL');
    }
  }
  if (query.maxValue) whereStatements.push('value <= ?');
  if (query.minValue) whereStatements.push('value >= ?');
  if (query.paymentMethod) whereStatements.push('paymentMethod = ?');
  if (query.recurringPaymentId) whereStatements.push('recurringPaymentId = ?');
  if (query.searchBy) whereStatements.push('description LIKE ?');
  if (query.status) whereStatements.push('status = ?');
  // if (query.tagIds) whereStatements.push('tag = ?');

  return 'WHERE ' + whereStatements.join(' AND ');
};

const getJoins = (): string => {
  const joins = [
    'JOIN Account on Account.id = accountId',
    'JOIN Family on Family.id = Account.familyId',
    'JOIN _FamilyToUser on Family.id = _FamilyToUser.A',
    'JOIN User on (User.id = _FamilyToUser.B AND User.id = ?)',
  ];

  return joins.join(' ');
};

export const getPaymentValueSumsByPeriodsSQL = ({
  query,
}: IProps): Prisma.Sql => {
  const res = Prisma.raw(`
    ${getSelect(query)}
    FROM Payment
    ${getJoins()}
    ${getWhere(query)}
    ${getGroupBy(query.periodType)}
    `);

  (res.values as any) = getArguments(query);
  return res;
};
