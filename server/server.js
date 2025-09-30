const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = 3000;
const bcrypt = require("bcrypt");

// middlewares
app.use(cors());
app.use(express.json());

//servir arquivos estatitucos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

// conexão com o PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_gcash",
  password: "1995",
  port: 5432,
});

// rota de teste
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// rota para testar a conexão com o banco
app.get("/test-db", async (req, res) => {
  try {
    // consulta simples no banco (pega a data/hora atual do PostgreSQL)
    const result = await pool.query("SELECT NOW()");

    // retorna resposta em JSON
    res.json({
      message: "Conexão bem-sucedida!",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao conectar no banco" });
  }
});

//ROTA PARA CADASTRA USUÁRIO
app.post("/usuarios", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users(name, email, password_hash, status) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hash]
    );
    res.json(result.rows[0]); // retorna o usuário cadastrado
  } catch (err) {
    console.error("Erro ao cadastrar: ", err);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});
/////////////////////////////////////////////////////
/////ROTA PARA CADASTRAR CATEGORIA//////
/////////////////////////////////////////////////////
app.post("/categories", async (req, res) => {
  const { name_categorie, color_selector, icon_selected, category_selected } =
    req.body;

  try {
    const result = await pool.query(
      "INSERT INTO categories(name, color, icon, type) VALUES($1, $2, $3, $4) RETURNING*",
      [name_categorie, color_selector, icon_selected, category_selected]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao cadastrar: ", err);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

/////////////////////////////////////////////////////
//////ROTA PARA CADASTRAR DESPESA////////
////////////////////////////////////////////////////
app.post("/transactions", async (req, res) => {
  const {
    category_id,
    payment_method_id,
    due_date,
    amount,
    description,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO transactions (category_id, payment_method_id, due_date, amount, description, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [category_id, payment_method_id, due_date, amount, description, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log("Erro ao cadastra: ", err);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

//////////////////////////////////////////////////////////////////////
//////ROTA PARA CONSULTAR TODAS AS CATEGORIAS////////
/////////////////////////////////////////////////////////////////////

app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.log("Erro ao buscar catesgorias", err.message);
    res.status(500).json({ error: err.message });
  }
});

///////////////////////////////////////////////////////////////////////////////
//////ROTA PARA CONSULTAR METODOS DE PAGAMETNO ///////////
//////////////////////////////////////////////////////////////////////////////
app.get("/paymentmethods", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payment_methods");
    res.json(result.rows);
  } catch (err) {
    console.log("Erro ao buscar metodos de pagamento", err.message);
    res.status(500).json({ error: err.message });
  }
});
///////////////////////////////////////////////////////////////////////////////
////////////////ROTA PARA CONSULTAR TRANSAÇÕES///////////////////
//////////////////////////////////////////////////////////////////////////////

app.get("/transactionsGet", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions");
    res.json(result.rows);
  } catch (err) {
    console.log("Erro ao buscar transações", err.message);
    res.status(500).json({ error: err.message });
  }
});
