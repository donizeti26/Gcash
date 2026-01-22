export function renderFormCategory() {
  const modalContainer = document.getElementById(
    "modalContainerListCategories",
  );
  modalContainer.innerHTML = `
  <div id="edit_category" class="modal_overlay_form">
  <form id="form_new_category" class="modal_container_form">
    <div id="close_new_category">
      <div id="header_new_category">
        <span id="group_button_category">
          <div id="group_title_modal">
            <h2 id="title_modal">Nova categoria</h2>
            <p>Crie sua nova categoria</p>
          </div>
          <button class="button_close_card_new_category" type="button">
            <span class="material-symbols-outlined"> close </span>Fechar
          </button>
        </span>
      </div>
    </div>
    <div id="body_new_category">
      <!-- NOME -->
      <div>
        <label for="name_category"
          >Nome:
          <abbr class="required_abbr" title="campo obrigatório">*</abbr></label
        >
        <input
          id="name_category"
          tabindex="1"
          class="input_style"
          type="text"
          maxlength="30"
          name="name_category"
          required
        />
      </div>
      <div>
        <label for="option_new_category"
          >Tipo de Categoria
          <abbr class="required_abbr" title="campo obrigatório">*</abbr></label
        >
        <select
          id="option_new_category"
          name="select"
          class="input_style"
          required
        >
          <option value="" disabled selected></option>
          <option value="expense">Despesa</option>
          <option value="revenue">Receita</option>
        </select>
      </div>
      <!--COR-->
      <div>
        <label for="color_selector">Selecione a cor: </label>
        <input id="color_selector" type="color" name="color_selector" required />
      </div>

      <!--ICON-->
      <div id="select_icon">
        <input type="hidden" name="icon" id="selected_icon" required />
        <caption>
          Selecione o ícone:
        </caption>
        <button id="button_icons" type="button">
          <span id="add_reaction" class="material-symbols-outlined">
            add_reaction
          </span>
        </button>
      </div>
    </div>
    <!-- BOTÃO SALVAR -->
    <div id="div_button_expense">
      <button id="buttonNewCategory" type="submit">Salvar</button>
    </div>
  </form>
</div>
`;
}
