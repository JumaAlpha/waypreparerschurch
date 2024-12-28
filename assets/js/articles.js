function loadArticles() {
    fetch('http://localhost:3000/articles')
        .then(response => response.json())
        .then(articles => {
            const articlesContainer = document.getElementById('articles-container');
            const searchInput = document.getElementById('search-input');
            
            // Function to render filtered articles
            const renderArticles = (filter = '') => {
                articlesContainer.innerHTML = ''; // Clear the container
                const filteredArticles = articles.filter(article =>
                    article.title.toLowerCase().includes(filter.toLowerCase()) ||
                    (article.author && article.author.toLowerCase().includes(filter.toLowerCase()))
                );

                filteredArticles.forEach(article => {
                    const articleDiv = document.createElement('div');
                    articleDiv.className =
                        'bg-white rounded-lg shadow-md p-5 mb-4 flex items-center justify-between border border-gray-200';

                    articleDiv.innerHTML = `
                        <div>
                            <h2 class="text-xl font-semibold text-gray-800">${article.title}</h2>
                            <p class="text-sm text-gray-500"><strong>Author:</strong> ${article.author || 'Unknown'}</p>
                            <p class="text-sm text-gray-500"><strong>Price:</strong> ${
                                article.is_free
                                    ? '<span class="text-green-600 font-bold">Free</span>'
                                    : `<span class="text-blue-600 font-bold">$${article.price.toFixed(2)}</span>`
                            }</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button
                                class="view-preview flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                                data-id="${article.id}" data-url="${article.pdf_url}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m4 8H9m4-16H9M5 12h2M5 12h2m4 8h2m-6 0H5m14-8h2m-6-8h2m-6-8h2" />
                                </svg>
                                Preview
                            </button>
                            ${
                                !article.is_free && !article.is_purchased
                                    ? `<button
                                        class="purchase flex items-center px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                                        data-id="${article.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4m4 8H5a2 2 0 01-2-2v-6a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-3m0 4v-2m4 4h-6m2-8H7" />
                                        </svg>
                                        Purchase
                                    </button>`
                                    : ''
                            }
                            ${
                                article.is_free || article.is_purchased
                                    ? `<button
                                        class="download flex items-center px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md"
                                        data-id="${article.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v6a2 2 0 002 2h12a2 2 0 002-2v-6m-2 4H6m-2-4h14m-2-8h2M5 12h14m-6 4h6" />
                                        </svg>
                                        Download
                                    </button>`
                                    : ''
                            }
                        </div>
                    `;

                    articlesContainer.appendChild(articleDiv);
                });

                // Attach event listeners for buttons
                document.querySelectorAll('.view-preview').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const articleUrl = e.target.getAttribute('data-url');
                        displayPDFPreview(articleUrl);
                    });
                });

                document.querySelectorAll('.purchase').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const articleId = e.target.getAttribute('data-id');
                        purchaseArticle(articleId);
                    });
                });

                document.querySelectorAll('.download').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const articleId = e.target.getAttribute('data-id');
                        downloadArticle(articleId);
                    });
                });
            };

            // Initial rendering of articles
            renderArticles();

            // Filter articles on search input
            searchInput.addEventListener('input', (e) => {
                renderArticles(e.target.value);
            });
        })
        .catch(error => console.error('Error fetching articles:', error));
}

// Function to display PDF in a modal
function displayPDFPreview(pdfUrl) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center';
    modal.innerHTML = `
        <div class="bg-white rounded-lg overflow-hidden w-3/4 h-3/4">
            <div class="flex justify-end p-2">
                <button id="close-modal" class="text-red-500 hover:text-red-700">Close</button>
            </div>
            <iframe src="${pdfUrl}" class="w-full h-full" frameborder="0"></iframe>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });
}


// Handle article purchase
function purchaseArticle(articleId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg w-96 shadow-lg overflow-hidden">
            <div class="bg-green-500 text-white text-center py-4">
                <h2 class="text-lg font-semibold">Purchase Unavailable</h2>
            </div>
            <div class="p-6 text-center">
                <p class="text-gray-700 mb-4">
                    Purchases are currently unavailable. However, you can contact us via WhatsApp to get your copy.
                </p>
                <a id="whatsapp-link" href="#" target="_blank"
                   class="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.001 0C5.37 0 0 5.372 0 12.003c0 2.145.563 4.24 1.631 6.08L0 24l5.918-1.602a12.057 12.057 0 006.083 1.604c6.629 0 12.001-5.371 12.001-12.001C24.002 5.372 18.63 0 12.001 0zm6.377 17.27c-.265.747-1.543 1.426-2.11 1.487-.54.06-1.212.106-3.633-1.121-3.057-1.566-5.036-5.353-5.194-5.61-.157-.256-1.236-1.645-1.236-3.136 0-1.49.78-2.22 1.057-2.521.277-.3.597-.375.797-.375s.398-.007.574.01c.186.017.444-.071.694.533.265.637.902 2.205.983 2.364.081.157.132.343.023.556-.109.213-.164.343-.32.527-.157.183-.332.408-.474.547-.157.157-.32.33-.138.645.18.31.8 1.311 1.707 2.115 1.172 1.039 2.159 1.36 2.47 1.517.32.157.508.132.69-.08.183-.213.793-.923 1.006-1.24.211-.317.42-.263.695-.157.274.106 1.735.82 2.034.97.3.157.5.237.574.375.083.14.083.778-.182 1.524z"/>
                    </svg>
                    Contact Us on WhatsApp
                </a>
            </div>
            <div class="bg-gray-100 p-4 flex justify-center">
                <button id="close-modal" class="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Get the WhatsApp link and dynamically update it
    const sellerPhone = "254712345678"; // Replace with actual phone number
    const message = `Hi, I am interested in purchasing the article with ID ${articleId}.`;
    const whatsappLink = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
    document.getElementById('whatsapp-link').href = whatsappLink;

    // Close modal event
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
    });
}

// Download article
// Render content for preview or full view in modal
function showPopup(article, mode) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    // Check if the article and its content are defined
    if (!article || !article.content) {
        console.error('Article content is missing or not available.');
        return;
    }

    if (typeof article.content !== 'string') {
        console.error('Article content is not a valid string.');
        return;
    }

    const paragraphs = article.content.split('\n').filter(p => p.trim()); // Split content by line breaks
    const itemsPerPage = 3; // Number of paragraphs per page
    let currentPage = 0;

    const renderPage = (page) => {
        modalContent.innerHTML = `
            <h2 class="text-xl font-semibold">${article.title}</h2>
            <p><strong>Author:</strong> ${article.author || 'Unknown'}</p>
            ${paragraphs.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map(p => `<p>${p}</p>`).join('')}
            <div id="pagination-controls" class="flex space-x-2 mt-4">
                ${page > 0 ? `<button id="prev-page" class="px-4 py-2 bg-gray-300 rounded-md">Previous</button>` : ''}
                ${page < Math.ceil(paragraphs.length / itemsPerPage) - 1 ? `<button id="next-page" class="px-4 py-2 bg-gray-300 rounded-md">Next</button>` : ''}
            </div>
            <button id="close-modal" class="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md">Close</button>
        `;

        // Pagination controls
        if (page > 0) {
            document.getElementById('prev-page').addEventListener('click', () => {
                currentPage--;
                renderPage(currentPage);
            });
        }
        if (page < Math.ceil(paragraphs.length / itemsPerPage) - 1) {
            document.getElementById('next-page').addEventListener('click', () => {
                currentPage++;
                renderPage(currentPage);
            });
        }

        // Close modal
        document.getElementById('close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    };

    renderPage(currentPage); // Render the first page
    modal.style.display = 'block';
}

// Run on page load
document.addEventListener('DOMContentLoaded', loadArticles);
