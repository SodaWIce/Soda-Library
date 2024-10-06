document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar e exibir os livros
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

    // Manipulação do popstate para navegação do navegador
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page === 'details') {
            showDetails(event.state.bookId);
        } else {
            hideDetails();
        }
    });

    // Desabilita o arrastar e soltar
    document.addEventListener('dragstart', function(event) {
        event.preventDefault();
    });

    // Manipulação da barra de pesquisa
    const searchInput = document.getElementById('searchInput');
    const searchIconContainer = document.querySelector('.search-icon-container');

    searchInput.addEventListener('input', function () {
        if (searchInput.value.length > 0) {
            searchIconContainer.classList.add('show-clear'); // Mostra o ícone "X"
        } else {
            searchIconContainer.classList.remove('show-clear'); // Mostra a lupa
        }
    });

    // Função para limpar o campo de pesquisa
    const clearSearch = () => {
        searchInput.value = '';  // Limpa o campo de pesquisa
        searchInput.focus();  // Foca novamente no campo de pesquisa
        searchIconContainer.classList.remove('show-clear');  // Volta para a lupa
        filterBooks();  // Exibe todos os livros novamente
    };

    // Adiciona evento de clique no contêiner do ícone para limpar o campo
    searchIconContainer.addEventListener('click', clearSearch);

    // Função de alternância de tema
    const toggleTheme = () => {
        const body = document.body;
        const header = document.querySelector('header');
        const bookItems = document.querySelectorAll('.book-item');
        const searchInput = document.getElementById('searchInput');
        const genreFilter = document.getElementById('genreFilter');
        const backButton = document.getElementById('backButton');
        const reportButton = document.getElementById('reportButton');
        
        // Ícones
        const themeToggleIcon = document.getElementById('themeToggle');
        const searchLupaIcon = document.querySelector('.search-icon-lupa');
        const searchXIcon = document.querySelector('.search-icon-x');
        const reportButtonIcon = document.querySelector('.report-icon');
        const backButtonIcon = document.querySelector('.back-icon');

        // Log para verificar se os elementos foram encontrados
        console.log('Toggle Theme - Elementos:', {
            body,
            header,
            bookItems,
            searchInput,
            genreFilter,
            backButton,
            reportButton,
            themeToggleIcon,
            searchLupaIcon,
            searchXIcon,
            reportButtonIcon,
            backButtonIcon
        });

        // Verifica se todos os elementos necessários foram encontrados
        if (!body || !header || !searchInput || !genreFilter || !backButton || !reportButton || !themeToggleIcon || !searchLupaIcon || !searchXIcon || !reportButtonIcon || !backButtonIcon) {
            console.error('Um ou mais elementos necessários para alternância de tema não foram encontrados.');
            return;
        }

        // Alterna as classes de tema
        if (body.classList.contains('light-theme')) {
            // Remove o tema claro e volta ao padrão (tema escuro)
            body.classList.remove('light-theme');
            header.classList.remove('light-theme');
            bookItems.forEach(item => {
                item.classList.remove('light-theme');
            });

            // Remover classes de elementos específicos
            searchInput.classList.remove('light-theme');
            genreFilter.classList.remove('light-theme');
            backButton.classList.remove('light-theme');
            reportButton.classList.remove('light-theme');

            // Trocar ícones para o tema escuro (padrão)
            themeToggleIcon.src = 'https://i.imgur.com/7ZaM26T.png'; // Ícone padrão do cabeçalho
            searchLupaIcon.src = 'https://i.imgur.com/90y8bbS.png'; // Ícone padrão da lupa
            searchXIcon.src = 'https://i.imgur.com/zBGC0yw.png'; // Ícone padrão de limpar
            reportButtonIcon.src = 'https://i.imgur.com/r5O2N0j.png'; // Ícone padrão de reportar
            backButtonIcon.src = 'https://i.imgur.com/GlZn3zw.png'; // Ícone padrão de voltar

            // Salva a preferência no localStorage
            localStorage.setItem('theme', 'dark');
        } else {
            // Adiciona o tema claro
            body.classList.add('light-theme');
            header.classList.add('light-theme');
            bookItems.forEach(item => {
                item.classList.add('light-theme');
            });

            // Adicionar classes de elementos específicos
            searchInput.classList.add('light-theme');
            genreFilter.classList.add('light-theme');
            backButton.classList.add('light-theme');
            reportButton.classList.add('light-theme');

            // Trocar ícones para o tema claro
            themeToggleIcon.src = 'https://imgur.com/23SH3Qm.png'; // Ícone claro do cabeçalho
            searchLupaIcon.src = 'https://imgur.com/wzRSUO5.png'; // Ícone claro da lupa
            searchXIcon.src = 'https://imgur.com/8P7sffl.png'; // Ícone claro de limpar
            reportButtonIcon.src = 'https://imgur.com/1TExDoB.png'; // Ícone claro de reportar
            backButtonIcon.src = 'https://imgur.com/IB823b1.png'; // Ícone claro de voltar

            // Salva a preferência no localStorage
            localStorage.setItem('theme', 'light');
        }
    };

    // Aplica o tema salvo no localStorage ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        toggleTheme();
    }

    // Adiciona evento de clique no ícone do tema
    const themeToggleIcon = document.getElementById('themeToggle');
    if (themeToggleIcon) {
        themeToggleIcon.addEventListener('click', toggleTheme);
    } else {
        console.error('Elemento com ID "themeToggle" não encontrado.');
    }

    // Função para enviar dados ao Google Formulário
    const reportButton = document.getElementById('reportButton');

    if (reportButton) {
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
                    <img src="https://i.imgur.com/5PDMsZ2.png" alt="Ícone desativado" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                    Avisado!
                `;
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });
        });
    } else {
        console.error('Elemento com ID "reportButton" não encontrado.');
    }

    // Função para reverter o botão após o fechamento dos detalhes do livro
    function resetReportButton() {
        const reportButton = document.getElementById('reportButton'); // Certifica-se de obter o botão aqui
        if (reportButton) {
            reportButton.disabled = false;
            reportButton.innerHTML = `
                <img src="https://i.imgur.com/r5O2N0j.png" alt="Ícone" class="report-icon">
                Link quebrado?
            `;
        } else {
            console.error('Elemento com ID "reportButton" não encontrado ao resetar.');
        }
    }
});

// Função para renderizar o Giscus
function renderGiscus(bookId) {
    // Remove o script do Giscus existente, se houver
    const existingGiscusScript = document.querySelector('script[src="https://giscus.app/client.js"]');
    if (existingGiscusScript) {
        existingGiscusScript.remove();
    }

    // Remove o iframe do Giscus existente, se houver
    const giscusContainer = document.getElementById('giscus-container');
    if (giscusContainer) {
        giscusContainer.innerHTML = '';
    } else {
        console.error('Elemento com ID "giscus-container" não encontrado.');
    }

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
    newGiscusScript.setAttribute('data-theme', 'dark'); // Ajustar conforme o tema atual
    newGiscusScript.setAttribute('data-lang', 'pt');
    newGiscusScript.setAttribute('data-loading', 'lazy');
    newGiscusScript.crossOrigin = 'anonymous';
    newGiscusScript.async = true;

    // Adiciona o novo script ao container Giscus
    if (giscusContainer) {
        giscusContainer.appendChild(newGiscusScript);
    }
}

// Função para exibir detalhes do livro
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

                if (mainContent) mainContent.style.display = 'none';
                if (details) details.style.display = 'block';
                if (detailsContent) {
                    detailsContent.innerHTML = `
                        <div class="book-header">
                            <img src="${book.image}" alt="${book.title}" class="book-full">
                            <a class="download-link" href="${book.pdf}" target="_blank">
                                <img src="https://i.imgur.com/YZ84GTR.png" alt="Ícone" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
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

                // Atualiza a URL para refletir o livro atual
                const newUrl = `?book=${bookId}`;
                history.replaceState({page: 'details', bookId: bookId}, `${book.title}`, newUrl);

                // Recria o widget Giscus para o novo livro
                renderGiscus(bookId);
            }
        })
        .catch(error => console.error('Erro ao carregar detalhes do livro:', error));
}

// Função para esconder detalhes do livro
function hideDetails() {
    const mainContent = document.getElementById('mainContent');
    const details = document.getElementById('details');

    if (mainContent) mainContent.style.display = 'block';
    if (details) details.style.display = 'none';
    history.replaceState({page: 'list'}, 'Book List', '?');
    resetReportButton();  // Reseta o botão quando o usuário clica no botão "Voltar" do site
}

// Função para filtrar livros
function filterBooks() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase();
    const books = document.getElementById('bookList').getElementsByClassName('book-item');

    Array.from(books).forEach(book => {
        const title = book.getElementsByClassName('book-title')[0].textContent.toLowerCase();
        const genre = book.getAttribute('data-genre');

        let showBook = true;
        if (genreFilter && genreFilter !== 'todos' && genre !== genreFilter) {
            showBook = false;
        }

        if (input && !title.includes(input)) {
            showBook = false;
        }

        book.style.display = showBook ? '' : 'none';
    });
}