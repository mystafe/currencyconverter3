/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence, motion } from "framer-motion";

const currencySymbols = {
  AUD: "A$",
  BGN: "лв",
  BRL: "R$",
  CAD: "C$",
  CHF: "CHF",
  CNY: "¥",
  CZK: "Kč",
  DKK: "kr",
  EUR: "€",
  GBP: "£",
  HKD: "HK$",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  INR: "₹",
  ISK: "kr",
  JPY: "¥",
  KRW: "₩",
  MXN: "MX$",
  MYR: "RM",
  NOK: "kr",
  NZD: "NZ$",
  PHP: "₱",
  PLN: "zł",
  RON: "lei",
  SEK: "kr",
  SGD: "S$",
  THB: "฿",
  TRY: "₺",
  USD: "$",
  ZAR: "R",
  AED: "DH",
  SAR: "SAR",
  XAU: "Gold (g)",
  XAG: "Silver (g)",
  XPT: "Platinum (g)",
  XPD: "Palladium (g)",
};

const currencyFlags = {
  AUD: "\uD83C\uDDE6\uD83C\uDDFA", // Australia
  BGN: "\uD83C\uDDE7\uD83C\uDDEC", // Bulgaria
  BRL: "\uD83C\uDDE7\uD83C\uDDF7", // Brazil
  CAD: "\uD83C\uDDE8\uD83C\uDDE6", // Canada
  CHF: "\uD83C\uDDE8\uD83C\uDDED", // Switzerland
  CNY: "\uD83C\uDDE8\uD83C\uDDF3", // China
  CZK: "\uD83C\uDDE8\uD83C\uDDFF", // Czechia
  DKK: "\uD83C\uDDE9\uD83C\uDDF0", // Denmark
  EUR: "\uD83C\uDDEA\uD83C\uDDFA", // European Union
  GBP: "\uD83C\uDDEC\uD83C\uDDE7", // United Kingdom
  HKD: "\uD83C\uDDED\uD83C\uDDF0", // Hong Kong
  HUF: "\uD83C\uDDED\uD83C\uDDFA", // Hungary
  IDR: "\uD83C\uDDEE\uD83C\uDDE9", // Indonesia
  ILS: "\uD83C\uDDEE\uD83C\uDDF1", // Israel
  INR: "\uD83C\uDDEE\uD83C\uDDF3", // India
  ISK: "\uD83C\uDDEE\uD83C\uDDF8", // Iceland
  JPY: "\uD83C\uDDEF\uD83C\uDDF5", // Japan
  KRW: "\uD83C\uDDF0\uD83C\uDDF7", // South Korea
  MXN: "\uD83C\uDDF2\uD83C\uDDFD", // Mexico
  MYR: "\uD83C\uDDF2\uD83C\uDDFE", // Malaysia
  NOK: "\uD83C\uDDF3\uD83C\uDDF4", // Norway
  NZD: "\uD83C\uDDF3\uD83C\uDDFF", // New Zealand
  PHP: "\uD83C\uDDF5\uD83C\uDDED", // Philippines
  PLN: "\uD83C\uDDF5\uD83C\uDDF1", // Poland
  RON: "\uD83C\uDDF7\uD83C\uDDF4", // Romania
  SEK: "\uD83C\uDDF8\uD83C\uDDEA", // Sweden
  SGD: "\uD83C\uDDF8\uD83C\uDDEC", // Singapore
  THB: "\uD83C\uDDF9\uD83C\uDDED", // Thailand
  TRY: "\uD83C\uDDF9\uD83C\uDDF7", // Turkey
  USD: "\uD83C\uDDFA\uD83C\uDDF8", // United States
  ZAR: "\uD83C\uDDFF\uD83C\uDDE6", // South Africa
  AED: "\uD83C\uDDE6\uD83C\uDDEA", // United Arab Emirates
  SAR: "\uD83C\uDDF8\uD83C\uDDE6", // Saudi Arabia
  XAU: "\uD83E\uDD47", // gold medal
  XAG: "\uD83E\uDD48", // silver medal
  XPT: "\uD83E\uDE99", // coin
  XPD: "\u2699\uFE0F", // gear
};

const getFlag = (code) => currencyFlags[code] || "";

const currencyCodes = [
  "AUD",
  "BGN",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR",
  "AED",
  "SAR",
  "XAU",
  "XAG",
  "XPT",
  "XPD",
];

const frankfurterCodes = [
  "AUD",
  "BGN",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR",
];

const METAL_CODES = ["XAU", "XAG", "XPT", "XPD"];

const OER_APP_ID = process.env.REACT_APP_APP_ID;

const TROY_OUNCE_TO_GRAM = 31.1034768;
// Convert metal prices from USD per troy ounce to USD per gram

const fetchOpenRates = async (date) => {
  const key = `oer_${date}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem(key);
    }
  }
  const resp = await fetch(
    `https://openexchangerates.org/api/historical/${date}.json?app_id=${OER_APP_ID}&show_metals=1`
  );
  if (!resp.ok) throw new Error("Request failed!");
  const data = await resp.json();
  const rates = data.rates;
  METAL_CODES.forEach((m) => {
    if (rates[m] != null) rates[m] *= TROY_OUNCE_TO_GRAM; // convert to grams
  });
  localStorage.setItem(key, JSON.stringify(rates));
  return rates;
};

const getSymbol = (code) => currencySymbols[code] || code;

const fetchRate = async (from, to, date) => {
  if (from === to) return 1;

  const cacheKey = `rate_${from}_${to}_${date}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const num = parseFloat(cached);
    if (!isNaN(num)) return num;
  }

  const useFrankfurter =
    frankfurterCodes.includes(from) &&
    frankfurterCodes.includes(to) &&
    !METAL_CODES.includes(from) &&
    !METAL_CODES.includes(to);

  if (useFrankfurter) {
    if (from === "USD" && to === "AED") {
      localStorage.setItem(cacheKey, 3.6725);
      return 3.6725;
    }
    if (from === "AED" && to === "USD") {
      localStorage.setItem(cacheKey, 1 / 3.6725);
      return 1 / 3.6725;
    }
    if (from === "AED") {
      const resp = await fetch(
        `https://api.frankfurter.app/${date}?from=USD&to=${to}`
      );
      if (!resp.ok) throw new Error("Request failed!");
      const data = await resp.json();
      const usdToSecond = data.rates[to];
      const rate = (1 / 3.6725) * usdToSecond;
      localStorage.setItem(cacheKey, rate);
      return rate;
    }
    if (to === "AED") {
      const resp = await fetch(
        `https://api.frankfurter.app/${date}?from=${from}&to=USD`
      );
      if (!resp.ok) throw new Error("Request failed!");
      const data = await resp.json();
      const firstToUsd = data.rates["USD"];
      const rate = firstToUsd * 3.6725;
      localStorage.setItem(cacheKey, rate);
      return rate;
    }
    const response = await fetch(
      `https://api.frankfurter.app/${date}?from=${from}&to=${to}`
    );
    if (!response.ok) throw new Error("Request failed!");
    const data = await response.json();
    const rate = data.rates[to];
    localStorage.setItem(cacheKey, rate);
    return rate;
  }

  const rates = await fetchOpenRates(date);
  const fromRate = from === "USD" ? 1 : rates[from];
  const toRate = to === "USD" ? 1 : rates[to];
  if (fromRate == null || toRate == null) throw new Error("Rate not found");
  const rate = toRate / fromRate;
  localStorage.setItem(cacheKey, rate);
  return rate;
};

function Currency({ isSuper, onTitleClick }) {
  const { t } = useTranslation();
  const defaultCodes = (process.env.REACT_APP_DEFAULT_CURRENCIES || 'USD,TRY,AED')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  const [currencies, setCurrencies] = useState(
    defaultCodes.map((code, idx) => ({
      code,
      amount: idx === 0 ? 1 : 0,
      rate: idx === 0 ? 1 : 0,
    }))
  );
  const MIN_DATE = "2013-04-01";
  const today = new Date().toISOString().slice(0, 10);
  const [currencyTime, setCurrencyTime] = useState(today);
  const [showAdd, setShowAdd] = useState(false);
  const [baseIndex, setBaseIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [compareTime, setCompareTime] = useState(null);
  const [compareAmounts, setCompareAmounts] = useState([]);

  const formatTwoLines = (text) => {
    const parts = text.split(' ');
    if (parts.length === 1) return text;
    const last = parts.pop();
    return (
      <>
        {parts.join(' ')}<br />{last}
      </>
    );
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 576);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextDayDisabled = currencyTime >= today;
  const nextMonthDisabled = currencyTime >= today;
  const nextYearDisabled = currencyTime >= today;
  const prevDayDisabled = currencyTime <= MIN_DATE;
  const prevMonthDisabled = currencyTime <= MIN_DATE;
  const prevYearDisabled = currencyTime <= MIN_DATE;

  const compareNextDayDisabled = !compareTime || compareTime >= today;
  const compareNextMonthDisabled = !compareTime || compareTime >= today;
  const compareNextYearDisabled = !compareTime || compareTime >= today;
  const comparePrevDayDisabled = !compareTime || compareTime <= MIN_DATE;
  const comparePrevMonthDisabled = !compareTime || compareTime <= MIN_DATE;
  const comparePrevYearDisabled = !compareTime || compareTime <= MIN_DATE;

  const changeDate = (days) => {
    const d = new Date(currencyTime);
    d.setDate(d.getDate() + days);
    let newDate = d.toISOString().slice(0, 10);
    if (days < 0 && newDate < MIN_DATE) newDate = MIN_DATE;
    if (days > 0 && newDate > today) return;
    handleDateSelection({ target: { value: newDate } });
  };

  const changeMonth = (months) => {
    const d = new Date(currencyTime);
    d.setMonth(d.getMonth() + months);
    let newDate = d.toISOString().slice(0, 10);
    if (months > 0 && newDate > today) newDate = today;
    if (months < 0 && newDate < MIN_DATE) newDate = MIN_DATE;
    handleDateSelection({ target: { value: newDate } });
  };

  const changeYear = (years) => {
    const d = new Date(currencyTime);
    d.setFullYear(d.getFullYear() + years);
    let newDate = d.toISOString().slice(0, 10);
    if (years > 0 && newDate > today) newDate = today;
    if (years < 0 && newDate < MIN_DATE) newDate = MIN_DATE;
    handleDateSelection({ target: { value: newDate } });
  };

  const changeCompareDate = (days) => {
    if (!compareTime) return;
    const d = new Date(compareTime);
    d.setDate(d.getDate() + days);
    let newDate = d.toISOString().slice(0, 10);
    if (days < 0 && newDate < MIN_DATE) newDate = MIN_DATE;
    if (days > 0 && newDate > today) return;
    setCompareTime(newDate);
  };

  const changeCompareMonth = (months) => {
    if (!compareTime) return;
    const d = new Date(compareTime);
    d.setMonth(d.getMonth() + months);
    let newDate = d.toISOString().slice(0, 10);
    if (months > 0 && newDate > today) newDate = today;
    if (months < 0 && newDate < MIN_DATE) newDate = MIN_DATE;
    setCompareTime(newDate);
  };

  const changeCompareYear = (years) => {
    if (!compareTime) return;
    const d = new Date(compareTime);
    d.setFullYear(d.getFullYear() + years);
    let newDate = d.toISOString().slice(0, 10);
    if (years > 0 && newDate > today) newDate = today;
    if (years < 0 && newDate < MIN_DATE) newDate = MIN_DATE;
    setCompareTime(newDate);
  };

  const handleDateSelection = (e) => {
    const val = e.target.value;
    setCurrencyTime(val);
  };

  const codesList = currencies.map((c) => c.code).join();
  useEffect(() => {
    const updateRates = async () => {
      try {
        const base = currencies[baseIndex];
        const updated = await Promise.all(
          currencies.map(async (c, idx) => {
            if (idx === baseIndex)
              return { ...c, rate: 1, amount: base.amount };
            const rate = await fetchRate(base.code, c.code, currencyTime);
            return { ...c, rate, amount: (base.amount * rate).toFixed(2) };
          })
        );
        setCurrencies(updated);
      } catch (err) {
        console.log(err.message);
      }
    };
    updateRates();
  }, [currencyTime, baseIndex, currencies[baseIndex].code, currencies[baseIndex].amount, codesList]);

  useEffect(() => {
    if (!compareTime) {
      setCompareAmounts([]);
      return;
    }
    const updateCompare = async () => {
      try {
        const base = currencies[baseIndex];
        const res = await Promise.all(
          currencies.map(async (c, idx) => {
            if (idx === baseIndex) return base.amount;
            const rate = await fetchRate(base.code, c.code, compareTime);
            return (base.amount * rate).toFixed(2);
          })
        );
        setCompareAmounts(res);
      } catch (err) {
        console.log(err.message);
      }
    };
    updateCompare();
  }, [compareTime, baseIndex, currencies[baseIndex].code, currencies[baseIndex].amount, codesList]);

  const handleAmountChange = (index, value) => {
    const parseValue = (val) => {
      if (typeof val === "string") {
        const upper = val.trim().toUpperCase();
        if (upper === "M") return 1000000;
        if (upper === "K") return 1000;
        if (upper.endsWith("M")) {
          const num = parseFloat(upper.slice(0, -1));
          return (isNaN(num) ? 1 : num) * 1000000;
        }
        if (upper.endsWith("K")) {
          const num = parseFloat(upper.slice(0, -1));
          return (isNaN(num) ? 1 : num) * 1000;
        }
      }
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };
    let amount = parseValue(value);
    if (amount < 0) amount = 0;
    setCurrencies((prev) => {
      const baseAmountOld = prev[index].rate ? amount / prev[index].rate : amount;
      return prev.map((c, idx) =>
        idx === index
          ? { ...c, amount }
          : { ...c, amount: (baseAmountOld * c.rate).toFixed(2), rate: c.rate }
      );
    });
    setBaseIndex(index);
  };

  const handleCurrencyChange = (index, code) => {
    setCurrencies((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, code } : c))
    );
  };

  const handleRemoveCurrency = (index) => {
    if (window.confirm(t('remove_confirm'))) {
      setCurrencies((prev) => {
        const filtered = prev.filter((_, i) => i !== index);
        if (baseIndex >= filtered.length) {
          setBaseIndex(filtered.length - 1);
        } else if (index < baseIndex) {
          setBaseIndex((b) => b - 1);
        }
        return filtered;
      });
    }
  };

  const handleToday = () => {
    setCurrencyTime(today);
  };

  const handleLastYear = () => {
    const d = new Date(currencyTime);
    d.setFullYear(d.getFullYear() - 1);
    setCompareTime(d.toISOString().slice(0, 10));
  };

  const handleFiveYears = () => {
    const d = new Date(currencyTime);
    d.setFullYear(d.getFullYear() - 5);
    setCompareTime(d.toISOString().slice(0, 10));
  };

  return (
    <div className={`currencyDiv${compareTime ? ' compareMode' : ''}`}>
      <h1 onClick={onTitleClick}>{t('title')}</h1>
      <div className="currencySelection">
        <div className="dropdown">
          <AnimatePresence>
            {currencies.map((c, idx) => (
              <motion.div
                className="currencyRow"
                key={idx}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Form.Select
                  value={c.code}
                  onChange={(e) => handleCurrencyChange(idx, e.target.value)}
                >
                  {currencyCodes.map((code) => (
                    <option key={code} value={code}>
                      {`${getFlag(code)} ${getSymbol(code)} (${code})`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={c.amount}
                  onKeyDown={(e) => {
                    const key = e.key.toLowerCase();
                    if (key === "m" || key === "k") {
                      e.preventDefault();
                      const zeros = key === "m" ? "000000" : "000";
                      const cleaned = String(e.target.value).replace(/\D/g, "");
                      handleAmountChange(idx, cleaned + zeros);
                    }
                  }}
                  onFocus={() => setBaseIndex(idx)}
                  onChange={(e) => handleAmountChange(idx, e.target.value)}
                />
                {compareTime && (
                  <Form.Control
                    type="text"
                    readOnly
                    className="compareInput"
                    value={compareAmounts[idx] || ''}
                  />
                )}
                {currencies.length >= 3 && (
                  <Button
                    variant="danger"
                    className="minusIcon"
                    onClick={() => handleRemoveCurrency(idx)}
                  >
                    ➖
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {showAdd && (
            <Form.Select
              className="addSelect"
              onChange={(e) => {
                if (!e.target.value) return;
                setCurrencies((prev) => [
                  ...prev,
                  { code: e.target.value, amount: 0, rate: 0 },
                ]);
                setShowAdd(false);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                {t('select_currency')}
              </option>
              {currencyCodes
                .filter((code) => !currencies.some((c) => c.code === code))
                .map((code) => (
                  <option key={code} value={code}>
                    {`${getFlag(code)} ${getSymbol(code)} (${code})`}
                  </option>
                ))}
            </Form.Select>
          )}
        </div>
      </div>
      <div className="presetRow">
        {currencyTime !== today && (
          <Button onClick={handleToday}>{t('today')}</Button>
        )}
        <Button onClick={handleLastYear}>
          {formatTwoLines(t('last_year'))}
        </Button>
        <Button onClick={handleFiveYears}>
          {formatTwoLines(t('five_years_ago'))}
        </Button>
        {currencies.length < 8 && (
          <Button
            variant="success"
            className="plusIcon"
            onClick={() => setShowAdd(!showAdd)}
          >
            {showAdd ? "➖" : "➕"}
          </Button>
        )}
      </div>
      {isSuper ? (
        <>
          <div className="dateNavigator">
            <Button onClick={() => changeYear(-1)} disabled={prevYearDisabled}>{"<<<"}</Button>
            <Button onClick={() => changeMonth(-1)} disabled={prevMonthDisabled}>{"<<"}</Button>
            <Button onClick={() => changeDate(-1)} disabled={prevDayDisabled}>{"<"}</Button>
            <DatePicker
              selected={new Date(currencyTime)}
              onChange={(date) =>
                handleDateSelection({
                  target: { value: date.toISOString().slice(0, 10) },
                })
              }
              maxDate={new Date()}
              minDate={new Date(MIN_DATE)}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              dropdownMode="select"
              inputReadOnly
              onFocus={(e) => e.target.blur()}
              withPortal={isMobile}
            />
            <Button onClick={() => changeDate(1)} disabled={nextDayDisabled}>
              {">"}
            </Button>
            <Button onClick={() => changeMonth(1)} disabled={nextMonthDisabled}>
              {">>"}
            </Button>
            <Button onClick={() => changeYear(1)} disabled={nextYearDisabled}>
              {">>>"}
            </Button>
          </div>
          {compareTime && (
            <div className="dateNavigator">
              <Button onClick={() => changeCompareYear(-1)} disabled={comparePrevYearDisabled}>{"<<<"}</Button>
              <Button onClick={() => changeCompareMonth(-1)} disabled={comparePrevMonthDisabled}>{"<<"}</Button>
              <Button onClick={() => changeCompareDate(-1)} disabled={comparePrevDayDisabled}>{"<"}</Button>
              <DatePicker
                selected={new Date(compareTime)}
                onChange={(date) =>
                  setCompareTime(date.toISOString().slice(0, 10))
                }
                maxDate={new Date()}
                minDate={new Date(MIN_DATE)}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                dropdownMode="select"
                inputReadOnly
                onFocus={(e) => e.target.blur()}
                withPortal={isMobile}
              />
              <Button onClick={() => changeCompareDate(1)} disabled={compareNextDayDisabled}>
                {">"}
              </Button>
              <Button onClick={() => changeCompareMonth(1)} disabled={compareNextMonthDisabled}>
                {">>"}
              </Button>
              <Button onClick={() => changeCompareYear(1)} disabled={compareNextYearDisabled}>
                {">>>"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="dateRow">
          <DatePicker
            selected={new Date(currencyTime)}
            onChange={(date) =>
              handleDateSelection({
                target: { value: date.toISOString().slice(0, 10) },
              })
            }
            maxDate={new Date()}
            minDate={new Date(MIN_DATE)}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            dropdownMode="select"
            inputReadOnly
            onFocus={(e) => e.target.blur()}
            withPortal={isMobile}
          />
          {compareTime && (
            <DatePicker
              selected={new Date(compareTime)}
              onChange={(date) =>
                setCompareTime(date.toISOString().slice(0, 10))
              }
              maxDate={new Date()}
              minDate={new Date(MIN_DATE)}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              dropdownMode="select"
              inputReadOnly
              onFocus={(e) => e.target.blur()}
              withPortal={isMobile}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Currency;
