import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        alert("Registrasi berhasil! Silakan login.");
        router.push("/login");
      } else {
        const error = await res.json();
        alert("Gagal mendaftar: " + error.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Daftar Akun</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nama" value={name} required 
               onChange={(e) => setName(e.target.value)}
               className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" value={email} required 
               onChange={(e) => setEmail(e.target.value)}
               className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} required 
               onChange={(e) => setPassword(e.target.value)}
               className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Daftar
        </button>
      </form>
    </div>
  );
}
