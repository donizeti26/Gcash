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