'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
];

export function TableInfo({ tableId }: { tableId: string }) {
  const t = useTranslations('TableInfo');
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale(); // 현재 locale 가져오기
  const selectedLanguage =
    languages.find((lang) => lang.code === locale) ?? languages[0];
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: { code: string; name: string }) => {
    setIsOpen(false);
    if (lang.code !== locale) {
      router.push(pathname, { locale: lang.code });
    }
  };

  return (
    <div className='flex items-center justify-between p-6 bg-white border-b border-toss-gray-200'>
      <div className='relative'>
        <motion.button
          className='flex items-center px-5 py-3 text-base font-medium text-toss-gray-700 bg-toss-gray-100 rounded-full hover:bg-toss-gray-200 transition-colors'
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.97 }}
        >
          <Globe className='mr-2 h-5 w-5 text-toss-gray-500' />
          {selectedLanguage.name}
          <ChevronDown
            className={`ml-2 h-5 w-5 text-toss-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className='absolute z-10 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'
            >
              <div className='py-1'>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className='block w-full px-5 py-3 text-base text-left text-toss-gray-700 hover:bg-toss-gray-100'
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className='flex items-center gap-2'
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className='text-3xl font-bold text-toss-blue'>
          {/* TODO(@smosco): tableName을 보여줄 필요 없음 */}
          {t('tableLabel', { name: tableId })}
        </span>
      </motion.div>
    </div>
  );
}
