'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
];

export function TableInfo({ tableName }: { tableName: string }) {
  const t = useTranslations('TableInfo');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <div className='flex items-center justify-between p-4 bg-white border-b border-toss-gray-200'>
      <div className='relative'>
        <motion.button
          className='flex items-center px-4 py-2 text-sm font-medium text-toss-gray-700 bg-toss-gray-100 rounded-full hover:bg-toss-gray-200 transition-colors'
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.97 }}
        >
          <Globe className='mr-2 h-4 w-4 text-toss-gray-500' />
          {selectedLanguage.name}
          <ChevronDown
            className={`ml-2 h-4 w-4 text-toss-gray-500 transition-transform ${
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
              className='absolute z-10 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'
            >
              <div className='py-1'>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className='block w-full px-4 py-2 text-sm text-left text-toss-gray-700 hover:bg-toss-gray-100'
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsOpen(false);
                    }}
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
        <span className='text-2xl font-bold text-toss-blue'>
          {/* TODO(@smosco): tableName을 보여줄 필요 없음 */}
          {t('tableLabel', { name: tableName })}
        </span>
      </motion.div>
    </div>
  );
}
