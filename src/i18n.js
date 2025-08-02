import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'CURRENCY-COMMODITY CONVERTER',
      select_currency: 'Select currency/metal',
      remove_confirm: 'Remove currency?',
      exchange_rates_from: 'Exchange rates from',
      commodities_from: 'Commodities from',
      today: 'Today',
      last_year: 'Last Year',
      five_years_ago: '5 Years Ago',
      gold: 'Gold (g)',
      silver: 'Silver (g)',
    },
  },
  tr: {
    translation: {
      title: 'D\u00d6V\u0130Z - EMT\u0130A \u00c7EV\u0130R\u0130C\u0130',
      select_currency: 'Para birimi/metal se\u00e7',
      remove_confirm: 'Para birimi kald\u0131r\u0131ls\u0131n m\u0131?',
      exchange_rates_from: 'Kur verileri',
      commodities_from: 'Emtia verileri',
      today: 'Bug\u00fcn',
      last_year: 'Ge\u00e7en Y\u0131l',
      five_years_ago: '5 Y\u0131l \u00d6nce',
      gold: 'Alt\u0131n (g)',
      silver: 'G\u00fcm\u00fc\u015f (g)',
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
