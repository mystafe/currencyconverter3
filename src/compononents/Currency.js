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

function Currency() {
  const [firstCurrency, setFirstCurrency] = useState("USD");
  const [secondCurrency, setSecondCurrency] = useState("TRY");
  const [currencyRate, setCurrencyRate] = useState(0);
  const [firstAmount, setFirstAmount] = useState(1);
  const [secondAmount, setSecondAmount] = useState(0);
  const [currencyTime, setCurrencyTime] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const handleFirstCurrencySelection = (e) => {
    setFirstCurrency(e.target.value);
  };
  const handleSecondCurrencySelection = (e) => {
    setSecondCurrency(e.target.value);
  };

  const handleDateSelection = (e) => {
    setCurrencyTime(e.target.value);
    if (currencyTime < "2005-01-01") {
      if (firstCurrency === "TRY") setFirstCurrency("TRL");
      if (secondCurrency === "TRY") setSecondCurrency("TRL");
    } else if (currencyTime >= "2005-01-01") {
      if (firstCurrency === "TRL") setFirstCurrency("TRY");
      if (secondCurrency === "TRL") setSecondCurrency("TRY");
    }
  };

  useEffect(() => {
    const fetchRate = async () => {
      try {
        if (firstCurrency === "USD" && secondCurrency === "AED") {
          const rate = 3.6725;
          setCurrencyRate(rate);
          setSecondAmount((firstAmount * rate).toFixed(4));
          return;
        }
        if (firstCurrency === "AED" && secondCurrency === "USD") {
          const rate = 1 / 3.6725;
          setCurrencyRate(rate);
          setSecondAmount((firstAmount * rate).toFixed(4));
          return;
        }
        if (firstCurrency === "AED") {
          const resp = await fetch(
            `https://api.frankfurter.app/${currencyTime}?from=USD&to=${secondCurrency}`
          );
          if (!resp.ok) throw new Error("Request failed!");
          const data = await resp.json();
          const usdToSecond = data.rates[secondCurrency];
          const rate = (1 / 3.6725) * usdToSecond;
          setCurrencyRate(rate);
          setSecondAmount((firstAmount * rate).toFixed(4));
          return;
        }
        if (secondCurrency === "AED") {
          const resp = await fetch(
            `https://api.frankfurter.app/${currencyTime}?from=${firstCurrency}&to=USD`
          );
          if (!resp.ok) throw new Error("Request failed!");
          const data = await resp.json();
          const firstToUsd = data.rates["USD"];
          const rate = firstToUsd * 3.6725;
          setCurrencyRate(rate);
          setSecondAmount((firstAmount * rate).toFixed(4));
          return;
        }

        const response = await fetch(
          `https://api.frankfurter.app/${currencyTime}?from=${firstCurrency}&to=${secondCurrency}`
        );
        if (!response.ok) throw new Error("Request failed!");
        const data = await response.json();
        const rate = data.rates[secondCurrency];
        setCurrencyRate(rate);
        setSecondAmount((firstAmount * rate).toFixed(4));
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRate();
  }, [currencyTime, firstCurrency, secondCurrency]);

  const handleFirstAmountChange = (e) => {
    const value = e.target.value;
    setFirstAmount(value);
    setSecondAmount((value * currencyRate).toFixed(4));
  };

  const handleSecondAmountChange = (e) => {
    const value = e.target.value;
    setSecondAmount(value);
    setFirstAmount(currencyRate ? (value / currencyRate).toFixed(4) : 0);
  };

  console.log("firstCurrency", firstCurrency);
  console.log("secondCurrency", secondCurrency);
  console.log("currencyRate", currencyRate);
  console.log("currencyTime", currencyTime);

  return (
    <div className="currencyDiv">
      <h1>💰Currency Calculator</h1>
      <div className="currencySelection">
        <div className="dropdown">
          <div className="currencyRow">
            <input
              type="number"
              value={firstAmount}
              onChange={handleFirstAmountChange}
            />
            <select
              id="currency-select-from"
              value={firstCurrency}
              onChange={(e) => handleFirstCurrencySelection(e)}
            >
              {currencyCodes.map((code) => (
                <option key={code} value={code}>
                  {`${getSymbol(code)} (${code})`}
                </option>
              ))}
            </select>
          </div>
          <div className="currencyRow">
            <input
              type="number"
              value={secondAmount}
              onChange={handleSecondAmountChange}
            />
            <select
              id="currency-select-to"
              value={secondCurrency}
              onChange={(e) => handleSecondCurrencySelection(e)}
            >
              {currencyCodes.map((code) => (
                <option key={code} value={code}>
                  {`${getSymbol(code)} (${code})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <input
        type="date"
        name="oldDateOther"
        id="oldDateOther"
        defaultValue={new Date().toISOString().slice(0, 10)}
        onChange={(e) => handleDateSelection(e)}
      />
      <p>
        1 {getSymbol(firstCurrency)} ({firstCurrency}) = <span id="currencyRateText" />
        <strong>{currencyRate}</strong> {getSymbol(secondCurrency)} ({secondCurrency})
      </p>
    </div>
  );
}

export default Currency;
