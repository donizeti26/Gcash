import "../css/create_account.css";
import { navigate } from "../router.js";

export function renderCreateAccount() {
  const app = document.getElementById("app");
  app.innerHTML = `
<main id="main_create_account">
  <div id="button_back_login">
    <span class="material-symbols-outlined">  arrow_back_ios  </span> Voltar
  </div>
  <div id="main_content_create_account">
    <div id="left_side_create_account">
      <div id="logo_right">
        <img
          src="/images/img_create_account.svg"
          id="logo_create_account"
          alt=""
        />
      </div>
    </div>
    <div id="right_side_create_account">
    
      <div id="contentRightSidCreateAccount">
        <div id="title_new_account">
          <h1 id="titlePage">Criar nova conta.</h1>
          <p>Preencha os campos com seus dados</p>
        </div>
        <form id="formCreateUser">
          <div id="divInputUserNameCreateAccount" class="group_div_inputs">
            <label for= "inputUserName">
              <p class= "legend_input">Nome de usuário:</p>
              <input
                type="text"
                name= "inputUserName"
                id= "inputUserName"
                class="group_inputs"
              />
            </label>
          </div>
          <div id="group_name">
            <div id="divInputFirstNameCreateAccount" class="group_div_inputs">
              <label for="inputFirstName">
                <p class="legend_input">Primeiro nome:</p>
                <input
                  class="input_login group_inputs"
                  type="text"
                  name= "inputFirstName"
                  id= "inputFirstName"
                  required
                />
              </label>
            </div>

            <div id="divInputLastNameCreateAccount" class="group_div_inputs">
              <label for="inputLastName">
                <p class="legend_input">Sobrenome:</p>
                <input
                  class="input_login group_inputs"
                  type="text"
                  name="inputLastName"
                  id="inputLastName"
                  required
                />
              </label>
            </div>
          </div>

          <div id="divInputEmailCreateAccount" class="group_div_inputs">
            <label for="inputEmail">
              <p class="legend_input">Endereço de email:</p>
              <input
                class="group_inputs"
                type="email"
                name="inputEmail"
                id="inputEmail"
                placeholder="seuemail@exemplo.com" 
                required
              />
            </label>
          </div>
          <div id="divInputPasswordCreateAccount" class="group_div_inputs">
            <label for="inputPassword">
              <p class="legend_input">Senha (Mínimo de 8 caracteres)</p>

              <input
                class="input_login group_inputs"
                type="password"
                name="inputPassword"
                id="inputPassword"
                                  name="inputPassword"
                  minlength="8"
                  id="inputPassword"
                  autocomplete="current-password" 
                  required
                required
              />
            </label>
          </div>

          <div id="linksAndButtons">
            <div id="groupButtons">
              <button id="createNewUserButton" type="submit">Criar conta</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</main>
`;
  document
    .getElementById("formCreateUser")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;

      const payload = {
        userName: form.inputUserName.value,
        firstName: form.inputFirstName.value,
        lastName: form.inputLastName.value,
        email: form.inputEmail.value,
        password: form.inputPassword.value,
      };

      console.log(payload);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Usuário criado com sucesso");
        navigate("/login");
      } else {
        const err = await res.json();
        alert(err.error || "Error ao criar usuário");
      }
    });

  document.getElementById("button_back_login").addEventListener("click", () => {
    navigate("/login");
  });
}
