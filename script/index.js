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

      // agora o HTML já está dentro do modalContainer
      const question_repet = document.getElementById("question_repet");
      var valueEvent
      if (question_repet) {
        const radios = question_repet.querySelectorAll('input[name="reponse_radio"]');

        radios.forEach(radio => {
          radio.addEventListener("change", (e) => {
            valueEvent = parseInt(e.target.value);
            console.log("Usuário escolheu:", (typeof e.target.value), valueEvent);
            onofOption()

          });
        });

        function onofOption() {
          installments = document.getElementById("installments");
          if (valueEvent === 0) {
            installments.disabled = true
          } else if (valueEvent === 1) {
            installments.disabled = false
          }
        }
      }
    })
}
const modalContainer = document.getElementById("modalContainer");
window.onclick = function (e) { if (e.target === modalContainer) { fecharModal() } };

function fecharModal() {
  document.getElementById('modalContainer').innerHTML = ""
}

//fechar novas abas quando precionar ESC
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    fecharModal();
  }
})


//fechar ao clicar fora
modalContainer.addEventListener('click', function (e) {
  const new_modal_js = document.getElementById('new_modal_js');

  if (e.target === new_modal_js) {
    fecharModal();
  }
});

/*-------COM O ONLCLICK-----------
function verificaRadio() {
  const question_repet = document.getElementById("question_repet");
  const selectedInput = question_repet.querySelector('input[name="reponse_radio"]:checked');
  console.log(selectedInput.value)

}*/

