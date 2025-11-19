// icons.js - cria a lista de ícones dinamicamente

export function testDisplay() {
  const test_new_category = document.getElementById("form_new_category");
  const test_display_on = document.getElementById("display_icon_on");

  if (!test_new_category) return;
  const contains =
    test_display_on && test_new_category.contains(test_display_on);

  if (!contains) {
    create_icons();
  } else {
    test_display_on.remove();
  }
}

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
  { icon: "devices_other", text: "Eletrônicos" },
];
window.test_display = testDisplay;

export function create_icons() {
  const form_new_category = document.getElementById("form_new_category");
  const div_button_expense = document.getElementById("div_button_expense");
  const hiddenInput = document.getElementById("selected_icon");
  const display_icon_on = document.createElement("div");

  display_icon_on.id = "display_icon_on";
  if (form_new_category) {
    form_new_category.insertBefore(display_icon_on, div_button_expense);
  }

  bank_icons.forEach(function (item, index) {
    const new_button = document.createElement("button");
    const new_icons = document.createElement("span");

    new_button.type = "button"; // evita submit indesejado
    new_button.addEventListener("click", testDisplay);
    new_button.dataset.icon = item.icon; // <-- aqui guardamos o nome do ícone
    new_button.className = "list_button_icons";
    new_icons.className = "material-symbols-outlined new_icon";
    new_icons.textContent = item.icon;

    new_button.appendChild(new_icons);

    display_icon_on.appendChild(new_button);
    new_button.addEventListener("click", (e) => {
      const selectedIcon = e.currentTarget.dataset.icon;
      console.log("Ícone escolhido:", selectedIcon);
      hiddenInput.value = selectedIcon;

      console.log(hiddenInput.value);
      const add_reaction = document.getElementById("add_reaction");

      if (add_reaction) add_reaction.innerHTML = selectedIcon;
    });
  });
}
