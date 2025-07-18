/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

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

function Currency() {
  const [currencies, setCurrencies] = useState([
    { code: "USD", amount: 1, rate: 1 },
    { code: "TRY", amount: 0, rate: 0 },
  ]);
  const [currencyTime, setCurrencyTime] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [showAdd, setShowAdd] = useState(false);

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

  const codesList = currencies.slice(1).map((c) => c.code).join();
  useEffect(() => {
    const updateRates = async () => {
      try {
        const base = currencies[0];
        const updated = await Promise.all(
          currencies.map(async (c, idx) => {
            if (idx === 0) return { ...c, rate: 1, amount: base.amount };
            const rate = await fetchRate(base.code, c.code, currencyTime);
            return { ...c, rate, amount: (base.amount * rate).toFixed(4) };
          })
        );
        setCurrencies(updated);
      } catch (err) {
        console.log(err.message);
      }
    };
    updateRates();
  }, [currencyTime, currencies[0].code, currencies[0].amount, codesList]);

  const handleBaseAmountChange = (e) => {
    const value = e.target.value;
    setCurrencies((prev) =>
      prev.map((c, idx) =>
        idx === 0 ? { ...c, amount: value } : { ...c, amount: (value * c.rate).toFixed(4) }
      )
    );
  };

  const handleTargetAmountChange = (index, value) => {
    setCurrencies((prev) => {
      const rate = prev[index].rate;
      const baseAmount = rate ? (value / rate).toFixed(4) : 0;
      return prev.map((c, idx) =>
        idx === 0
          ? { ...c, amount: baseAmount }
          : { ...c, amount: (idx === index ? value : (baseAmount * c.rate).toFixed(4)), rate: c.rate }
      );
    });
  };

  const handleCurrencyChange = (index, code) => {
    setCurrencies((prev) =>
      prev.map((c, idx) => (idx === index ? { ...c, code } : c))
    );
  };

  return (
    <div className="currencyDiv">
      <h1>💰Currency Calculator</h1>
      <div className="currencySelection">
        <div className="dropdown">
          {currencies.map((c, idx) => (
            <div className="currencyRow" key={idx}>
              <input
                type="number"
                value={c.amount}
                onChange={(e) =>
                  idx === 0
                    ? handleBaseAmountChange(e)
                    : handleTargetAmountChange(idx, e.target.value)
                }
              />
              <select
                value={c.code}
                onChange={(e) => handleCurrencyChange(idx, e.target.value)}
              >
                {currencyCodes.map((code) => (
                  <option key={code} value={code}>
                    {`${getSymbol(code)} (${code})`}
                  </option>
                ))}
              </select>
              {idx > 0 && currencies.length >= 3 && (
                <span
                  className="minusIcon"
                  onClick={() => {
                    if (window.confirm("Remove currency?")) {
                      setCurrencies((prev) => prev.filter((_, i) => i !== idx));
                    }
                  }}
                >
                  ➖
                </span>
              )}
            </div>
          ))}
          {showAdd && (
            <select
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
            </select>
          )}
        </div>
      </div>
      <input
        type="date"
        name="oldDateOther"
        id="oldDateOther"
        defaultValue={new Date().toISOString().slice(0, 10)}
        onChange={(e) => handleDateSelection(e)}
      />
      {currencies.length > 1 && (
        <p>
          1 {getSymbol(currencies[0].code)} ({currencies[0].code}) ={' '}
          <strong>{currencies[1].rate}</strong> {getSymbol(currencies[1].code)} ({currencies[1].code})
        </p>
      )}
      {currencies.length < 6 && (
        <div className="plusIcon" onClick={() => setShowAdd(!showAdd)}>
          ➕
        </div>
      )}
    </div>
  );
}

export default Currency;
