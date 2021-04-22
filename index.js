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

//clearInterval(timer);

async function getItems(mf, flagNum) {
  const getResponse = await fetch(
    `https://api.upbit.com/v1/ticker?markets=${mf}`,
    options
  );
  const get = await getResponse.json();
  const tikerInfo = await get[0];
  marketTableBody.childNodes[flagNum].childNodes[4].innerText =
    tikerInfo.opening_price;
  marketTableBody.childNodes[flagNum].childNodes[5].innerText =
    tikerInfo.high_price;
  marketTableBody.childNodes[flagNum].childNodes[6].innerText =
    tikerInfo.low_price;
  marketTableBody.childNodes[flagNum].childNodes[7].innerText =
    tikerInfo.trade_price;
  marketTableBody.childNodes[flagNum].childNodes[8].innerText =
    tikerInfo.trade_price / tikerInfo.opening_price;

  if (tikerInfo.opening_price < tikerInfo.trade_price) {
    marketTableBody.childNodes[flagNum].childNodes[7].style.color = "red";
    marketTableBody.childNodes[flagNum].childNodes[8].style.color = "red";
  } else if (tikerInfo.opening_price > tikerInfo.trade_price) {
    marketTableBody.childNodes[flagNum].childNodes[7].style.color = "blue";
    marketTableBody.childNodes[flagNum].childNodes[8].style.color = "blue";
  }
}

function getPrice() {
  let flagNum = -1;
  let timer = setInterval(() => {
    for (i = 0; i < 10; i++) {
      flagNum > markets.length - 2 ? (flagNum = 0) : flagNum++;
      getItems(markets[flagNum], flagNum);
    }
  }, 1000);
}

function addInterestList(e) {}

function appendItem(e) {
  //location.reload();
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
    const checkBox = document.createElement("input");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");
    const td6 = document.createElement("td");
    const td7 = document.createElement("td");
    const td8 = document.createElement("td");
    checkBox.type = "checkBox";
    checkBox.addEventListener("click", (e) => {});

    markets.push(item.market);
    td1.innerHTML = item.market;
    td2.innerHTML = item.korean_name;
    td3.innerHTML = item.english_name;
    tr.appendChild(checkBox);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);

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
