'use client';

import { useLocale } from 'next-intl';

export function useFormatters() {
  const locale = useLocale();

  /**
   * 단순 숫자 + 화폐 접미사 포맷
   * @example formatPriceLabel(12000) => "12,000원" or "12,000 KRW"
   */
  const formatPriceLabel = (amount: number) => {
    const suffix = locale === 'ko' ? '원' : 'KRW';
    return `${amount.toLocaleString(locale)} ${suffix}`.trim();
  };

  const formatDateTime = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));

  return {
    formatPriceLabel,
    formatDateTime,
  };
}
