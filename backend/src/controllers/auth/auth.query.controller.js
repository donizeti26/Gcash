import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { getUserByEmail, createUser } from "../../models/auth/index.js";

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const users = await getUserByEmail(email);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const user = users[0];

    if (!user.password_hash) {
      return res.status(500).json({ error: "Senha inválida no banco" });
    }
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Erro interno", err);
    res.status(500).json({ error: err.message });
  }
}

export async function createUserController(req, res) {
  try {
    const { userName, firstName, lastName, email, password } = req.body;

    if (
      !userName ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      password.length < 6
    ) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const existing = await getUserByEmail(email);

    if (existing.length > 0) {
      return res.status(409).json({ error: "O usuário já existe" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const status = "enable";
    await createUser({
      userName,
      firstName,
      lastName,
      email,
      password_hash,
      status,
    });

    res.status(201).json({ message: "Usuário criado com Sucesso" });
  } catch (err) {
    console.error("Erro interno", err);
    res.status(500).json({ error: err.message });
  }
}
