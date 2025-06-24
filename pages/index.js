// pages/index.js
import Image from "next/image";
import prisma from "../lib/prisma"; // atau import PrismaClient langsung

export default function Home({ products }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Produk</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow">
            <div className="relative w-full h-48">
              <Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="text-sm text-gray-500">Oleh: {product.user.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mengambil data produk sebelum render
export async function getServerSideProps() {
  const products = await prisma.product.findMany({
    include: { user: true },   // sertakan relasi user
    orderBy: { createdAt: "desc" }
  });
  // Prisma return objek Date, perlu di-serialize ke JSON
  const data = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    imageUrl: p.imageUrl,
    user: { name: p.user.name }
  }));
  return { props: { products: data } };
}
