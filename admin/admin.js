document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/articles"; // Update this to your API endpoint

    const form = document.getElementById("article-form");
    const articlesTable = document.getElementById("articles-table");

    const articleIdInput = document.getElementById("article-id");
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const priceInput = document.getElementById("price");
    const isFreeInput = document.getElementById("is-free");
    const descriptionInput = document.getElementById("description");
    const fileUploadInput = document.getElementById("file-upload");

    // Load all articles
    function loadArticles() {
        fetch(API_URL)
            .then((response) => response.json())
            .then((articles) => {
                articlesTable.innerHTML = "";
                articles.forEach((article) => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td class="border border-gray-300 px-4 py-2">${article.id}</td>
                        <td class="border border-gray-300 px-4 py-2">${article.title}</td>
                        <td class="border border-gray-300 px-4 py-2">${article.author || "Unknown"}</td>
                        <td class="border border-gray-300 px-4 py-2">${
                            article.is_free ? "Free" : `$${article.price.toFixed(2)}`
                        }</td>
                        <td class="border border-gray-300 px-4 py-2">
                            <button class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600" data-id="${article.id}" data-action="edit">Edit</button>
                            <button class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" data-id="${article.id}" data-action="delete">Delete</button>
                        </td>
                    `;

                    articlesTable.appendChild(row);
                });

                // Attach event listeners
                document.querySelectorAll("button[data-action='edit']").forEach((button) =>
                    button.addEventListener("click", handleEdit)
                );
                document.querySelectorAll("button[data-action='delete']").forEach((button) =>
                    button.addEventListener("click", handleDelete)
                );
            })
            .catch((error) => console.error("Error loading articles:", error));
    }

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("title", titleInput.value);
        formData.append("author", authorInput.value);
        formData.append("price", priceInput.value || 0);
        formData.append("is_free", isFreeInput.checked);
        formData.append("description", descriptionInput.value);
        if (fileUploadInput.files.length > 0) {
            formData.append("file", fileUploadInput.files[0]);
        }

        const method = articleIdInput.value ? "PUT" : "POST";
        const url = articleIdInput.value ? `${API_URL}/${articleIdInput.value}` : API_URL;

        fetch(url, {
            method,
            body: formData,
        })
            .then(() => {
                form.reset();
                loadArticles();
            })
            .catch((error) => console.error("Error saving article:", error));
    });

    // Handle edit
    function handleEdit(e) {
        const articleId = e.target.getAttribute("data-id");
        fetch(`${API_URL}/${articleId}`)
            .then((response) => response.json())
            .then((article) => {
                articleIdInput.value = article.id;
                titleInput.value = article.title;
                authorInput.value = article.author;
                priceInput.value = article.price;
                isFreeInput.checked = article.is_free;
                descriptionInput.value = article.description;
                // File cannot be prefilled due to browser security restrictions
            })
            .catch((error) => console.error("Error fetching article:", error));
    }

    // Handle delete
    function handleDelete(e) {
        const articleId = e.target.getAttribute("data-id");
        fetch(`${API_URL}/${articleId}`, { method: "DELETE" })
            .then(() => loadArticles())
            .catch((error) => console.error("Error deleting article:", error));
    }

    // Initial load
    loadArticles();
});
