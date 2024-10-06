document.addEventListener('DOMContentLoaded', () => {
    // Função para aplicar o tema
    const applyTheme = (theme) => {
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
        const reportButtonIcon = reportButton ? reportButton.querySelector('.report-icon') : null;
        const backButtonIcon = document.querySelector('.back-icon');

        // Aplicar ou remover a classe 'light-theme' no corpo e nos elementos relacionados
        if (theme === 'light') {
            body.classList.add('light-theme');
            header.classList.add('light-theme');
            bookItems.forEach(item => item.classList.add('light-theme'));
            if (searchInput) searchInput.classList.add('light-theme');
            if (genreFilter) genreFilter.classList.add('light-theme');
            if (backButton) backButton.classList.add('light-theme');
            if (reportButton) reportButton.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
            header.classList.remove('light-theme');
            bookItems.forEach(item => item.classList.remove('light-theme'));
            if (searchInput) searchInput.classList.remove('light-theme');
            if (genreFilter) genreFilter.classList.remove('light-theme');
            if (backButton) backButton.classList.remove('light-theme');
            if (reportButton) reportButton.classList.remove('light-theme');
        }

        // Atualizar ícones com base no tema
        if (themeToggleIcon) {
            themeToggleIcon.src = theme === 'light' 
                ? 'https://imgur.com/23SH3Qm.png'  // Ícone claro do cabeçalho
                : 'https://i.imgur.com/7ZaM26T.png'; // Ícone escuro do cabeçalho
        }
        if (searchLupaIcon) {
            searchLupaIcon.src = theme === 'light' 
                ? 'https://imgur.com/wzRSUO5.png'  // Ícone claro da lupa
                : 'https://i.imgur.com/90y8bbS.png'; // Ícone escuro da lupa
        }
        if (searchXIcon) {
            searchXIcon.src = theme === 'light' 
                ? 'https://imgur.com/8P7sffl.png'  // Ícone claro de limpar
                : 'https://i.imgur.com/zBGC0yw.png'; // Ícone escuro de limpar
        }
        if (reportButtonIcon) {
            reportButtonIcon.src = theme === 'light' 
                ? 'https://imgur.com/1TExDoB.png'  // Ícone claro de reportar
                : 'https://i.imgur.com/r5O2N0j.png'; // Ícone escuro de reportar
        }
        if (backButtonIcon) {
            backButtonIcon.src = theme === 'light' 
                ? 'https://imgur.com/IB823b1.png'  // Ícone claro de voltar
                : 'https://i.imgur.com/GlZn3zw.png'; // Ícone escuro de voltar
        }

        // Atualizar o tema do Giscus (comentário se necessário)
        const giscusScript = document.querySelector('script[src="https://giscus.app/client.js"]');
        if (giscusScript) {
            giscusScript.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
        }
    };

    // Verifica o tema armazenado e aplica
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Padrão para 'dark'
    applyTheme(currentTheme); // Chama a função applyTheme com o tema atual

    // Função para alternar o tema
    const toggleTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'dark'; // Padrão para 'dark'
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Adicione o evento de clique no ícone de alternância de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ... (outras funções que você já tinha)
});

    // Função para resetar o botão Report com base no tema atual
    const resetReportButton = () => {
        const reportButton = document.getElementById('reportButton');
        if (!reportButton) {
            console.error('Elemento com ID "reportButton" não encontrado ao resetar.');
            return;
        }

        // Verificar o tema atual
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const isLightTheme = currentTheme === 'light';

        // Definir a URL do ícone baseado no tema
        const reportIconUrl = isLightTheme 
            ? 'https://imgur.com/1TExDoB.png' // Ícone claro de reportar
            : 'https://i.imgur.com/r5O2N0j.png'; // Ícone escuro de reportar

        // Resetar o botão
        reportButton.disabled = false;
        reportButton.innerHTML = `
            <img src="${reportIconUrl}" alt="Ícone" class="report-icon">
            Link quebrado?
        `;
    };

    // Função para enviar dados ao Google Formulário e atualizar o botão Report
    const handleReportButtonClick = () => {
        const reportButton = document.getElementById('reportButton');
        if (!reportButton) {
            console.error('Elemento com ID "reportButton" não encontrado.');
            return;
        }

        // Obtém o conteúdo do `detailsContent`
        const detailsContent = document.getElementById('detailsContent');
        if (!detailsContent) {
            console.error('Elemento com ID "detailsContent" não encontrado.');
            return;
        }

        // Extrai o título usando regex
        const titleMatch = detailsContent.textContent.match(/Título:\s*(.+)/);
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
        .then(() => {
            console.log('Dados enviados com sucesso.');

            // Verificar o tema atual
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const isLightTheme = currentTheme === 'light';

            // Definir a URL do ícone de aviso baseado no tema
            const avisoIconUrl = isLightTheme 
                ? 'https://imgur.com/tc1gvoE.png' // Substitua com a URL do ícone "Avisado!" no tema claro
                : 'https://imgur.com/5PDMsZ2.png'; // URL do ícone "Avisado!" no tema escuro

            // Atualiza o botão Report para o estado "Avisado!"
            reportButton.disabled = true;
            reportButton.innerHTML = `
                <img src="${avisoIconUrl}" alt="Ícone desativado" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                Avisado!
            `;
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    };

    // Função para carregar e exibir os livros
    const loadBooks = () => {
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
    };

    // Função para renderizar o Giscus
    const renderGiscus = (bookId) => {
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
        newGiscusScript.setAttribute('data-theme', localStorage.getItem('theme') || 'dark'); // Ajustar conforme o tema atual
        newGiscusScript.setAttribute('data-lang', 'pt');
        newGiscusScript.setAttribute('data-loading', 'lazy');
        newGiscusScript.crossOrigin = 'anonymous';
        newGiscusScript.async = true;

        // Adiciona o novo script ao container Giscus
        if (giscusContainer) {
            giscusContainer.appendChild(newGiscusScript);
        }
    };

    // Função para exibir detalhes do livro
    const showDetails = (bookId) => {
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
    };

    // Função para esconder detalhes do livro
    const hideDetails = () => {
        const mainContent = document.getElementById('mainContent');
        const details = document.getElementById('details');

        if (mainContent) mainContent.style.display = 'block';
        if (details) details.style.display = 'none';
        history.replaceState({page: 'list'}, 'Book List', '?');
        resetReportButton();  // Reseta o botão quando o usuário clica no botão "Voltar" do site
    };

    // Função para filtrar livros
    const filterBooks = () => {
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
    };

    // Aplicar o tema salvo no localStorage ao carregar a página, ou definir como 'dark' se não houver
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Adiciona evento de clique no ícone do tema
    const themeToggleIcon = document.getElementById('themeToggle');
    if (themeToggleIcon) {
        themeToggleIcon.addEventListener('click', toggleTheme);
    } else {
        console.error('Elemento com ID "themeToggle" não encontrado.');
    }

    // Adiciona evento de clique no botão Report
    const reportButton = document.getElementById('reportButton');
    if (reportButton) {
        reportButton.addEventListener('click', handleReportButtonClick);
    } else {
        console.error('Elemento com ID "reportButton" não encontrado.');
    }

    // Adiciona evento de clique no botão Voltar
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            history.back();
        });
    } else {
        console.error('Elemento com ID "backButton" não encontrado.');
    }

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

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            if (searchInput.value.length > 0) {
                searchIconContainer.classList.add('show-clear'); // Mostra o ícone "X"
            } else {
                searchIconContainer.classList.remove('show-clear'); // Mostra a lupa
            }
        });
    } else {
        console.error('Elemento com ID "searchInput" não encontrado.');
    }

    // Função para limpar o campo de pesquisa
    const clearSearch = () => {
        if (!searchInput) return;
        searchInput.value = '';  // Limpa o campo de pesquisa
        searchInput.focus();  // Foca novamente no campo de pesquisa
        searchIconContainer.classList.remove('show-clear');  // Volta para a lupa
        filterBooks();  // Exibe todos os livros novamente
    };

    // Adiciona evento de clique no contêiner do ícone para limpar o campo
    if (searchIconContainer) {
        searchIconContainer.addEventListener('click', clearSearch);
    } else {
        console.error('Elemento com a classe "search-icon-container" não encontrado.');
    }

    // Carrega os livros após configurar todos os eventos e temas
    loadBooks();
});

// Função para renderizar o Giscus (fora do DOMContentLoaded para evitar conflitos)
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
    newGiscusScript.setAttribute('data-theme', localStorage.getItem('theme') || 'dark'); // Ajustar conforme o tema atual
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