export function selectRadioDeleteCategory() {
  const radioSelected = document.querySelector(
    'input[name="optionCategory"]:checked'
  );
  if (radioSelected) {
    console.log("Cor selecionada:", radioSelected.value);
  } else {
    console.log("Nenhum rádio selecionado.");
  }
}
