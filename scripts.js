document.addEventListener('DOMContentLoaded', () => {
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('bookList');
            const isMobile = window.innerWidth < 768; // Detecta se é um dispositivo móvel

            data.books.forEach(livro => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');
                bookItem.setAttribute('data-genre', livro.genre.toLowerCase());
                bookItem.innerHTML = `
                    <img src="${livro.image}" alt="${livro.title}" class="book-thumbnail">
                    <h3 class="book-title">${livro.title}</h3>
                `;

                const handleClick = () => {
                    showDetails(livro.id);
                    history.pushState({page: 'details', bookId: livro.id}, `${livro.title}`, `?book=${livro.id}`);
                };

                if (isMobile) {
                    bookItem.onclick = handleClick;
                } else {
                    const bookTitle = bookItem.querySelector('.book-title');
                    const bookThumbnail = bookItem.querySelector('.book-thumbnail');
                    bookTitle.onclick = handleClick;
                    bookThumbnail.onclick = handleClick;
                }

                bookList.appendChild(bookItem);
            });

            // Verifica a URL inicial para carregar o livro correto, se necessário
            const urlParams = new URLSearchParams(window.location.search);
            const bookId = urlParams.get('book');
            if (bookId) {
                showDetails(bookId, false);
                history.replaceState({page: 'details', bookId: bookId}, '', `?book=${bookId}`);
            } else {
                showBookList();  // Mostrar lista de livros como estado inicial
            }
        })
        .catch(error => console.error('Erro ao carregar livros:', error));

    window.addEventListener('popstate', function(event) {
        if (event.state) {
            if (event.state.page === 'details') {
                showDetails(event.state.bookId, false); // Não adicionar novo estado ao histórico
            } else if (event.state.page === 'list') {
                showBookList();
            }
        } else {
            showBookList(); // Exibir lista de livros se o estado for nulo
        }
    });

    // Adicione o evento dragstart para desabilitar o arrastar e soltar
    document.addEventListener('dragstart', function(event) {
        event.preventDefault();
    });

    // Configura o botão "Voltar" do site para exibir a lista de livros
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            showBookList();
            history.pushState({page: 'list'}, 'Book List', '?'); // Garante que o estado da lista seja restaurado
        });
    }
});

function renderGiscus(bookId) {
    // Remove o script do Giscus existente, se houver
    const existingGiscusScript = document.querySelector('script[src="https://giscus.app/client.js"]');
    if (existingGiscusScript) {
        existingGiscusScript.remove();
    }

    // Remove o iframe do Giscus existente, se houver
    const giscusContainer = document.getElementById('giscus-container');
    giscusContainer.innerHTML = '';

    // Cria um novo script Giscus com os parâmetros atualizados
    const newGiscusScript = document.createElement('script');
    newGiscusScript.src = 'https://giscus.app/client.js';
    newGiscusScript.setAttribute('data-repo', 'SodaWIce/Soda-Library');
    newGiscusScript.setAttribute('data-repo-id', 'R_kgDOMleTGg');
    newGiscusScript.setAttribute('data-category-id', 'DIC_kwDOMleTGs4CiAr4');
    newGiscusScript.setAttribute('data-mapping', 'specific');
    newGiscusScript.setAttribute('data-term', `Livro-${bookId}`);
    newGiscusScript.setAttribute('data-strict', '0');
    newGiscusScript.setAttribute('data-reactions-enabled', '1');
    newGiscusScript.setAttribute('data-emit-metadata', '0');
    newGiscusScript.setAttribute('data-input-position', 'top');
    newGiscusScript.setAttribute('data-theme', 'dark');
    newGiscusScript.setAttribute('data-lang', 'pt');
    newGiscusScript.setAttribute('data-loading', 'lazy');
    newGiscusScript.crossOrigin = 'anonymous';
    newGiscusScript.async = true;

    newGiscusScript.addEventListener('load', () => {
        console.log('Giscus carregado com sucesso.');
    });

    giscusContainer.appendChild(newGiscusScript);
}

function showDetails(bookId, pushState = true) {
    window.scrollTo(0, 0);

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
                        <a class="download-link" href="${book.pdf}" target="_blank">
                            <img src="https://imgur.com/YZ84GTR.png" alt="Ícone" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                            Baixar PDF
                        </a>
                    </div>
                    <div class="book-info">
                        <p><strong>Título:</strong> ${book.title}</p>
                        <p><strong>Autor:</strong> ${book.author}</p>
                        <p><strong>Ano de Publicação:</strong> ${book.year}</p>
                        <p><strong>Sinopse:</strong> ${book.synopsis}</p>
                    </div>
                `;

                if (pushState) {
                    history.pushState({page: 'details', bookId: bookId}, `${book.title}`, `?book=${bookId}`);
                }

                renderGiscus(bookId);
            }
        })
        .catch(error => console.error('Erro ao carregar detalhes do livro:', error));
}

function showBookList() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('details').style.display = 'none';
    history.replaceState({page: 'list'}, 'Book List', '?'); // Garante que o estado da lista de livros seja restaurado
    resetReportButton();  // Reseta o botão quando o usuário clica no botão "Voltar" do site
}

function resetReportButton() {
    const reportButton = document.getElementById('reportButton');
    if (reportButton) {
        reportButton.disabled = false;
        reportButton.innerHTML = ""; // Remove todo o conteúdo para evitar duplicação

        const iconImg = document.createElement('img');
        iconImg.src = "https://imgur.com/r5O2N0j.png";
        iconImg.alt = "Ícone";
        iconImg.style.width = "20px";
        iconImg.style.height = "20px";
        iconImg.style.verticalAlign = "middle";
        iconImg.style.marginRight = "8px";

        const buttonText = document.createTextNode("Link quebrado?");
        
        reportButton.appendChild(iconImg);
        reportButton.appendChild(buttonText);

        // Reaplica o evento de clique para executar a ação desejada
        reportButton.onclick = function() {
            // Sua ação aqui, como enviar um relatório ou realizar outra tarefa
            console.log('Botão Report foi clicado!');
        };
    }
}

// Evento para reverter o botão quando o estado muda
window.addEventListener('popstate', function(event) {
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