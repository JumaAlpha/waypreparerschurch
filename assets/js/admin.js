document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-book-form');
    const booksList = document.getElementById('books-list');

    // Function to fetch books
    const fetchBooks = () => {
        fetch('http://localhost:3000/articles')
            .then(response => response.json())
            .then(books => {
                booksList.innerHTML = ''; // Clear previous entries

                books.forEach(book => {
                    const bookRow = document.createElement('tr');

                    bookRow.innerHTML = `
                        <td class="py-2 px-4">${book.title}</td>
                        <td class="py-2 px-4">${book.description}</td>
                        <td class="py-2 px-4">${book.price == 0 ? 'Free' : `$${book.price.toFixed(2)}`}</td>
                        <td class="py-2 px-4">
                            <button class="edit-book bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" data-id="${book.id}">
                                Edit
                            </button>
                            <button class="delete-book bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" data-id="${book.id}">
                                Delete
                            </button>
                        </td>
                    `;
                    booksList.appendChild(bookRow);
                });

                // Attach event listeners to action buttons
                document.querySelectorAll('.edit-book').forEach(button => {
                    button.addEventListener('click', handleEdit);
                });

                document.querySelectorAll('.delete-book').forEach(button => {
                    button.addEventListener('click', handleDelete);
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    };

    // Function to handle book upload
    const uploadBook = (event) => {
        event.preventDefault();

        const title = document.getElementById('book-title').value;
        const description = document.getElementById('book-description').value;
        const price = document.getElementById('book-price').value;
        const fileInput = document.getElementById('book-file');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('file', file);

        fetch('http://localhost:3000/articles', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Book uploaded successfully!');
                uploadForm.reset();
                fetchBooks();
            })
            .catch(error => console.error('Error uploading book:', error));
    };

    // Function to handle book deletion
    const handleDelete = (event) => {
        const bookId = event.target.getAttribute('data-id');

        fetch(`http://localhost:3000/articles/${bookId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Book deleted successfully!');
                fetchBooks();
            })
            .catch(error => console.error('Error deleting book:', error));
    };

    // Function to handle book editing (placeholder)
    const handleEdit = (event) => {
        const bookId = event.target.getAttribute('data-id');
        alert(`Edit functionality for book ID ${bookId} coming soon!`);
        // Implement edit functionality as needed
    };

    // Attach event listener to the form
    uploadForm.addEventListener('submit', uploadBook);

    // Fetch books on page load
    fetchBooks();
});
