// pages/api/register.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();  // Method Not Allowed
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }
  try {
    // Cek jika email sudah terpakai
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }
    // Hash password dan simpan user baru
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, hashedPassword }
    });
    res.status(200).json({ message: "User created", userId: user.id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
