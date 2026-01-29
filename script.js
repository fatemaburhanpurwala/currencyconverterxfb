 /************** CONFIG **************/
const API_KEY = "e85418d0004e35d93d4af395";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

/************** ELEMENTS **************/
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const resultText = document.getElementById("result");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

/************** LOAD CURRENCIES **************/
async function loadCurrencies() {
  const res = await fetch(`${API_URL}/codes`);
  const data = await res.json();

  data.supported_codes.forEach(currency => {
    const option1 = document.createElement("option");
    option1.value = currency[0];
    option1.textContent = `${currency[0]} - ${currency[1]}`;

    const option2 = option1.cloneNode(true);

    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
  });

  fromSelect.value = "USD";
  toSelect.value = "INR";
  updateFlags();
}

/************** UPDATE FLAGS **************/
function updateFlags() {
  fromFlag.src = `https://flagsapi.com/${fromSelect.value.slice(0,2)}/flat/64.png`;
  toFlag.src = `https://flagsapi.com/${toSelect.value.slice(0,2)}/flat/64.png`;
}

/************** SWAP CURRENCIES (FIX) **************/
function swapCurrencies() {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  updateFlags();
  convertCurrency(); // swap ke baad auto convert
}

/************** CONVERT **************/
async function convertCurrency() {
  const amount = amountInput.value;
  if (amount === "" || amount <= 0) {
    resultText.innerText = "Please enter valid amount";
    return;
  }

  const res = await fetch(`${API_URL}/latest/${fromSelect.value}`);
  const data = await res.json();

  const rate = data.conversion_rates[toSelect.value];
  const converted = (amount * rate).toFixed(2);

  resultText.innerText = `${amount} ${fromSelect.value} = ${converted} ${toSelect.value}`;
}

/************** EVENTS **************/
fromSelect.addEventListener("change", updateFlags);
toSelect.addEventListener("change", updateFlags);

/************** INIT **************/
loadCurrencies();
