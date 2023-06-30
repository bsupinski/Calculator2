const buttons = document.querySelectorAll(".buttons");
const inputWindow = document.querySelector(".calculator__windows__current");
const equationWindow = document.querySelector(
  ".calculator__windows__full-equation"
);
const saveButton = document.querySelector(".save");
const savedEquationsWrapper = document.getElementById("savedEquations");

let total = [];
let savedEquations = JSON.parse(localStorage.getItem("saved")) || [];

let lastInputWasSymbol = true;
let lastInputWasEquals = false;

const createSavedEquationList = () => {
  savedEquationsWrapper.innerHTML = "";
  savedEquations.map((equation) => {
    const newListItem = document.createElement("li");
    newListItem.classList.add("equation");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-sharp", "fa-solid", "fa-trash", "trash");
    newListItem.innerText += equation;
    newListItem.append(deleteIcon);
    savedEquationsWrapper.append(newListItem);
    deleteIcon.addEventListener("click", () => {
      savedEquations.splice(
        savedEquations.indexOf[deleteIcon.parentElement.innerText],
        1
      );
      deleteIcon.parentElement.remove();
      localStorage.setItem("saved", JSON.stringify(savedEquations));
    });
  });
};

createSavedEquationList();

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    //User clicked +, -, *, /
    if (e.target.classList.contains("symbol")) {
      if (lastInputWasSymbol === false) {
        total.push(inputWindow.value);
        total.push(e.target.innerHTML);
        equationWindow.innerHTML = total.join(" ");
        inputWindow.disabled = false;
        inputWindow.value = "";
        lastInputWasSymbol = true;
        return;
      } else {
        total[total.length - 1] = e.target.innerHTML;
        lastInputWasSymbol = true;
        return;
      }
    }

    if (e.target.textContent === "0") {
      if (inputWindow.value === "0") return;
    }

    if (e.target.textContent === "BCK") {
      inputWindow.value = inputWindow.value.toString().slice(0, -1);
      return;
    }

    if (e.target.textContent === "CE") {
      inputWindow.value = "";
      return;
    }

    if (e.target.textContent === "C") {
      inputWindow.value = "";
      total = [];
      equationWindow.innerText = "";
      return;
    }

    if (e.target.textContent === "%") {
      inputWindow.value = eval(`${inputWindow.value}*.01`);
      return;
    }

    if (e.target.textContent === "+/-") {
      if (inputWindow.value >= 0) {
        inputWindow.value = -Math.abs(Number(inputWindow.value));
        return;
      } else {
        inputWindow.value = Math.abs(Number(inputWindow.value));
        return;
      }
    }

    if (e.target.textContent === ".") {
      if (inputWindow.value.indexOf(".") > -1) {
        return;
      }

      lastInputWasSymbol = false;
      inputWindow.value += e.target.textContent;
      return;
    }

    if (e.target.textContent === "=") {
      total.push(inputWindow.value);
      let sum = eval(total.join("").replace("x", "*").replace("÷", "/"));
      if (total.length > 2) {
        equationWindow.innerText = total.join(" ");
        equationWindow.innerText += " = ";
        equationWindow.innerText += " " + sum;
      }

      inputWindow.value = sum;
      total = [];
      lastInputWasEquals = true;
      return;
    }

    if (lastInputWasEquals === true) {
      inputWindow.value = null;
      lastInputWasSymbol = false;
      inputWindow.value += e.target.textContent;
      lastInputWasEquals = false;
      return;
    }

    lastInputWasSymbol = false;
    inputWindow.value += e.target.textContent;

    if (
      inputWindow.value[1] !== "." &&
      inputWindow.value[0] === "0" &&
      inputWindow.value.length > 1
    ) {
      inputWindow.value = inputWindow.value.slice(1);
      console.log("hello");
    }

    if (+inputWindow.value < 1 && inputWindow.value[0] !== "0") {
      inputWindow.value = "0" + inputWindow.value;
    }
  });
});

saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(equationWindow.innerText);
  savedEquations.push(equationWindow.innerText);
  localStorage.setItem("saved", JSON.stringify(savedEquations));
  createSavedEquationList();
});
