import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const productId = req.query.id;
  if (req.method === "DELETE") {
    try {
      // Pastikan produk milik user yg login
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product || product.userId !== session.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      await prisma.product.delete({ where: { id: productId } });
      return res.status(200).json({ message: "Deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Delete failed" });
    }
  } else if (req.method === "PUT") {
    // (Opsional) Handle update product
  } else {
    res.status(405).end();
  }
}
