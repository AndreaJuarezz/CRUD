import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await prisma.book.delete({ where: { id: parseInt(id) } });
      res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ error: "Failed to delete book" });
    }
  } else if (req.method === "PUT") {
    try {
      const { title, author } = req.body;

      // Validación básica
      if (!title || !author) {
        return res.status(400).json({ error: "Title and author are required" });
      }

      const updatedBook = await prisma.book.update({
        where: { id: parseInt(id) },
        data: { title, author },
      });

      res.status(200).json(updatedBook);
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ error: "Failed to update book" });
    }
  } else {
    res.setHeader("Allow", ["DELETE", "PUT"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}