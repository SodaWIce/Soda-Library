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

    // Função para alternar o ícone ao digitar
    searchInput.addEventListener('input', function () {
        if (searchInput.value.length > 0) {
            searchIconContainer.classList.add('show-clear'); // Adiciona classe para mostrar o ícone "X"
        } else {
            searchIconContainer.classList.remove('show-clear'); // Remove a classe para mostrar o ícone de lupa
        }
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
    newGiscusScript.setAttribute('data-term', `Livro-${bookId}`); // Usa o ID do livro como termo
    newGiscusScript.setAttribute('data-strict', '0');
    newGiscusScript.setAttribute('data-reactions-enabled', '1');
    newGiscusScript.setAttribute('data-emit-metadata', '0');
    newGiscusScript.setAttribute('data-input-position', 'top');
    newGiscusScript.setAttribute('data-theme', 'dark');
    newGiscusScript.setAttribute('data-lang', 'pt');
    newGiscusScript.setAttribute('data-loading', 'lazy');
    newGiscusScript.crossOrigin = 'anonymous';
    newGiscusScript.async = true;

    // Adiciona o novo script ao container Giscus
    giscusContainer.appendChild(newGiscusScript);
}

function showDetails(bookId) {
    // Rolagem suave para o topo
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Faz a rolagem suave
    });

    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            const book = data.books.find(b => b.id === bookId);
            if (book) {
                const mainContent = document.getElementById('mainContent');
                const details = document.getElementById('details');
                const detailsContent = document.getElementById('detailsContent');

                // Esconde o conteúdo atual
                details.style.opacity = 0;

                setTimeout(() => {
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

                    // Mostra o novo conteúdo suavemente
                    details.style.opacity = 1;
                }, 300); // 300 ms de atraso para coincidir com o tempo da transição
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