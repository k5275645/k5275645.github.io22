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

  temp.forEach((item) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");

    td1.innerHTML = item.market;
    td2.innerHTML = item.korean_name;
    td3.innerHTML = item.english_name;
    getPrice(item.market);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    marketTableBody.appendChild(tr);
  });
}

// let timer = setInterval(() => {
//   //clearInterval(timer);
//   console.log("aa");
// }, 1000);

async function getPrice(market) {
  // temp.forEach((item) => {
  //   console.log(item.market);
  // });
  let aa = await fetch(
    `https://api.upbit.com/v1/ticker?markets=${market}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      data.forEach((i) => {
        const td4 = document.createElement("tr");
        const td5 = document.createElement("tr");
        const td6 = document.createElement("tr");
        const td7 = document.createElement("tr");
        td4.innerHTML = i.opening_price;
        td5.innerHTML = i.high_price;
        td6.innerHTML = i.low_price;
        td7.innerHTML = i.trade_price;
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
      });
    })
    .catch((err) => console.error(err));
}

function marketInfoLoad() {
  fetch("https://api.upbit.com/v1/market/all?isDetails=false", options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((item) => {
        if (item.market.split("-")[0] === "KRW") {
          KRW.push(item);
        } else if (item.market.split("-")[0] === "BTC") {
          BTC.push(item);
        } else if (item.market.split("-")[0] === "USDT") {
          USDT.push(item);
        }
      });
    })
    .catch((err) => console.error(err));
}

krwBtn.addEventListener("click", appendItem);
btcBtn.addEventListener("click", appendItem);
usdtBtn.addEventListener("click", appendItem);

function init() {
  marketInfoLoad();
}

init();
