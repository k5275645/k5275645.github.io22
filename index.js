const container = document.querySelector(".container");
const krwBtn = document.querySelector(".KRW");
const btcBtn = document.querySelector(".BTC");
const usdtBtn = document.querySelector(".USDT");

const marketTable = document.querySelector(".market-table");
const marketTableBody = marketTable.querySelector("tbody");

const options = { method: "GET" };

let KRW = [];
let BTC = [];
let USDT = [];
let markets = [];
let tempPriceInfo = [];

//clearInterval(timer);

async function getItems(mf) {
  const getResponse = await fetch(
    `https://api.upbit.com/v1/ticker?markets=${mf}`,
    options
  );
  const get = await getResponse.json();
  const tikerInfo = await get[0];
  return tikerInfo;
}

function getPrice() {
  let flagNum = -1;
  let timer = setInterval(() => {
    for (i = 0; i < 10; i++) {
      flagNum > markets.length - 2 ? (flagNum = 0) : flagNum++;
      const td4 = document.createElement("td");
      const td5 = document.createElement("td");
      const td6 = document.createElement("td");
      const td7 = document.createElement("td");
      tempPriceInfo.length = 0;
      getItems(markets[flagNum]).then((res) => {
        tempPriceInfo.push(res);
        td4.innerHTML = res.opening_price;
        td5.innerHTML = res.high_price;
        td6.innerHTML = res.low_price;
        td7.innerHTML = res.trade_price;
      });
      //console.log(tempPriceInfo);
      marketTableBody.childNodes[flagNum].appendChild(td4);
      marketTableBody.childNodes[flagNum].appendChild(td5);
      marketTableBody.childNodes[flagNum].appendChild(td6);
      marketTableBody.childNodes[flagNum].appendChild(td7);
      // if (marketTableBody.childNodes[flagNum].childNodes[3]) {
      //   marketTableBody.childNodes[flagNum].removeChild(
      //     marketTableBody.childNodes[flagNum].childNodes[3]
      //   );
      // }
      // marketTableBody.childNodes[flagNum].appendChild(td4);
      // if (marketTableBody.childNodes[flagNum].childNodes[4]) {
      //   marketTableBody.childNodes[flagNum].removeChild(
      //     marketTableBody.childNodes[flagNum].childNodes[4]
      //   );
      // }
      // marketTableBody.childNodes[flagNum].appendChild(td5);
      // if (marketTableBody.childNodes[flagNum].childNodes[5]) {
      //   marketTableBody.childNodes[flagNum].removeChild(
      //     marketTableBody.childNodes[flagNum].childNodes[5]
      //   );
      // }
      // marketTableBody.childNodes[flagNum].appendChild(td6);
      // if (marketTableBody.childNodes[flagNum].childNodes[6]) {
      //   marketTableBody.childNodes[flagNum].removeChild(
      //     marketTableBody.childNodes[flagNum].childNodes[6]
      //   );
      // }
      // marketTableBody.childNodes[flagNum].appendChild(td7);

      // console.log(marketTableBody.childNodes[flagNum].childNodes);
    }
  }, 1000);
}

function appendItem(e) {
  let temp;
  if (e.target.classList.value === "KRW") {
    temp = KRW;
  } else if (e.target.classList.value === "BTC") {
    temp = BTC;
  } else if (e.target.classList.value === "USDT") {
    temp = USDT;
  }
  while (marketTableBody.hasChildNodes()) {
    marketTableBody.removeChild(marketTableBody.childNodes[0]);
  }

  markets.length = 0;
  temp.forEach((item) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");

    markets.push(item.market);
    td1.innerHTML = item.market;
    td2.innerHTML = item.korean_name;
    td3.innerHTML = item.english_name;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    marketTableBody.appendChild(tr);
  });
  getPrice();
}

krwBtn.addEventListener("click", appendItem);
btcBtn.addEventListener("click", appendItem);
usdtBtn.addEventListener("click", appendItem);

function marketInfoLoad() {
  fetch("https://api.upbit.com/v1/market/all?isDetails=false", options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((item) => {
        let splitMarket = item.market.split("-");
        if (splitMarket[0] === "KRW") {
          KRW.push(item);
        } else if (splitMarket[0] === "BTC") {
          BTC.push(item);
        } else if (splitMarket[0] === "USDT") {
          USDT.push(item);
        }
      });
    })
    .catch((err) => console.error(err));
}

function init() {
  marketInfoLoad();
}

init();
