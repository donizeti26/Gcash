import "../css/login.css";
import { navigate } from "../router.js";
import { focusOnOf } from "../script/utils/loginUtils";
export function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
  <main id="main_login">

      <div id="right_side">
        <div id="contentRightSid">
          <div id="group_title_login">
          <h1 id="titlePageLogin">Login</h1>
          <p>Preencha os campos com seus dados</p>
          </div>
          <form action="" id="formLogin">
            <label for="inputEmail">
              <div id="divInputEmail">
                <p>Endereço de email:</p>
                <input type="email" class="input_login" name="inputEmail" id="inputEmail" placeholder="seuemail@exemplo.com" 
                required/>
              </div>
            </label>
            <label for="inputPassword">
              <div id="divInputPassword">
                <p>Senha</p>

                <input 
                  class ="input_login"
                  type="password"
                  name="inputPassword"
                  minlength="8"
                  id="inputPassword"
                  autocomplete="current-password" 
                  required
                />
              </div>
            </label>

            <div id="linksAndButtons">
              <div id="groupLinks">
                <span id="groupRemember">
                  <label for="remember" id="labelRemember">
                    <input
                      class = "input_login"
                      type="radio"
                      name="remember"
                      id="remember"
                      
                    />Lembre de mim</label
                  >
                </span>
                <span>
                  <a id="forget" href="">Esqueceu a senha?</a>
                </span>
              </div>
              <div id="groupButtons">
                <button id="loginButton">Entrar</button>
                <button id="singInButton">Criar conta</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>`;
  focusOnOf();
  document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      email: form.inputEmail.value,
      password: form.inputPassword.value,
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      alert(data.error || "Login inválido");
    }
  });
}
