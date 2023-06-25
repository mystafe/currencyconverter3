let currentRate = 23.311351;

const getUsdCurrency = async function () {
  let dollarCurrency = null;
  const API_KEY = "c512c4492d76c175cba76489bee946b0";
  const baseUrl = "http://api.exchangeratesapi.io/v1";
  const access_key = API_KEY;
  const myprom = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      baseUrl + "/latest?" + "access_key=" + access_key + "&symbols=TRY,USD"
    );

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject({ Error: xhr.status, Message: xhr.responseText });
      }
    };
    xhr.send();
  });
  return myprom
    .then((data) => {
      const newdata = JSON.parse(data);
      dollarCurrency = +(newdata.rates.TRY / newdata.rates.USD).toFixed(6);
      let dollarTime = new Date(newdata.timestamp * 1000);
      dollarTime = dollarTime.toString().slice(0, 24);

      const dollarFixed = dollarCurrency.toFixed(5);
      const currencyRate = document.getElementById("currencyRate");
      const currencyTime = document.getElementById("currencyTime");
      currencyRate.innerHTML = dollarFixed;
      console.log("test:", dollarCurrency.toFixed(5));
      currencyTime.innerHTML = dollarTime;
      return dollarCurrency;
    })
    .catch((message) => {
      console.error(message);
    })
    .finally(() => {
      console.log("CurrentFromUsd", currentRate);
    });
};

const findHistorical = () => {
  const oldDate = document.getElementById("oldDate").value;
  console.log(oldDate);

  const myOldProm = new Promise((resolve, reject) => {
    const API_KEY = "c512c4492d76c175cba76489bee946b0";
    const url = "http://api.exchangeratesapi.io/v1/" + oldDate;
    const access_key = API_KEY;
    const symbols = "USD,TRY";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url + "?access_key=" + access_key + "&symbols=" + symbols);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject({ Error: xhr.status, Message: xhr.responseText });
      }
    };
    xhr.send();
  });
  myOldProm
    .then((data) => {
      const olddata = JSON.parse(data);
      console.log(olddata.rates);
      const currencyRateOld = document.getElementById("currencyRateOld");
      const currencyTimeOld = document.getElementById("currencyTimeOld");
      currencyRateOld.innerHTML = (
        olddata.rates.TRY / olddata.rates.USD
      ).toFixed(5);
      currencyTimeOld.innerHTML = olddata.date;
      console.log(olddata.rates.USD);
      console.log(olddata.date);
    })
    .catch((message) => {
      console.error(message);
    });
};

async function updateRate(newRate) {
  console.log("new rate from update: ", newRate);

  const rateElement = document.getElementById("currencyRate");
  const currencyIncrease = document.getElementById("currencyIncrease");
  if (currentRate !== null) {
    currencyIncrease.classList.remove("decrease");
    currencyIncrease.classList.remove("increase");
    if (newRate > currentRate) {
      currencyIncrease.classList.add("increase");
      currencyIncrease.textContent =
        " 🔼 " + (newRate - currentRate).toFixed(4);

      setTimeout(() => {
        currencyIncrease.classList.remove("decrease");
        currencyIncrease.classList.remove("increase");
        currencyIncrease.textContent = "";
      }, 15000);
    } else if (newRate < currentRate) {
      currencyIncrease.classList.add("decrease");
      currencyIncrease.textContent =
        " 🔽 " + (newRate - currentRate).toFixed(4);

      setTimeout(() => {
        currencyIncrease.classList.remove("decrease");
        currencyIncrease.classList.remove("increase");
        currencyIncrease.textContent = "";
      }, 15000);
    }
  }
  currentRate = newRate;
  rateElement.textContent = newRate;
}

const getUsdCurrencyBtn = document.getElementById("getUsdCurrencyBtn");

getUsdCurrencyBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await getUsdCurrency().then((data) => {
    console.log("getUsd'den gelen", data);
    updateRate(data);
  });
});

getCurrency = async function () {
  let otherCurrency = null;
  const currencyBase = document.getElementById("currency-select").value;
  console.log(currencyBase);
  const API_KEY = "c512c4492d76c175cba76489bee946b0";
  const baseUrl = "http://api.exchangeratesapi.io/v1";
  const access_key = API_KEY;
  const myprom = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl + "/latest?" + "access_key=" + access_key);

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject({ Error: xhr.status, Message: xhr.responseText });
      }
    };
    xhr.send();
  });
  return myprom
    .then((data) => {
      const newdata = JSON.parse(data);
      otherCurrency = +(
        newdata.rates.TRY / newdata.rates[currencyBase]
      ).toFixed(6);
      let currencyOtherTime = new Date(newdata.timestamp * 1000);
      currencyOtherTime = currencyOtherTime.toString().slice(0, 24);

      const currencyRate = document.getElementById("currencyRateOther");
      const currencyTime = document.getElementById("currencyTimeOther");
      currencyRate.innerHTML = otherCurrency;
      currencyTime.innerHTML = currencyOtherTime;
      return otherCurrency;
    })
    .catch((message) => {
      console.error(message);
    })
    .finally(() => {
      console.log("CurrentFromOtherCurrency", currentRate);
    });
};

const findHistoricalCurrency = () => {
  const oldDate = document.getElementById("oldDateOther").value;
  const baseCurrency = document.getElementById("currency-select-old").value;
  console.log(oldDate);
  console.log(baseCurrency);
  const myOldProm = new Promise((resolve, reject) => {
    const API_KEY = "c512c4492d76c175cba76489bee946b0";
    const url = "http://api.exchangeratesapi.io/v1/" + oldDate;
    const access_key = API_KEY;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url + "?access_key=" + access_key);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject({ Error: xhr.status, Message: xhr.responseText });
      }
    };
    xhr.send();
  });
  myOldProm
    .then((data) => {
      const olddata = JSON.parse(data);
      console.log(olddata.rates);
      const currencyRateOld = document.getElementById("currencyRateOtherOld");
      const currencyTimeOld = document.getElementById("currencyTimeOtherOld");
      currencyRateOld.innerHTML = +(
        olddata.rates.TRY / olddata.rates[baseCurrency]
      ).toFixed(6);
      currencyTimeOld.innerHTML = olddata.date;
    })
    .catch((message) => {
      console.error(message);
    });
};

getUsdCurrency();
findHistorical();
getCurrency();
findHistoricalCurrency();
