// pages/dashboard/index.js (lanjutan)
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function Dashboard({ products: initialProducts }) {
  const { data: session } = useSession();
  const [products, setProducts] = useState(initialProducts || []);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Handle submit produk baru
  async function handleSubmit(e) {
    e.preventDefault();
    if (!imageFile) {
      alert("Pilih gambar produk");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", imageFile);
    // Kirim ke API upload produk
    const res = await fetch("/api/products", { method: "POST", body: formData });
    if (res.ok) {
      const { product } = await res.json();
      setProducts([product, ...products]);  // update list produk di state
      // reset form
      setName(""); setDescription(""); setImageFile(null);
      alert("Produk berhasil ditambahkan!");
    } else {
      const err = await res.json();
      alert("Gagal upload: " + err.message);
    }
  }

  async function handleDelete(productId) {
    if (!confirm("Yakin hapus produk ini?")) return;
    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter(p => p.id !== productId));
    } else {
      alert("Gagal menghapus produk");
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Produk Anda</h1>

      {/* Form Tambah Produk */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4" encType="multipart/form-data">
        <input type="text" placeholder="Nama produk" value={name} required 
               onChange={(e) => setName(e.target.value)}
               className="w-full p-2 border rounded" />
        <textarea placeholder="Deskripsi produk" value={description} required 
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded" />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
               className="block" />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
          + Tambah Produk
        </button>
      </form>

      {/* Daftar Produk User */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(p => (
          <div key={p.id} className="border rounded-lg overflow-hidden shadow relative">
            <div className="relative w-full h-40 bg-gray-100">
              {p.imageUrl ? (
                <Image src={p.imageUrl} alt={p.name} layout="fill" objectFit="cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-gray-500">No Image</span>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-sm text-gray-700 mb-2">{p.description}</p>
              <button onClick={() => handleDelete(p.id)} className="text-red-600 text-sm">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
