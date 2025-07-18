import { useEffect, useState } from "react";

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
            <option value="AUD">AUD (Australian Dollar)</option>
            <option value="BGN">BGN (Bulgarian Lev)</option>
            <option value="BRL">BRL (Brazilian Real)</option>
            <option value="CAD">CAD (Canadian Dollar)</option>
            <option value="CHF">CHF (Swiss Franc)</option>
            <option value="CNY">CNY (Chinese Renminbi Yuan)</option>
            <option value="CZK">CZK (Czech Koruna)</option>
            <option value="DKK">DKK (Danish Krone)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
            <option value="HKD">HKD (Hong Kong Dollar)</option>
            <option value="HUF">HUF (Hungarian Forint)</option>
            <option value="IDR">IDR (Indonesian Rupiah)</option>
            <option value="ILS">ILS (Israeli New Sheqel)</option>
            <option value="INR">INR (Indian Rupee)</option>
            <option value="ISK">ISK (Icelandic Króna)</option>
            <option value="JPY">JPY (Japanese Yen)</option>
            <option value="KRW">KRW (South Korean Won)</option>
            <option value="MXN">MXN (Mexican Peso)</option>
            <option value="MYR">MYR (Malaysian Ringgit)</option>
            <option value="NOK">NOK (Norwegian Krone)</option>
            <option value="NZD">NZD (New Zealand Dollar)</option>
            <option value="PHP">PHP (Philippine Peso)</option>
            <option value="PLN">PLN (Polish Złoty)</option>
            <option value="RON">RON (Romanian Leu)</option>
            <option value="SEK">SEK (Swedish Krona)</option>
            <option value="SGD">SGD (Singapore Dollar)</option>
            <option value="THB">THB (Thai Baht)</option>
            <option value="TRY">TRY (Turkish Lira)</option>
            <option value="USD">USD (United States Dollar)</option>
            <option value="ZAR">ZAR (South African Rand)</option>
          </select>
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
            <option value="AUD">AUD (Australian Dollar)</option>
            <option value="BGN">BGN (Bulgarian Lev)</option>
            <option value="BRL">BRL (Brazilian Real)</option>
            <option value="CAD">CAD (Canadian Dollar)</option>
            <option value="CHF">CHF (Swiss Franc)</option>
            <option value="CNY">CNY (Chinese Renminbi Yuan)</option>
            <option value="CZK">CZK (Czech Koruna)</option>
            <option value="DKK">DKK (Danish Krone)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
            <option value="HKD">HKD (Hong Kong Dollar)</option>
            <option value="HUF">HUF (Hungarian Forint)</option>
            <option value="IDR">IDR (Indonesian Rupiah)</option>
            <option value="ILS">ILS (Israeli New Sheqel)</option>
            <option value="INR">INR (Indian Rupee)</option>
            <option value="ISK">ISK (Icelandic Króna)</option>
            <option value="JPY">JPY (Japanese Yen)</option>
            <option value="KRW">KRW (South Korean Won)</option>
            <option value="MXN">MXN (Mexican Peso)</option>
            <option value="MYR">MYR (Malaysian Ringgit)</option>
            <option value="NOK">NOK (Norwegian Krone)</option>
            <option value="NZD">NZD (New Zealand Dollar)</option>
            <option value="PHP">PHP (Philippine Peso)</option>
            <option value="PLN">PLN (Polish Złoty)</option>
            <option value="RON">RON (Romanian Leu)</option>
            <option value="SEK">SEK (Swedish Krona)</option>
            <option value="SGD">SGD (Singapore Dollar)</option>
            <option value="THB">THB (Thai Baht)</option>
            <option value="TRY">TRY (Turkish Lira)</option>
            <option value="USD">USD (United States Dollar)</option>
            <option value="ZAR">ZAR (South African Rand)</option>
          </select>
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
        1 {firstCurrency} = <span id="currencyRateText" />
        <strong>{currencyRate}</strong> {secondCurrency}
      </p>
    </div>
  );
}

export default Currency;
