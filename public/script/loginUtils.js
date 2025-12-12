const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");

const divInputEmail = document.getElementById("divInputEmail");
const divInputPassword = document.getElementById("divInputPassword");

inputEmail.addEventListener("focus", () => {
  divInputEmail.classList.add("focusOn");
});
inputEmail.addEventListener("blur", () => {
  divInputEmail.classList.remove("focusOn");
});

inputPassword.addEventListener("focus", () => {
  divInputPassword.classList.add("focusOn");
});
inputPassword.addEventListener("blur", () => {
  divInputPassword.classList.remove("focusOn");
});
