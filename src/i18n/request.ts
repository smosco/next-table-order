import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

// ✅ 정적 import로 메시지 미리 가져오기
import en from '../messages/en.json';
import ko from '../messages/ko.json';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: locale === 'ko' ? ko : en,
  };
});
