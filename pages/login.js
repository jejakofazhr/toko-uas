import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    // signIn NextAuth dengan provider "credentials"
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard"  // redirect setelah login
    });
    if (res.error) {
      alert("Login gagal: " + res.error);
    }
    // NextAuth akan otomatis redirect jika sukses (melalui callbackUrl)
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} required 
               onChange={(e) => setEmail(e.target.value)}
               className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} required 
               onChange={(e) => setPassword(e.target.value)}
               className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="mb-2">-- atau --</p>
        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} 
                className="bg-red-500 text-white py-2 px-4 rounded">
          Login dengan Google
        </button>
      </div>
    </div>
  );
}
