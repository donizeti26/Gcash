export function setupUI() {
  var allButton = document.querySelector(".buttonCreate");
  var opcoes = document.getElementById("opcoes");
  var button = document.querySelector(".add_up");
  const main_content = document.getElementById("main_content");

  document
    .querySelector(".buttonCreate")
    .addEventListener("click", function () {
      var opcoes = document.getElementById("opcoes");
      var allButton = document.querySelector(".buttonCreate");

      var button = document.querySelector(".add_up");
      if (!opcoes.classList.contains("open")) {
        opcoes.classList.add("open");
        allButton.classList.add("remove_or_error");
        button.classList.add("rotate_x");
        allButton.classList.remove("buttonHover");
      } else {
        opcoes.classList.remove("open");
        button.classList.remove("rotate_x");
        allButton.classList.remove("remove_or_error");
        allButton.classList.add("buttonHover");
      }
    });
  if (main_content) {
    main_content.addEventListener("click", (e) => {
      /*-o closest verifica todos os filhos da tag*/
      if (!e.target.closest("#button_modais")) {
        opcoes.classList.remove("open");
        button.classList.remove("rotate_x");
        allButton.classList.remove("remove_or_error");
        allButton.classList.add("buttonHover");
      }
    });
  }
}
