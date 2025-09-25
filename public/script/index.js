import { openModal, fecharModal, setupModalGlobalListeners } from "./modal.js";
import { setupUI } from "./ui.js";
import { setupCalendar } from "./calendar.js";

// INICIALIÇÕES GLOBAIS
setupUI();
setupCalendar();
setupModalGlobalListeners();

//  ADICIONANDO LISTENER QUANDO A DOM ESTIVER PRONTA

document.addEventListener("DOMContentLoaded", () => {
  // BOTAO PARA ABRIR DESPESAS (E INICIALIZAR INSTALLMENTS)
  const btnDespesas = document.getElementById("despesas");
  if (btnDespesas) {
    btnDespesas.addEventListener("click", async () => {
      //ABRIR MODAL COM HTML DE DESPESAS
      await openModal("form_expenses.html");
      setupCalendar();
      //DEPOIS QUE O HTML É INJETADO, INICIALIZA A LÓGICA DAS PARCELAS
      const installmentsMod = await import("./installments.js").catch(
        () => ({})
      );
      installmentsMod.initExpensesForm?.();
      installmentsMod.initCategoryForm?.();
    });
  }
});

//BOTAO CATEGORIA (ABRE O FORM_CATEGORIASHTML E INICIALIZA CATEGORIAS + ICONS DE NEW CATEGORIA)
const btnCategoria = document.getElementById("categoria");
if (btnCategoria) {
  btnCategoria.addEventListener("click", async () => {
    //ABRIR MODAL COM CATEGORIAS
    await openModal("form_categories.html");

    const categoriesMod = await import("./categories.js").catch(() => ({}));
    categoriesMod.loadCategories?.();
    categoriesMod.initCategoryForm?.();

    const iconsMod = await import("./icons.js").catch(() => ({}));
    iconsMod.criate_icons?.();

    const btnNewCategorie = document.getElementById("button_categorie");
    if (btnNewCategorie) {
      btnNewCategorie.addEventListener("click", async () => {
        await openModal("new_categorie.html");
        //CARREGANDO MODULO DE CATEGORIAS E ICONES SÓ QUANDO PRECISAR
        categoriesMod.loadCategories?.();

        document.addEventListener("click", async (e) => {
          const backBtn = e.target.closest(".button_back_card");
          if (backBtn) {
            fecharModal();
            await openModal("form_categories.html");
            categoriesMod.loadCategories?.();
          }
        });
      });
    }
  });
}

//BOTAO RECEITAS
const btnReceita = document.getElementById("receita");
if (btnReceita) {
  btnReceita.addEventListener("click", async () => {
    await openModal("form_revenue.html");
    setupCalendar();

    const revenueMod = await import("./installments.js").catch(() => ({}));
    revenueMod.initExpensesForm?.();
  });
}
