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
    return `${amount.toLocaleString(locale)}${suffix}`.trim();
  };

  const formatDateTime = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));

  const formatQuantityLabel = (amount: number) => {
    const suffix = locale === 'ko' ? '개' : 'EA';
    return `${amount.toLocaleString(locale)}${suffix}`;
  };

  // 짧은 날짜용 (차트 축 등)
  const formatShortDate = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, {
      month: '2-digit',
      day: '2-digit',
    })
      .format(new Date(value))
      .replace(/\./g, '')
      .trim(); // "04.08" → "04 08" → "04.08" 으로 직접 포맷 조정도 가능

  return {
    formatPriceLabel,
    formatDateTime,
    formatQuantityLabel,
    formatShortDate,
  };
}
