// 변수 세팅
const container = document.querySelector(".container");
const krwBtn = document.querySelector(".KRW");
const btcBtn = document.querySelector(".BTC");
const usdtBtn = document.querySelector(".USDT");

const marketTable = document.querySelector(".market-table");
const marketTableBody = marketTable.querySelector("tbody");
const interestTable = document.querySelector(".interest-table");
const interestTableBody = interestTable.querySelector("tbody");

const options = { method: "GET" };

let KRW = [];
let BTC = [];
let USDT = [];
let markets = [];
marketTable.style.display = "none";
interestTable.style.display = "none";

//clearInterval(timer);

// 회계식 표현 정규식
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 관심목록 추가/제거
function addInterestList(e) {
  let cloneItem = e.path[1].cloneNode(true);
  cloneItem.firstChild.disabled = true;

  if (e.path[0].checked) {
    interestTableBody.appendChild(cloneItem);
  } else {
    interestTableBody.childNodes.forEach((item) => {
      if (e.path[1].id === item.id) {
        interestTableBody.removeChild(item);
      }
    });
  }

  interestTableBody.childNodes.length === 0
    ? (interestTable.style.display = "none")
    : (interestTable.style.display = "block");
}

// 가격정보를 가져와서 표에 뿌리기
async function getItems(mf, flagNum) {
  const getResponse = await fetch(
    `https://api.upbit.com/v1/ticker?markets=${mf}`,
    options
  );
  const get = await getResponse.json();
  const tikerInfo = await get[0];
  //console.log(tikerInfo.acc_trade_price);
  //console.log(tikerInfo.acc_trade_volume_24h);
  marketTableBody.childNodes[
    flagNum
  ].childNodes[2].innerText = numberWithCommas(tikerInfo.opening_price);
  marketTableBody.childNodes[
    flagNum
  ].childNodes[3].innerText = numberWithCommas(tikerInfo.high_price);
  marketTableBody.childNodes[
    flagNum
  ].childNodes[4].innerText = numberWithCommas(tikerInfo.low_price);
  marketTableBody.childNodes[
    flagNum
  ].childNodes[5].innerText = numberWithCommas(tikerInfo.trade_price);
  marketTableBody.childNodes[flagNum].childNodes[6].innerText =
    ((tikerInfo.trade_price / tikerInfo.opening_price - 1) * 100).toFixed(2) +
    "%";

  marketTableBody.childNodes[
    flagNum
  ].childNodes[7].innerText = numberWithCommas(
    tikerInfo.acc_trade_price_24h.toFixed()
  );

  if (tikerInfo.opening_price < tikerInfo.trade_price) {
    marketTableBody.childNodes[flagNum].childNodes[5].style.color = "red";
    marketTableBody.childNodes[flagNum].childNodes[6].style.color = "red";
  } else if (tikerInfo.opening_price > tikerInfo.trade_price) {
    marketTableBody.childNodes[flagNum].childNodes[5].style.color = "blue";
    marketTableBody.childNodes[flagNum].childNodes[6].style.color = "blue";
  }
}

// 실시간으로 가격정보 가져오기(초당 10개 limit)
function getPrice() {
  let flagNum = -1;
  let timer = setInterval(() => {
    for (i = 0; i < 10; i++) {
      flagNum > markets.length - 2 ? (flagNum = 0) : flagNum++;
      getItems(markets[flagNum], flagNum);
    }
  }, 1000);
}

// 마켓별 정보를 출력할 표 세팅
function appendItem(e) {
  marketTable.style.display = "block";
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
  temp.forEach((item, index) => {
    const tr = document.createElement("tr");
    const trId = index;
    const checkBox = document.createElement("input");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");
    const td6 = document.createElement("td");
    const td7 = document.createElement("td");

    checkBox.type = "checkBox";
    checkBox.addEventListener("change", addInterestList);

    markets.push(item.market);
    td1.innerHTML = item.korean_name;
    tr.id = trId;
    tr.appendChild(checkBox);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);

    marketTableBody.appendChild(tr);
  });
  getPrice();
}

krwBtn.addEventListener("click", appendItem);
btcBtn.addEventListener("click", appendItem);
usdtBtn.addEventListener("click", appendItem);

// 모든 코인 이름 가져오기
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

// 시작
function init() {
  marketInfoLoad();
}

init();
