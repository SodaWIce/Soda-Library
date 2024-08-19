document.addEventListener('DOMContentLoaded', () => {
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('bookList');
            data.books.forEach(livro => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');
                bookItem.setAttribute('data-genre', livro.genre.toLowerCase()); // Convertendo gênero para minúsculas
                bookItem.innerHTML = `
                    <img src="${livro.image}" alt="${livro.title}" class="book-thumbnail">
                    <h3 class="book-title">${livro.title}</h3>
                `;
                bookItem.onclick = () => {
                    showDetails(livro.id);
                    history.pushState({page: 'details', bookId: livro.id}, `${livro.title}`, `?book=${livro.id}`);
                };
                bookList.appendChild(bookItem);
            });
        })
        .catch(error => console.error('Erro ao carregar livros:', error));

    // Captura o evento de voltar do navegador/celular
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page === 'details') {
            showDetails(event.state.bookId);
        } else {
            hideDetails(); // Volta para a lista de livros
        }
    });
});

function showDetails(bookId) {
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            const book = data.books.find(b => b.id === bookId);
            if (book) {
                const mainContent = document.getElementById('mainContent');
                const details = document.getElementById('details');
                const detailsContent = document.getElementById('detailsContent');
    
                mainContent.style.display = 'none';
                details.style.display = 'block';
                detailsContent.innerHTML = `
                    <div class="book-header">
                        <img src="${book.image}" alt="${book.title}" class="book-full">
                        <a class="download-link" href="${book.pdf}" target="_blank">Baixar PDF</a>
                    </div>
                    <div class="book-info">
                        <p><strong>Título:</strong> ${book.title}</p>
                        <p><strong>Autor:</strong> ${book.author}</p>
                        <p><strong>Ano de Publicação:</strong> ${book.year}</p>
                        <p><strong>Sinopse:</strong> ${book.synopsis}</p>
                    </div>
                `;
            }
        })
        .catch(error => console.error('Erro ao carregar detalhes do livro:', error));
}

function hideDetails() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('details').style.display = 'none';
    history.pushState({page: 'list'}, 'Book List', '?'); // Atualiza o histórico ao voltar para a lista
}

function filterBooks() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase();
    const books = document.getElementById('bookList').getElementsByClassName('book-item');

    Array.from(books).forEach(book => {
        const title = book.getElementsByClassName('book-title')[0].textContent.toLowerCase();
        const genre = book.getAttribute('data-genre'); // O gênero já está em minúsculas

        // Verifica o filtro de gênero
        let showBook = true;
        if (genreFilter && genreFilter !== 'todos os gêneros' && genre !== genreFilter) {
            showBook = false;
        }

        // Verifica o filtro de título
        if (input && !title.includes(input)) {
            showBook = false;
        }

        // Atualiza a visibilidade do livro com base nas condições acima
        book.style.display = showBook ? '' : 'none';
    });
}