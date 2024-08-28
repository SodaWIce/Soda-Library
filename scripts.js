document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('bookList');
    const loading = document.getElementById('loading');
    
    let currentIndex = 0;
    const itemsPerPage = 10; // Número de livros a exibir por vez
    let books = [];
    let isLoading = false;

    // Função para carregar livros
    function loadBooks() {
        if (isLoading || currentIndex >= books.length) return;
        isLoading = true;
        loading.style.display = 'block';

        // Carrega um bloco de livros
        const endIndex = Math.min(currentIndex + itemsPerPage, books.length);
        const booksToLoad = books.slice(currentIndex, endIndex);

        booksToLoad.forEach(livro => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.setAttribute('data-genre', livro.genre.toLowerCase());
            bookItem.innerHTML = `
                <img src="${livro.image}" alt="${livro.title}" class="book-thumbnail">
                <h3 class="book-title">${livro.title}</h3>
            `;

            // Define eventos de clique
            bookItem.onclick = () => {
                showDetails(livro.id);
                history.pushState({page: 'details', bookId: livro.id}, `${livro.title}`, `?book=${livro.id}`);
            };

            bookList.appendChild(bookItem);
        });

        currentIndex = endIndex;
        isLoading = false;
        loading.style.display = 'none';
    }

    // Carrega o JSON de livros
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            books = data.books;
            loadBooks(); // Carrega os livros iniciais
        })
        .catch(error => {
            console.error('Erro ao carregar livros:', error);
        });

    // Configura o IntersectionObserver para carregar mais livros
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading) {
            loadBooks();
        }
    }, {
        rootMargin: '100px' // Carregar antes de chegar no final
    });

    observer.observe(loading);

    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page === 'details') {
            showDetails(event.state.bookId);
        } else {
            hideDetails();
        }
    });
});

function showDetails(bookId) {
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
            }
        })
        .catch(error => console.error('Erro ao carregar detalhes do livro:', error));
}

function hideDetails() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('details').style.display = 'none';
    history.pushState({page: 'list'}, 'Book List', '?');
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
        mode: 'no-cors' // Isso pode causar problemas com a visibilidade das respostas enviadas. Se possível, use 'cors'.
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
    
    reportButton.insertBefore(iconImg, reportButton.firstChild);
}

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