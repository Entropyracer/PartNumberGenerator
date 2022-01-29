// Declarations
const inputs = document.querySelectorAll(".prefix, .suffix"),
  baseNumberInput = document.querySelector("#base__number"),
  randomCharsInput = document.querySelector("#random__characters"),
  includeLetters = document.querySelector("#letters");
let hideCopy, hideError;

// Registering sw.js as Service Worker
if ('serviceWorker' in navigator) navigator.serviceWorker.register("sw.js");

// Hiding Preloader on load
document.body.onload = () => document.body.classList.add("loaded");
// Adding Current Year to Footer
document.querySelector(".current__year").textContent = new Date().getFullYear();
AOS.init();
// Populating all Fields from Localstorage if available
populateFields();
randomCharsInput.onchange = (e) => validate(e);
includeLetters.onchange = updateRandomCharacters;
// Looping through each Input
for (i = 0; i < inputs.length; i++) {
    // Updating Output with current Values
    updateValues(inputs[i], Array.from(inputs[i].classList));

    // Validating Inputs and Updating Output on any further change to the Inputs
    inputs[i].onkeyup = (e) => {
        updateValues(e.target, Array.from(e.target.classList));
    }
    inputs[i].onchange = (e) => {
      e.target.value = e.target.value.toUpperCase();
      validate(e);
      updateValues(e.target, Array.from(e.target.classList));
    }
}

function updateTime() {
    let time = `${Date.now()}`.substring(0, 10);
    document.querySelector("#time__output .output__number").textContent = time;
}


setInterval(updateTime, 1000);

// Update Current Input Value in Output
function updateValues(input, classList) {
    let root = input.parentElement.parentElement.parentElement.parentElement.parentElement;
    if (classList.includes("prefix") || classList.includes("suffix")) {
        let identifier = classList.find(elementClass => elementClass === "prefix" || elementClass === "suffix" );
        root.querySelector(`.${identifier}__output`).textContent = input.value;
    }
}

// Update Random Characters in Output
function updateRandomCharacters() {
  let length = document.querySelector("#random__characters").value;
  document.querySelector("#generate__random .output__number").textContent = generateRandomAlphanumerics(length);
  funFact();
  updateWebStorage(); 
}

// Update Base Number in Output (Do not Increment)
function updateBaseNumber() {
  document.querySelector("#generate__sequential .output__number").textContent = baseNumberInput.value;
  updateWebStorage();
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
function incrementBaseNumber() {
    let baseNumber = `${baseNumberInput.value}`,
        i = 0;
    while (baseNumber[i] === '0') i++;
    let incremented = `${"0".repeat(i)}${BigInt(baseNumber) + 1n}`;
    while (incremented.length > baseNumber.length) {
        if (incremented[0] !== "0") break;
        incremented = incremented.substring(1);
    }
    baseNumberInput.value = incremented;
    document.querySelector("#generate__sequential .output__number").textContent = incremented;
    updateWebStorage();
}

baseNumberInput.onchange = (e) =>  {validate(e);updateBaseNumber();};
updateBaseNumber();
updateRandomCharacters();

function funFact() {
  nCharacters = document.querySelector("#random__characters").value;
  if (nCharacters <= 0 || !nCharacters) {
    includeLetters.disabled = true;
    return document.querySelector("main").classList.add("digitsDisabled");
  }
  document.querySelector(".if__letters").textContent = includeLetters.checked ? " and letters" : "";
  includeLetters.disabled = false;
  document.querySelector("main").classList.remove("digitsDisabled");
  document.querySelector(".fun__character__count").textContent = nCharacters;
  let repetitionChance =
    (includeLetters.checked
      ? 36n ** BigInt(nCharacters)
      : 10n ** BigInt(nCharacters)).toLocaleString().replace(/,/g, ',<wbr>');
  document.querySelector(".fun__total__count").innerHTML = repetitionChance;
}

funFact();

// Utility Functions
function reset(e) {
    e.querySelector(".prefix").value = '';
    e.querySelector(".suffix").value = '';
    e.parentElement.querySelector(".prefix__output").textContent = '';
    e.parentElement.querySelector(".suffix__output").textContent = '';
}

function showError(msg, input) {
    let errorDOM = input.parentElement.parentElement.parentElement.querySelector(".message");
    errorDOM.textContent = msg;
    errorDOM.classList.add("error");
    errorDOM.style.opacity = "1";
    hideError = setTimeout(() => {
      errorDOM.classList.remove("error");
      errorDOM.style.opacity = "0";
    }, 2000)
}
function copyToClipboard(button) {
  let text = '',
    recentValueDOM = button.parentElement.parentElement.querySelector(".recently__copied__text"),
    messageDOM = button.parentElement.parentElement.querySelector(".message");
    Array.from(button.previousElementSibling.children).forEach(e => text += e.textContent);
    let d = new Date(),
    date = d.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    time = d.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', second: "2-digit"});
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    messageDOM.textContent = "Copied!";
    messageDOM.style.opacity = "1";
    hideCopy = setTimeout(() => messageDOM.style.opacity = "0" , 2000);
    recentValueDOM.innerHTML = `
    <div class="recently__copied__value">${button.previousElementSibling.innerHTML}</div>
    is the most recent value copied to the clipboard at 
    <span class="recently__copied__time">${date} - ${time}</span>
    `
    updateWebStorage();
  } 
}

function validate(e) {
  if (e.target.value.length >= 10 && (e.target.classList.contains("suffix") || e.target.classList.contains("prefix"))) {
    return showError("Maximum Length can be 10", e.target)
  }
  if ((e.target.value > 30 || e.target.value < 0) && e.target.type === "number" && e.target.id === "random__characters") {
    showError("Random Characters can be between 0-30", e.target);
    e.target.value = e.target.value > 30 ? 30 : 0;
    if (document.querySelector("#generate__random .output__number").textContent.length !== +e.target.value) {
      updateRandomCharacters();
    }
  } else if (e.target.id === "random__characters"){
    updateRandomCharacters();
  }
  if (e.target.id === "base__number") {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  }
  updateWebStorage();
}
function generateRandomAlphanumerics(length) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
  let result = "",
    options = [...numbers];
  if (includeLetters.checked)
    options = [...numbers, ...alphabets]
  for (i=0;i<length;i++) {
    result += options[parseInt(Math.random() * options.length)];
  }
  return result;
}
function updateWebStorage() {
  values = {
    sequential: {
      prefix: document.querySelector("#sequential__prefix").value,
      suffix: document.querySelector("#sequential__suffix").value,
      baseNumber: document.querySelector("#base__number").value,
      recentlyCopied: {
        prefix: "" || document.querySelector("#generate__sequential .recently__copied__text .prefix__output").textContent,
        suffix: "" || document.querySelector("#generate__sequential .recently__copied__text .suffix__output").textContent,
        number: "" || document.querySelector("#generate__sequential .recently__copied__text .output__number").textContent,
        time: "" || document.querySelector("#generate__sequential .recently__copied__time").textContent,
      }
    },
    time: {
      prefix: document.querySelector("#time__prefix").value,
      suffix: document.querySelector("#time__suffix").value,
      recentlyCopied: {
        prefix: "" || document.querySelector("#generate__time .recently__copied__text .prefix__output").textContent,
        suffix: "" || document.querySelector("#generate__time .recently__copied__text .suffix__output").textContent,
        number: "" || document.querySelector("#generate__time .recently__copied__text .output__number").textContent,
        time: "" || document.querySelector("#generate__time .recently__copied__time").textContent,
      }
    },
    random: {
      prefix: document.querySelector("#random__prefix").value,
      suffix: document.querySelector("#random__suffix").value,
      randomCharacters: document.querySelector("#random__characters").value,
      includeLetters: document.querySelector("#letters").checked,
      recentlyCopied: {
        prefix: "" || document.querySelector("#generate__random .recently__copied__text .prefix__output").textContent,
        suffix: "" || document.querySelector("#generate__random .recently__copied__text .suffix__output").textContent,
        number: "" || document.querySelector("#generate__random .recently__copied__text .output__number").textContent,
        time: "" || document.querySelector("#generate__random .recently__copied__time").textContent,
      }
    }
  }
  localStorage.setItem("saved-values", JSON.stringify(values));
}
function populateFields() {
  savedValues = JSON.parse(localStorage.getItem("saved-values"));
  if (savedValues !== null) {
    document.querySelector("#sequential__prefix").value = savedValues.sequential.prefix || "PREFIX";
    document.querySelector("#sequential__suffix").value = savedValues.sequential.suffix || "SUFFIX";
    document.querySelector("#base__number").value = savedValues.sequential.baseNumber || "000001";
    if (savedValues.sequential.recentlyCopied.time !== "" && savedValues.sequential.recentlyCopied.prefix !== "" && savedValues.sequential.recentlyCopied.suffix !== "" ) {
      document.querySelector("#generate__sequential .recently__copied__text").innerHTML = `
      <div class="recently__copied__value">
        <div class="prefix__output">${savedValues.sequential.recentlyCopied.prefix}</div>
        <div class="output__number">${savedValues.sequential.recentlyCopied.number}</div>
        <div class="suffix__output">${savedValues.sequential.recentlyCopied.suffix}</div>
      </div>
      is the most recent value copied to the clipboard at 
      <span class="recently__copied__time">${savedValues.sequential.recentlyCopied.time}</span>
      `
    }
    document.querySelector("#time__prefix").value = savedValues.time.prefix || "PREFIX";
    document.querySelector("#time__suffix").value = savedValues.time.suffix || "SUFFIX";
    if (savedValues.time.recentlyCopied.time !== "" && savedValues.time.recentlyCopied.prefix !== "" && savedValues.time.recentlyCopied.suffix !== "" ) {
      document.querySelector("#generate__time .recently__copied__text").innerHTML = `
      <div class="recently__copied__value">
        <div class="prefix__output">${savedValues.time.recentlyCopied.prefix}</div>
        <div class="output__number">${savedValues.time.recentlyCopied.number}</div>
        <div class="suffix__output">${savedValues.time.recentlyCopied.suffix}</div>
      </div>
      is the most recent value copied to the clipboard at 
      <span class="recently__copied__time">${savedValues.time.recentlyCopied.time}</span>
      `
    }
    document.querySelector("#random__prefix").value = savedValues.random.prefix || "PREFIX";
    document.querySelector("#random__suffix").value = savedValues.random.suffix || "SUFFIX";
    document.querySelector("#random__characters").value = savedValues.random.randomCharacters || 7;
    document.querySelector("#letters").checked = savedValues.random.includeLetters || false;
    if (savedValues.random.recentlyCopied.time !== "" && savedValues.random.recentlyCopied.prefix !== "" && savedValues.random.recentlyCopied.suffix !== "" ) {
      document.querySelector("#generate__random .recently__copied__text").innerHTML = `
      <div class="recently__copied__value">
        <div class="prefix__output">${savedValues.random.recentlyCopied.prefix}</div>
        <div class="output__number">${savedValues.random.recentlyCopied.number}</div>
        <div class="suffix__output">${savedValues.random.recentlyCopied.suffix}</div>
      </div>
      is the most recent value copied to the clipboard at 
      <span class="recently__copied__time">${savedValues.random.recentlyCopied.time}</span>
      `
    }
  }
}