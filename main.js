document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadBook();
  }
});

const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, () => {
  const incompletedBookShelf = document.getElementById(
    "incompleteBookshelfList"
  );
  incompletedBookShelf.innerHTML = "";

  const completedBookShelf = document.getElementById("completeBookshelfList");
  completedBookShelf.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = addBookToShelf(bookItem);

    if (!bookItem.isComplete) {
      incompletedBookShelf.append(bookElement);
    } else {
      completedBookShelf.append(bookElement);
    }
  }
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isComplete = document.querySelector("#inputBookIsComplete").checked;

  const bookId = generateBookId();
  const bookObject = generateBookObject(
    bookId,
    bookTitle,
    bookAuthor,
    bookYear,
    isComplete
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Buku Berhasil Ditambahkan ke dalam Rak!",
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    location.reload();
  });

  saveData();
}

function generateBookId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

function addBookToShelf(bookObject) {
  const title = document.createElement("h3");
  title.innerText = bookObject.title;

  const author = document.createElement("p");
  author.innerText = "Penulis: " + bookObject.author;

  const year = document.createElement("p");
  year.innerText = "Tahun: " + bookObject.year;

  const action = document.createElement("div");
  action.classList.add("action");

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const incompletedButton = document.createElement("button");
    incompletedButton.classList.add("green");
    incompletedButton.innerText = "Belum selesai dibaca";
    incompletedButton.addEventListener("click", () => {
      Swal.fire({
        title: "Belum Selesai Baca Buku Ini?",
        html: `Pindahkan buku ke rak <b>Belum selesai dibaca</b>.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Pindahkan",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Buku berhasil dipindahkan!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            incompletedReading(bookObject.id);
          });
        }
      });
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", () => {
      Swal.fire({
        title: "Hapus Buku Ini?",
        text: "Buku akan terhapus secara permanen.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Buku berhasil dihapus!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            deleteBook(bookObject.id);
          });
        }
      });
    });

    action.append(incompletedButton, deleteButton);
    article.append(title, author, year, action);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.innerText = "Selesai dibaca";
    completeButton.addEventListener("click", () => {
      Swal.fire({
        title: "Sudah Selesai Baca Buku Ini?",
        html: `Pindahkan buku ke rak <b>Selesai dibaca</b>.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Pindahkan",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Buku berhasil dipindahkan!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            completedReading(bookObject.id);
          });
        }
      });
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", () => {
      Swal.fire({
        title: "Hapus Buku Ini?",
        text: "Buku akan terhapus secara permanen.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Buku berhasil dihapus!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            deleteBook(bookObject.id);
          });
        }
      });
    });

    action.append(completeButton, deleteButton);
    article.append(title, author, year, action);
  }

  return article;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function completedReading(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function incompletedReading(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

// fitur cari buku
document.querySelector("#searchBookTitle").addEventListener("keyup", () => {
  const title = document.getElementById("searchBookTitle").value.toLowerCase();
  const allBook = document.querySelectorAll(".book_item > h3");

  for (const book of allBook) {
    if (book.innerText.toLowerCase().includes(title)) {
      book.parentElement.parentElement.style.display = "block";
    } else {
      book.parentElement.parentElement.style.display = "none";
    }
  }
});

// storage
const SAVED_EVENT = "saved-book";
const BOOKS_KEY = "BOOK_SHELF";

function isStorageExist() {
  if (typeof Storage == undefined) {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
    return false;
  }

  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsedBook = JSON.stringify(books);
    localStorage.setItem(BOOKS_KEY, parsedBook);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, () => {
  localStorage.getItem(BOOKS_KEY);
});

function loadBook() {
  const serializedData = localStorage.getItem(BOOKS_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
