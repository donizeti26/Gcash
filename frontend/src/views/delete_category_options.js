export function renderDeleteCategoryOption() {
  const modalContainerListCategories = document.getElementById(
    "modalContainerListCategories",
  );

  modalContainerListCategories.innerHTML = `<div id="deleteCategoryOptions">
  <div id="containerOptionsDelete">
    <h2>
      A categoria selecionada para exclusão <br />
      possui <strong id="contTransactions">N</strong> transações
    </h2>
    <p>Selecione uma das alternativas:</p>
    <form action="" id="formOptionsDelete">
      <span>
        <input
          type="radio"
          name="optionCategory"
          id="deleteAll"
          value="deleteAll"
          required
        />
        <label for="deleteAll">Apagar categoria + transações</label>
      </span>
      <span id="containerChangeCategory">
        <span>
          <input
            type="radio"
            name="optionCategory"
            id="changeCategory"
            value="changeCategory"
            required
          />
          <label for="changeCategory"
            >Mover transações para outra categoria</label
          >
        </span>
        <span id="groupOptionsChangeCategory">
          <label for="otherCategories">Selecione outra Categoria:</label>
          <select name="otherCategories" id="otherCategories" disabled>
            <option value="" selected="">Selecionar</option>
          </select>
        </span>
      </span>
      <span id="groupButtonsDeleteCategory">
        <button id="buttonCancel" type="button">Voltar</button>
        <button id="buttonSetSubmit" type="submit">Deletar</button>
      </span>
    </form>
  </div>
</div>
`;
}
