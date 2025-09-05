let createuser = document.querySelector('.createuser')
let login = document.querySelector('.log-in')
let formlogin = document.querySelector("#formlogin")
let formcreate = document.querySelector("#formcreate")
let image = document.querySelector("#userImg")

function openCity(opcao) {
  const isCreateUser = opcao === 0
  image.style.display = isCreateUser ? "none" : "flex"

  createuser.classList.toggle("border-on", isCreateUser)
  login.classList.toggle("border-on", !isCreateUser)
  console.log("criando usuario")


  formlogin.style.display = isCreateUser ? "none" : "flex"
  formcreate.style.display = isCreateUser ? "flex" : "none"
}



/*capturar valores digitados e mandar valores para o servidor.*/
document.getElementById("formcreate").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email_create").value;
  const password = document.getElementById("password_create").value;

  try {
    const response = await fetch("/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json()
    window.alert("Usuário " + data.username + " cadastrado com sucesso!");
  } catch (err) {
    document.getElementById("mensagem").innerHTML = "Erro ao cadastrar. ";
  }
})