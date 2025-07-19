/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
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

function Currency({ isSuper }) {
  const [currencies, setCurrencies] = useState([
    { code: "USD", amount: 1, rate: 1 },
    { code: "TRY", amount: 0, rate: 0 },
    { code: "AED", amount: 0, rate: 0 },
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const [currencyTime, setCurrencyTime] = useState(today);
  const [showAdd, setShowAdd] = useState(false);
  const [baseIndex, setBaseIndex] = useState(0);

  const nextDayDisabled = currencyTime >= today;
  const nextMonthDisabled = (() => {
    const d = new Date(currencyTime);
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10) > today;
  })();
  const nextYearDisabled = (() => {
    const d = new Date(currencyTime);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10) > today;
  })();

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
    if (newDate > today) return;
    handleDateSelection({ target: { value: newDate } });
  };

  const changeYear = (years) => {
    const d = new Date(currencyTime);
    d.setFullYear(d.getFullYear() + years);
    const newDate = d.toISOString().slice(0, 10);
    if (newDate > today) return;
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
    setCurrencies((prev) => {
      const baseAmountOld = prev[index].rate ? value / prev[index].rate : value;
      return prev.map((c, idx) =>
        idx === index
          ? { ...c, amount: value }
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
      <h1>💰Currency Calculator</h1>
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
                <Form.Control
                  type="number"
                  value={c.amount}
                  onFocus={() => setBaseIndex(idx)}
                  onChange={(e) => handleAmountChange(idx, e.target.value)}
                />
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
      {currencies.length < 6 && (
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
          <Form.Control
            type="date"
            name="oldDateOther"
            id="oldDateOther"
            value={currencyTime}
            max={today}
            onChange={(e) => handleDateSelection(e)}
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
        <Form.Control
          type="date"
          name="oldDateOther"
          id="oldDateOther"
          value={currencyTime}
          max={today}
          onChange={(e) => handleDateSelection(e)}
        />
      )}
    </div>
  );
}

export default Currency;
