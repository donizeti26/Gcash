import bcrypt from "bcrypt";
import { registerUser } from "../models/userModel.js";

export async function createUser(req, res) {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await registerUser({ username, email, hash });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
}
