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
        installments = document.getElementById("installments");
        function createElements() {
          var option = document.createElement("option")
          installments.appendChild(option)
        }
        function onofOption() {
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
    console.log("FUNCIONANDO")


  }
});

/*------------FECHAR AO CLICAR FORA INICIAL----------------*/
const main_content = document.getElementById("main_content")
var allButton = document.querySelector(".buttonCreate");
var opcoes = document.getElementById("opcoes")
var button = document.querySelector(".add_up")


main_content.addEventListener('click', function (e) {
  /*-o closest verifica todos os filhos da tag*/
  if (!e.target.closest('#button_modais')) {
    console.log("FUNCIONANDO no button")
    opcoes.classList.remove("open")
    button.classList.remove('rotate_x')
    allButton.classList.remove('remove_or_error')
    allButton.classList.add('buttonHover')
  }
});


/*--------------*/
const month = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const GO = document.getElementById("GO");
const BACK = document.getElementById("BACK");
const months = document.getElementById("month");

let cont = 0; // começa em Janeiro

// Atualiza a tela
function showMonth() {
  months.innerHTML = " <h2> " + month[cont] + "</h2>";
  console.log(month[cont]);

}

// Avançar (GO)
GO.addEventListener('click', () => {
  cont = (cont + 1) % 12; // avança e volta para 0 quando passa de 11
  showMonth();
});

// Voltar (Back)
BACK.addEventListener('click', () => {
  cont = (cont - 1 + 12) % 12; // se for -1, vira 11 (Dezembro)
  showMonth();
});

// Mostra o primeiro mês ao carregar
showMonth();

/*-------------MENU ICONS--------------*/
const bank_icons = [
  { icon: "shopping_cart", text: "Compras" },
  { icon: "restaurant", text: "Alimentação" },
  { icon: "local_gas_station", text: "Combustível" },
  { icon: "credit_card", text: "Cartão de Crédito" },
  { icon: "local_hospital", text: "Saúde" },
  { icon: "receipt_long", text: "Contas" },
  { icon: "electric_bolt", text: "Energia" },
  { icon: "local_grocery_store", text: "Supermercado" },
  { icon: "pets", text: "Pets" },
  { icon: "school", text: "Educação" },
  { icon: "directions_bus", text: "Transporte" },
  { icon: "house", text: "Moradia" },
  { icon: "phone_iphone", text: "Telefonia" },
  { icon: "wifi", text: "Internet" },
  { icon: "tv", text: "TV/Streaming" },
  { icon: "fitness_center", text: "Academia" },
  { icon: "local_bar", text: "Lazer" },
  { icon: "sports_esports", text: "Jogos" },
  { icon: "beach_access", text: "Viagem" },
  { icon: "theaters", text: "Cinema" },
  { icon: "park", text: "Parque" },
  { icon: "liquor", text: "Bebidas" },
  { icon: "shopping_bag", text: "Roupas" },
  { icon: "child_friendly", text: "Crianças" },
  { icon: "medical_services", text: "Farmácia" },
  { icon: "payments", text: "Impostos" },
  { icon: "construction", text: "Reparos" },
  { icon: "devices_other", text: "Eletrônicos" }

];
/*--28X-*/

function test_display() {
  test_new_categorie = document.getElementById('form_new_categorie');
  test_display_on = document.getElementById('display_icon_on');
  test_contem = test_new_categorie.contains(test_display_on)
  console.log(test_contem)

  if (!test_contem) {
    criate_icons()
  } else if (test_contem) {
    test_display_on.remove()

  }
}




function criate_icons() {
  form_new_categorie = document.getElementById('form_new_categorie');

  const display_icon_on = document.createElement('div');
  display_icon_on.id = 'display_icon_on'
  form_new_categorie.appendChild(display_icon_on);

  bank_icons.forEach(function (item, index) {
    const new_button = document.createElement('button');
    const new_icons = document.createElement('span');

    new_button.className = "list_button_icons";
    new_icons.className = "material-symbols-outlined", "new_icon";
    new_icons.textContent = item.icon;

    new_button.appendChild(new_icons);

    //  icons_list = document.getElementById('icons_list');

    //  icons_list.appendChild(new_icons)
    display_icon_on.appendChild(new_button);

  })
}
/*-------COM O ONLCLICK-----------
function verificaRadio() {
  const question_repet = document.getElementById("question_repet");
  const selectedInput = question_repet.querySelector('input[name="reponse_radio"]:checked');
  console.log(selectedInput.value)

}*/

