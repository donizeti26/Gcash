export function focusOnOf() {
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
}
export function visibility() {
  document.getElementById("visibility_icon").addEventListener("click", () => {
    var input = document.getElementById("inputPassword");
    var icon = document.getElementById("visibility_icon");

    if (input.type === "password") {
      icon.textContent = "visibility";

      input.type = "text"; // Muda para texto
    } else {
      icon.textContent = "visibility_off";
      input.type = "password"; // Muda para senha
    }
  });
}
