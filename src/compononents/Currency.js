/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
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
  TRL: "₺",
  USD: "$",
  ZAR: "R",
  AED: "د.إ",
};

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
  "TRL",
];

const getSymbol = (code) => currencySymbols[code] || code;

const fetchRate = async (from, to, date) => {
  if (from === to) return 1;
  if (from === "USD" && to === "AED") return 3.6725;
  if (from === "AED" && to === "USD") return 1 / 3.6725;
  if (from === "AED") {
    const resp = await fetch(
      `https://api.frankfurter.app/${date}?from=USD&to=${to}`
    );
    if (!resp.ok) throw new Error("Request failed!");
    const data = await resp.json();
    const usdToSecond = data.rates[to];
    return (1 / 3.6725) * usdToSecond;
  }
  if (to === "AED") {
    const resp = await fetch(
      `https://api.frankfurter.app/${date}?from=${from}&to=USD`
    );
    if (!resp.ok) throw new Error("Request failed!");
    const data = await resp.json();
    const firstToUsd = data.rates["USD"];
    return firstToUsd * 3.6725;
  }
  const response = await fetch(
    `https://api.frankfurter.app/${date}?from=${from}&to=${to}`
  );
  if (!response.ok) throw new Error("Request failed!");
  const data = await response.json();
  return data.rates[to];
};

function Currency({ isSuper, onTitleClick }) {
  const [currencies, setCurrencies] = useState([
    { code: "USD", amount: 1, rate: 1 },
    { code: "TRY", amount: 0, rate: 0 },
    { code: "AED", amount: 0, rate: 0 },
    { code: "EUR", amount: 0, rate: 0 },
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const [currencyTime, setCurrencyTime] = useState(today);
  const [showAdd, setShowAdd] = useState(false);
  const [baseIndex, setBaseIndex] = useState(0);

  const nextDayDisabled = currencyTime >= today;
  const nextMonthDisabled = currencyTime >= today;
  const nextYearDisabled = currencyTime >= today;

  const changeDate = (days) => {
    const d = new Date(currencyTime);
    d.setDate(d.getDate() + days);
    const newDate = d.toISOString().slice(0, 10);
    if (newDate > today) return;
    handleDateSelection({ target: { value: newDate } });
  };

  const changeMonth = (months) => {
    const d = new Date(currencyTime);
    d.setMonth(d.getMonth() + months);
    const newDate = d.toISOString().slice(0, 10);
    if (months > 0 && newDate > today) {
      handleDateSelection({ target: { value: today } });
      return;
    }
    handleDateSelection({ target: { value: newDate } });
  };

  const changeYear = (years) => {
    const d = new Date(currencyTime);
    d.setFullYear(d.getFullYear() + years);
    const newDate = d.toISOString().slice(0, 10);
    if (years > 0 && newDate > today) {
      handleDateSelection({ target: { value: today } });
      return;
    }
    handleDateSelection({ target: { value: newDate } });
  };

  const handleDateSelection = (e) => {
    const val = e.target.value;
    setCurrencyTime(val);
    setCurrencies((prev) =>
      prev.map((c, idx) => {
        if (val < "2005-01-01" && c.code === "TRY") return { ...c, code: "TRL" };
        if (val >= "2005-01-01" && c.code === "TRL") return { ...c, code: "TRY" };
        return c;
      })
    );
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
    if (window.confirm("Remove currency?")) {
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

  return (
    <div className="currencyDiv">
      <h1 onClick={onTitleClick}>Currency Calculator</h1>
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
                      {`${getSymbol(code)} (${code})`}
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
                Select currency
              </option>
              {currencyCodes
                .filter((code) => !currencies.some((c) => c.code === code))
                .map((code) => (
                  <option key={code} value={code}>
                    {`${getSymbol(code)} (${code})`}
                  </option>
                ))}
            </Form.Select>
          )}
        </div>
      </div>
      {currencies.length < 8 && (
        <Button
          variant="success"
          className="plusIcon"
          onClick={() => setShowAdd(!showAdd)}
        >
          ➕
        </Button>
      )}
      {isSuper ? (
        <div className="dateNavigator">
          <Button onClick={() => changeYear(-1)}>{"<<<"}</Button>
          <Button onClick={() => changeMonth(-1)}>{"<<"}</Button>
          <Button onClick={() => changeDate(-1)}>{"<"}</Button>
          <DatePicker
            selected={new Date(currencyTime)}
            onChange={(date) =>
              handleDateSelection({
                target: { value: date.toISOString().slice(0, 10) },
              })
            }
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
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
      ) : (
        <DatePicker
          selected={new Date(currencyTime)}
          onChange={(date) =>
            handleDateSelection({
              target: { value: date.toISOString().slice(0, 10) },
            })
          }
          maxDate={new Date()}
          dateFormat="yyyy-MM-dd"
          showYearDropdown
        />
      )}
    </div>
  );
}

export default Currency;
