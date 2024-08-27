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

                if (isMobile) {
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
        })
        .catch(error => console.error('Erro ao carregar livros:', error));

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
                reportButton.textContent = "Avisado!";

                // Altera os ícones
                reportButton.querySelector('.active-icon').style.display = 'none'; // Esconde o ícone ativo
                reportButton.querySelector('.disabled-icon').style.display = 'inline-block'; // Mostra o ícone desativado
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });
    });
});

// Função para reverter o botão após o fechamento dos detalhes do livro
function resetReportButton() {
    const reportButton = document.getElementById('reportButton');
    reportButton.disabled = false;
    reportButton.textContent = "Link quebrado?";

    // Reverte os ícones para o estado inicial
    reportButton.querySelector('.active-icon').style.display = 'inline-block'; // Mostra o ícone ativo
    reportButton.querySelector('.disabled-icon').style.display = 'none'; // Esconde o ícone desativado
}

// Função para reverter o botão após o fechamento dos detalhes do livro
function resetReportButton() {
    reportButton.disabled = false;
    reportButton.textContent = "Link quebrado?";
}

// Adiciona um evento de popstate para detectar mudanças de página
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
