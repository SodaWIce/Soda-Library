// Definir variáveis globais de paginação
let allBooks = [];          // Armazena todos os livros carregados
let filteredBooks = [];     // Armazena os livros filtrados após a busca
let currentPage = 1;        // Página atual
const booksPerPage = 50;    // Número de livros por página

function filterBooks() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase();

    // Usar a variável global allBooks em vez de redefini-la
    filteredBooks = allBooks.filter(book => {
        const title = book.title.toLowerCase(); // Assume que `title` é um campo de objeto
        const genre = book.genre.toLowerCase(); // Assumindo que `genre` é uma propriedade do objeto
        
        let matchesFilter = true;

        // Verifica o gênero
        if (genreFilter && genreFilter !== 'todos os gêneros' && genre !== genreFilter) {
            matchesFilter = false;
        }

        // Verifica o título
        if (input && !title.includes(input)) {
            matchesFilter = false;
        }

        return matchesFilter;
    });

    // Recalcula a página atual, sempre reiniciando para a primeira página após o filtro
    currentPage = 1;
    updatePagination(filteredBooks);
}

// Função para atualizar a paginação com os livros filtrados
function updatePagination(filteredBooks) {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    // Atualiza a interface da paginação com os novos livros
    displayBooksForPage(currentPage, filteredBooks);
    renderPagination(totalPages);
}

// Chamar a função de filtro sempre que houver entrada na barra de pesquisa ou seleção de gênero
document.getElementById('searchInput').addEventListener('input', filterBooks);
document.getElementById('genreFilter').addEventListener('change', filterBooks);

document.addEventListener('DOMContentLoaded', () => {
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            // Armazena todos os livros
            allBooks = data.books;
            filteredBooks = allBooks;

            // Renderiza a primeira página
            renderBooks();

            // Verifica a URL inicial para carregar o livro correto, se necessário
            const urlParams = new URLSearchParams(window.location.search);
            const bookId = urlParams.get('book');
            if (bookId) {
                showDetails(bookId);
                history.replaceState({page: 'details', bookId: bookId}, '', `?book=${bookId}`);
            }
        })
        .catch(error => console.error('Erro ao carregar livros:', error));

    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page === 'details') {
            showDetails(event.state.bookId);
        } else {
            hideDetails();
        }
    });

    // Adicione o evento dragstart para desabilitar o arrastar e soltar
    document.addEventListener('dragstart', function(event) {
        event.preventDefault();
    });
    
    const searchInput = document.getElementById('searchInput');
    const searchIconContainer = document.querySelector('.search-icon-container');

    // Função para alternar o ícone ao digitar e filtrar os livros
    searchInput.addEventListener('input', function () {
        if (searchInput.value.length > 0) {
            searchIconContainer.classList.add('show-clear'); // Adiciona classe para mostrar o ícone "X"
        } else {
            searchIconContainer.classList.remove('show-clear'); // Remove a classe para mostrar o ícone de lupa
        }
        
        // Chama a função de filtro
        filterBooks();
    });

    // Função para limpar o campo de pesquisa ao clicar no ícone "X"
    const clearSearch = () => {
        searchInput.value = '';  // Limpa o campo de pesquisa
        searchInput.focus();  // Foco no campo de pesquisa novamente
        searchIconContainer.classList.remove('show-clear');  // Volta para o ícone de lupa
        filterBooks();  // Chama a função de filtro para mostrar todos os itens novamente
    };

    // Adiciona evento de clique no contêiner do ícone para limpar o campo
    searchIconContainer.addEventListener('click', clearSearch);
});

// Função para renderizar os livros na página atual
function renderBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // Limpa a lista atual

    // Calcula os índices de início e fim para os livros a serem exibidos
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginatedBooks = filteredBooks.slice(start, end);

    // Cria os elementos HTML para cada livro
    paginatedBooks.forEach(livro => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.setAttribute('data-genre', livro.genre.toLowerCase());
        bookItem.innerHTML = `
            <img src="${livro.image}" alt="${livro.title}" class="book-thumbnail" loading="lazy">
            <h3 class="book-title">${livro.title}</h3>
        `;

        if (window.innerWidth < 768) { // Detecta se é um dispositivo móvel
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
    });

    // Renderiza a paginação
    renderPagination();
}

// Função para renderizar os botões de paginação
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Limpa a paginação atual

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    if (totalPages <= 0) return; // Adiciona verificação para evitar erros

    // Limite de páginas a serem exibidas (opcional)
    const maxPagesToShow = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Botão "Anterior"
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Anterior';
        prevButton.addEventListener('click', () => {
            currentPage--;
            renderBooks();
            window.scrollTo(0, 0); // Opcional: rola para o topo
        });
        pagination.appendChild(prevButton);
    }

    // Botões de página
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            renderBooks();
            window.scrollTo(0, 0);
        });
        pagination.appendChild(btn);
    }

    // Botão "Próximo"
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Próximo';
        nextButton.addEventListener('click', () => {
            currentPage++;
            renderBooks();
            window.scrollTo(0, 0);
        });
        pagination.appendChild(nextButton);
    }
}

// Função para exibir detalhes do livro (implemente conforme sua necessidade)
function showDetails(bookId) {
    window.scrollTo(0, 0);

    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            const book = data.books.find(b => b.id == bookId); // Use == para comparar string e número
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

                // Atualiza a URL para refletir o livro atual
                const newUrl = `?book=${bookId}`;
                history.replaceState({page: 'details', bookId: bookId}, `${book.title}`, newUrl);

                // Recria o widget Giscus para o novo livro
                renderGiscus(bookId);
            }
        })
        .catch(error => console.error('Erro ao carregar detalhes do livro:', error));
}

function hideDetails() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('details').style.display = 'none';
    history.replaceState({page: 'list'}, 'Book List', '?');
    resetReportButton();  // Reseta o botão quando o usuário clica no botão "Voltar" do site
}

// Obtém o botão de reporte
const reportButton = document.getElementById('reportButton');

// Adiciona o evento de clique no botão de reporte
reportButton.addEventListener('click', function() {
    // Obtém o conteúdo do `detailsContent`
    const detailsContent = document.getElementById('detailsContent').textContent;

    // Procura a linha que contém o título usando "Título:"
    const titleMatch = detailsContent.match(/Título:\s*(.+)/);

    // Se encontrar o título, captura o texto correspondente
    const bookTitle = titleMatch ? titleMatch[1].trim() : 'Título não encontrado';

    // Cria um objeto FormData para enviar os dados
    const formData = new URLSearchParams();
    formData.append('entry.1901348521', bookTitle); // Substitua com o ID do campo do título

    // Envia os dados para o Google Formulário
    fetch('https://docs.google.com/forms/d/e/1FAIpQLSftSlghH8SQUnueFUlngEXsD_q73G8y2VfIksgJ8Mq8gRG3Vw/formResponse', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Isso pode causar problemas com a visibilidade das respostas enviadas. Se possível, use 'cors.'
    })
    .then(response => {
        console.log('Dados enviados com sucesso..');
        // Desativa o botão após o envio e muda o texto
        reportButton.disabled = true;
        reportButton.innerHTML = `
            <img src="https://imgur.com/5PDMsZ2.png" alt="Ícone desativado" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
            Avisado!
        `;
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
    });
});

// Função para reverter o botão após o fechamento dos detalhes do livro
function resetReportButton() {
    reportButton.disabled = false;
    reportButton.textContent = "Link quebrado?";
    
    // Recria o ícone e adiciona ao botão
    const iconImg = document.createElement('img');
    iconImg.src = "https://imgur.com/r5O2N0j.png";
    iconImg.alt = "Ícone";
    iconImg.style.width = "20px";
    iconImg.style.height = "20px";
    iconImg.style.verticalAlign = "middle";
    iconImg.style.marginRight = "8px";
    
    // Limpa o conteúdo atual do botão e adiciona o ícone e texto
    reportButton.innerHTML = '';
    reportButton.appendChild(iconImg);
    reportButton.appendChild(document.createTextNode("Link quebrado?"));
}

// Adiciona um evento de popstate para detectar mudanças de página
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page === 'details') {
        showDetails(event.state.bookId);
    } else {
        hideDetails();
    }
});