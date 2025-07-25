import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'Currency & Commodity Calculator',
      select_currency: 'Select currency',
      remove_confirm: 'Remove currency?',
      exchange_rates_from: 'Exchange rates from',
      commodities_from: 'Commodities from',
    },
  },
  tr: {
    translation: {
      title: 'D\u00d6V\u0130Z - EMT\u0130A HESAPLAYICI',
      select_currency: 'Para birimi se\u00e7',
      remove_confirm: 'Para birimi kald\u0131r\u0131ls\u0131n m\u0131?',
      exchange_rates_from: 'Kur verileri',
      commodities_from: 'Emtia verileri',
    },
  },
};

const userLang = navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: userLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
