export function setupUI() {
  var allButton = document.querySelector(".buttonCreate");
  var opcoes = document.getElementById("opcoes");
  var button = document.querySelector(".add_up");
  const main_content = document.getElementById("main_content");

  document
    .querySelector(".buttonCreate")
    .addEventListener("click", function () {
      startmenuindex();
    });
}
export function startmenuindex() {
  var opcoes = document.getElementById("opcoes");
  var allButton = document.querySelector(".buttonCreate");
  var button = document.querySelector(".add_up");
  if (!opcoes.classList.contains("open")) {
    opcoes.classList.remove("displaynone");
    opcoes.classList.add("open");
    allButton.classList.add("remove_or_error");
    button.classList.add("rotate_x");
    allButton.classList.remove("buttonHover");
  } else {
    stopmenuindex();
  }
}
export function stopmenuindex() {
  console.log("Stop Funcionado");
  var opcoes = document.getElementById("opcoes");
  var allButton = document.querySelector(".buttonCreate");
  var button = document.querySelector(".add_up");
  opcoes.classList.remove("open");
  opcoes.classList.add("displaynone");
  button.classList.remove("rotate_x");
  allButton.classList.remove("remove_or_error");
  allButton.classList.add("buttonHover");
}
