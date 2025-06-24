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
  setIsUploading(true); // MULAI LOADING

  try {
    // 1. Minta URL upload
    const res1 = await fetch("/api/blob/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: imageFile.name, contentType: imageFile.type }),
    });
    if (!res1.ok) throw new Error("Gagal mendapatkan upload URL");
    const { url, uploadUrl } = await res1.json();

    // 2. Upload gambar ke blob
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: imageFile,
      headers: { "Content-Type": imageFile.type }
    });
    if (!uploadRes.ok) throw new Error("Upload gambar gagal!");

    // 3. Simpan produk ke database
    const res2 = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        imageUrl: url,
      }),
    });
    if (res2.ok) {
      const { product } = await res2.json();
      setProducts([product, ...products]);
      setName(""); setDescription(""); setImageFile(null);
      alert("Produk berhasil ditambahkan!");
    } else {
      const err = await res2.json();
      alert("Gagal simpan data produk: " + err.message);
    }
  } catch (err) {
    alert(err.message || "Upload gagal!");
  } finally {
    setIsUploading(false); // SELESAI LOADING
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
<button
  type="submit"
  className={`bg-green-600 text-white py-2 px-4 rounded ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
  disabled={isUploading}
>
  {isUploading ? (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Uploading...
    </span>
  ) : "+ Tambah Produk"}
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
