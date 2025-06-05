document.querySelector(".buttonCreate").addEventListener("click", function () {
  var opcoes = document.getElementById("opcoes")
  var allButton = document.querySelector(".buttonCreate");

  var button = document.querySelector(".add_up")
  if (!opcoes.classList.contains("open")) {
    opcoes.classList.add("open")
    allButton.classList.add('remove_or_error')
    button.classList.add('rotate_x')
    allButton.classList.remove('buttonHover')
  } else {
    opcoes.classList.remove("open")
    button.classList.remove('rotate_x')
    allButton.classList.remove('remove_or_error')
    allButton.classList.add('buttonHover')

  }
})

function openModal(arquivo) {
  fetch(arquivo)
    .then(resposta => resposta.text())
    .then(html => {
      document.getElementById('modalContainer').innerHTML = html;
    })
}
const modalContainer = document.getElementById("modalContainer")
window.onclick = function (e) { if (e.target === modalContainer) { fecharModal() } }

function fecharModal() {
  document.getElementById('modalContainer').innerHTML = ''
}