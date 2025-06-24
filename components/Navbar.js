// components/Navbar.js
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link href="/" className="font-bold">MyApp</Link>
      </div>
      <div>
        <Link href="/" className="mr-4">Home</Link>
        {session ? (
          <>
            <Link href="/dashboard" className="mr-4">Dashboard</Link>
            <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="mr-4">Login</Link>
            <Link href="/register">Daftar</Link>
          </>
        )}
      </div>
    </nav>
  );
}
