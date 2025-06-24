import { getSignedUrl } from "@vercel/blob";

export default async function handler(req, res) {
  // Opsional: validasi user login
  const { filename, contentType } = req.body;
  const url = await getSignedUrl({
    // generate url upload khusus gambar saja
    filename,
    contentType: contentType || "image/*",
    expiresIn: 10 * 60, // 10 menit
  });
  res.status(200).json(url);
}
