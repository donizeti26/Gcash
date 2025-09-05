


const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path')

const app = express();
const port = 3000;


// middlewares
app.use(cors());
app.use(express.json());


//servir arquivos estatitucos da pasta public
app.use(express.static(path.join(__dirname, "../public")))

// conexão com o PostgreSQL
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'DB_Gcash',
  password: 'danoninho',
  port: 5432,
});

// rota de teste
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


// rota para testar a conexão com o banco
app.get('/test-db', async (req, res) => {
  try {
    // consulta simples no banco (pega a data/hora atual do PostgreSQL)
    const result = await pool.query('SELECT NOW()');

    // retorna resposta em JSON
    res.json({
      message: 'Conexão bem-sucedida!',
      time: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao conectar no banco' });
  }
});

//ROTA PARA CADASTRA USUÁRIO
app.post("/usuarios", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO LOGIN_CUSTOMER(USERNAME, EMAIL, PASSWORD) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password]
    );
    res.json(result.rows[0]);// retorna o usuário cadastrado 
  } catch (err) {
    console.error("Erro ao cadastrar: ", err);
    res.status(500).json({ error: "Ero ao cadastrar usuário" })
  }
});