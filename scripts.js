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
                    <h3 class="book-title" translate="no">${livro.title}</h3>
                `;

                if (isMobile) {
                    bookItem.onclick = () => {
                        showDetails(livro.id);
                        history.pushState({ page: 'details', bookId: livro.id }, `${livro.title}`, `?book=${livro.id}`);
                    };
                } else {
                    const bookTitle = bookItem.querySelector('.book-title');
                    const bookThumbnail = bookItem.querySelector('.book-thumbnail');
                    
                    const handleClick = () => {
                        showDetails(livro.id);
                        history.pushState({ page: 'details', bookId: livro.id }, `${livro.title}`, `?book=${livro.id}`);
                    };

                    bookTitle.onclick = handleClick;
                    bookThumbnail.onclick = handleClick;
                }

                bookList.appendChild(bookItem);
            });
        })
        .catch(error => console.error('Erro ao carregar livros:', error));

    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page === 'details') {
            showDetails(event.state.bookId);
        } else {
            hideDetails();
        }
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
                    const reportButton = document.getElementById('reportButton');
                    
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
                        <button id="reportButton" class="report-button">Reportar</button>
                    `;

                    // Atualiza o estado do botão report
                    updateReportButtonState(bookId);

                    // Evento para enviar dados quando o reportButton é clicado
                    reportButton.addEventListener('click', function () {
                        // Desativa o botão após o envio e muda o texto
                        if (!reportButton.disabled) {
                            const formData = new URLSearchParams();
                            formData.append('entry.1901348521', book.title); // Substitua com o ID do campo do título

                            fetch('https://docs.google.com/forms/d/e/1FAIpQLSftSlghH8SQUnueFUlngEXsD_q73G8y2VfIksgJ8Mq8gRG3Vw/formResponse', {
                                method: 'POST',
                                body: formData,
                                mode: 'no-cors'
                            })
                                .then(() => {
                                    reportButton.disabled = true;
                                    reportButton.textContent = "Avisado!";
                                    saveReportState(bookId);
                                })
                                .catch(error => {
                                    console.error('Erro ao enviar dados:', error);
                                });
                        }
                    });
                }
            })
            .catch(error => console.error('Erro ao carregar detalhes do livro:', error));
    }

    function hideDetails() {
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('details').style.display = 'none';
        history.pushState({ page: 'list' }, 'Book List', '?');
    }

    function updateReportButtonState(bookId) {
        const reportButton = document.getElementById('reportButton');
        const reportedBooks = JSON.parse(localStorage.getItem('reportedBooks')) || [];

        if (reportedBooks.includes(bookId)) {
            reportButton.disabled = true;
            reportButton.textContent = "Avisado!";
        } else {
            reportButton.disabled = false;
            reportButton.textContent = "Link quebrado?";
        }
    }

    function saveReportState(bookId) {
        let reportedBooks = JSON.parse(localStorage.getItem('reportedBooks')) || [];
        if (!reportedBooks.includes(bookId)) {
            reportedBooks.push(bookId);
            localStorage.setItem('reportedBooks', JSON.stringify(reportedBooks));
        }
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

    function resizeSelectToFit(selectId) {
        const select = document.getElementById(selectId);
        const options = Array.from(select.options);
    }
});