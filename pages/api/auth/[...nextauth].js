import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Cek input email dan password
        if (!credentials.email || !credentials.password) {
          throw new Error("Email dan password diperlukan");
        }
        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user || !user.hashedPassword) {
          throw new Error("User tidak ditemukan");
        }
        // Cocokkan password
        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!passwordMatch) {
          throw new Error("Password salah");
        }
        return user;  // sukses: return data user
      }
    })
  ],
  session: {
    strategy: "jwt",  // menggunakan JWT agar tak perlu simpan session di DB:contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}
  },
  secret: process.env.NEXTAUTH_SECRET,
});
