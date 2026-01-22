import "../css/login.css";

export function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
  <main id="main_login">
      <div id="left_side_login">
        <div id="logo_left">
          <img src="/icon/logo.svg" id="logo" alt="" />
        </div>
        <div id="imageBackground"></div>
      </div>
      <div id="right_side">
        <div id="contentRightSid">
          <div id="logo_right">
            <img src="/icon/logo.svg" id="logo" alt="" />
          </div>
          <h1 id="titlePage">Login</h1>
          <form action="" id="formLogin">
            <label for="inputEmail">
              <div id="divInputEmail">
                Endereço de email:
                <input type="text" name="inputEmail" id="inputEmail" />
              </div>
            </label>
            <label for="inputPassword">
              <div id="divInputPassword">
                Senha

                <input 
                  class ="input_login"
                  type="password"
                  name="inputPassword"
                  id="inputPassword"
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
                      required
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
}
