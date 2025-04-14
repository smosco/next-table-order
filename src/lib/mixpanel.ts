// lib/mixpanel.ts
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!;

export const initMixpanel = () => {
  if (typeof window !== 'undefined' && MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV !== 'production',
      track_pageview: true,
      persistence: 'localStorage',
    });
  }
};

/**
 * 추적용 함수: 이벤트명과 속성을 전달하세요.
 * @param event - 이벤트 이름 (예: 'add_to_cart')
 * @param props - 이벤트 속성 객체 (예: { menuId, quantity, price })
 */
export const track = (event: string, props?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.track(event, props);
  }
};
