let currentPage = 1;
const booksPerPage = 50;
let totalBooks = 0;
let isLoading = false;

function renderBooks(data) {
    const bookList = document.getElementById('bookList');
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = Math.min(startIndex + booksPerPage, data.books.length);

    for (let i = startIndex; i < endIndex; i++) {
        const livro = data.books[i];
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.setAttribute('data-genre', livro.genre.toLowerCase());
        bookItem.innerHTML = `
            <img src="${livro.image}" alt="${livro.title}" class="book-thumbnail">
            <h3 class="book-title">${livro.title}</h3>
        `;

        if (window.innerWidth < 768) {
            bookItem.onclick = () => {
                showDetails(livro.id);
                history.pushState({page: 'details', bookId: livro.id}, `${livro.title}`, `?book=${livro.id}`);
            };
        } else {
            const bookTitle = bookItem.querySelector('.book-title');
            const bookThumbnail = bookItem.querySelector('.book-thumbnail');
            
            const handleClick = () => {
                showDetails(livro.id);
                history.pushState({page: 'details', bookId: livro.id}, `${livro.title}`, `?book=${livro.id}`);
            };

            bookTitle.onclick = handleClick;
            bookThumbnail.onclick = handleClick;
        }

        bookList.appendChild(bookItem);
    }

    totalBooks = data.books.length;
}

function fetchBooks() {
    if (isLoading) return;
    isLoading = true;

    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            renderBooks(data);
            isLoading = false;
        })
        .catch(error => {
            console.error('Erro ao carregar livros:', error);
            isLoading = false;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            if ((currentPage - 1) * booksPerPage < totalBooks) {
                currentPage++;
                fetchBooks();
            }
        }
    });

    // Mantém o evento de popstate existente
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page === 'details') {
            showDetails(event.state.bookId);
        } else {
            hideDetails();
        }
    });

    // Mantém o restante do código existente
    const reportButton = document.getElementById('reportButton');
    reportButton.addEventListener('click', function() {
        const detailsContent = document.getElementById('detailsContent').textContent;
        const titleMatch = detailsContent.match(/Título:\s*(.+)/);
        const bookTitle = titleMatch ? titleMatch[1].trim() : 'Título não encontrado';
        const formData = new URLSearchParams();
        formData.append('entry.1901348521', bookTitle);
        fetch('https://docs.google.com/forms/d/e/1FAIpQLSftSlghH8SQUnueFUlngEXsD_q73G8y2VfIksgJ8Mq8gRG3Vw/formResponse', {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(response => {
            console.log('Dados enviados com sucesso..');
            reportButton.disabled = true;
            reportButton.textContent = "Avisado!";
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    });

    function resetReportButton() {
        reportButton.disabled = false;
        reportButton.textContent = "Link quebrado?";
    }

    window.addEventListener('popstate', function() {
        resetReportButton();
    });

    function filterBooks() {
        const input = document.getElementById('searchInput').value.toLowerCase();
        const genreFilter = document.getElementById('genreFilter').value.toLowerCase();
        const books = document.getElementById('bookList').getElementsByClassName('book-item');

        Array.from(books).forEach(book => {
            const title = book.getElementsByClassName('book-title')[0].textContent.toLowerCase();
            const genre = book.getAttribute('data-genre');

            let showBook = true;
            if (genreFilter && genreFilter !== 'todos os gêneros' && genre !== genreFilter) {
                showBook = false;
            }

            if (input && !title.includes(input)) {
                showBook = false;
            }

            book.style.display = showBook ? '' : 'none';
        });
    }
});