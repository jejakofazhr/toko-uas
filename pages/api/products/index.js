import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method === "POST") {
    const { name, description, imageUrl } = req.body;
    if (!name || !description || !imageUrl) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }
    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          imageUrl,
          userId: session.user.id,
        },
      });
      return res.status(200).json({ message: "Product created", product });
    } catch (error) {
      console.error("DB error:", error);
      res.status(500).json({ message: "DB Error" });
    }
  } else {
    res.status(405).end();
  }
}
