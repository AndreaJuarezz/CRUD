"use client";

import { useEffect, useState } from "react";
import BookForm from "../components/BookForm";

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  const handleDelete = (id) => {
    fetch(`/api/books/${id}`, { method: "DELETE" })
      .then(() => setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id)));
  };

  const handleUpdate = (id, updatedBook) => {
    fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBook),
    }).then(() => {
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? { ...book, ...updatedBook } : book))
      );
    });
  };

  return (
    <div className="container">
      <h1>Book Manager</h1>
      <BookForm
        onSubmit={(book) =>
          fetch("/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book),
          }).then(() => location.reload())
        }
      />
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
            <button onClick={() => handleDelete(book.id)}>Delete</button>
            <button
              onClick={() =>
                handleUpdate(book.id, {
                  title: prompt("New title:", book.title),
                  author: prompt("New author:", book.author),
                })
              }
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}