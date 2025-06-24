import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }  // disable Next.js default body parser
};
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method === "POST") {
    // Parse form data (file + fields)
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form", err);
        return res.status(500).json({ message: "Form parse error" });
      }
      const { name, description } = fields;
      const imageFile = files.image;
      if (!imageFile) {
        return res.status(400).json({ message: "No image file" });
      }
      try {
        // Baca file gambar dari path temp, upload ke Vercel Blob
        const fileData = fs.readFileSync(imageFile.filepath);
        const blob = await put(imageFile.originalFilename, fileData, {
          access: "public",
          contentType: imageFile.mimetype,
          addRandomSuffix: true
        });
        // 'blob' berisi info file yang diupload, termasuk URL
        const imageUrl = blob.url;
        // Simpan data produk ke DB dengan relasi ke user
        const product = await prisma.product.create({
          data: {
            name: name[0],
            description: description[0],
            imageUrl,
            userId: session.user.id
          }
        });
        return res.status(200).json({ message: "Product created", product });
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Upload failed" });
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed jika bukan POST
  }
}
