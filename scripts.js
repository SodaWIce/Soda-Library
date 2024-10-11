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
        const title = book.title.toLowerCase();
        const genre = book.genre.toLowerCase();

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
    
    // Atualiza a exibição dos livros automaticamente
    renderBooks(); // Chama a função para renderizar os livros filtrados
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

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const giscusContainer = document.getElementById('giscus-container');
const bookId = 'Livro-Inicial'; // Substitua pelo ID do livro

// Verifica se o tema foi salvo no localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'tema-claro') {
    body.classList.add('tema-claro');
    updateIcons('tema-claro');
    updateGiscusTheme('light');
} else {
    updateGiscusTheme('dark');
}

// Alterna o tema ao clicar
themeToggle.addEventListener('click', () => {
    body.classList.toggle('tema-claro');
    const isLightTheme = body.classList.contains('tema-claro');

    if (isLightTheme) {
        localStorage.setItem('theme', 'tema-claro');
        updateIcons('tema-claro');
        updateGiscusTheme('light');
    } else {
        localStorage.removeItem('theme');
        updateIcons('default');
        updateGiscusTheme('dark');
    }
});

// Atualiza os ícones conforme o tema
function updateIcons(theme) {
    const icons = {
        claro: {
            backButton: 'https://imgur.com/xbvjaVe.png',
            searchIconX: 'https://imgur.com/Pwd8YI7.png',
            searchIconLupa: 'https://imgur.com/uLSgVhx.png',
            themeIcon: 'https://imgur.com/lE4oMBX.png'
        },
        escuro: {
            backButton: 'https://imgur.com/GlZn3zw.png',
            searchIconX: 'https://imgur.com/zBGC0yw.png',
            searchIconLupa: 'https://imgur.com/90y8bbS.png',
            themeIcon: 'https://imgur.com/7ZaM26T.png'
        }
    };
    
    const selectedIcons = theme === 'tema-claro' ? icons.claro : icons.escuro;
    document.querySelector('.back-button img').src = selectedIcons.backButton;
    document.querySelector('.search-icon-x').src = selectedIcons.searchIconX;
    document.querySelector('.search-icon-lupa').src = selectedIcons.searchIconLupa;
    document.querySelector('.icon').src = selectedIcons.themeIcon;
}

// Atualiza o tema do Giscus sem recriar o script
function updateGiscusTheme(theme) {
    const giscusIframe = giscusContainer.querySelector('iframe');
    if (giscusIframe) {
        giscusIframe.contentWindow.postMessage({
            giscus: {
                setConfig: { theme: theme }
            }
        }, 'https://giscus.app');
    }
}

// Função para colorir os SVGs conforme o tema
function verificarTema() {
    const isLightTheme = body.classList.contains('tema-claro');
    fillColorSVG.forEach(svg => {
        svg.style.fill = isLightTheme ? 'black' : 'white';
    });
}

// Muda a cor dos SVGs ao alternar o tema
function mudarTema() {
    verificarTema();
}

// Funções para o botão de link quebrado
function btnLinkQuebrado() {
    svgBefore.style.display = 'none';
    svgAfter.style.display = 'block';
}

function resetIconBtnLinkQuebrado() {
    svgBefore.style.display = 'block';
    svgAfter.style.display = 'none';
    reportButton.disabled = false;
    document.getElementById('textBtnLinkQuebrado').innerText = 'Link quebrado?';
}

// Eventos para navegação e popstate
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page === 'details') {
        showDetails(event.state.bookId);
    } else {
        hideDetails();
    }
});