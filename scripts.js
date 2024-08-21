document.addEventListener('DOMContentLoaded', () => {
    let booksData = null;  // Variável global para armazenar os dados dos livros

    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            booksData = data.books;  // Armazena os dados na variável global
            const bookList = document.getElementById('bookList');
            const isMobile = window.innerWidth < 768; // Detecta se é um dispositivo móvel

            booksData.forEach(livro => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');
                bookItem.setAttribute('data-genre', livro.genre.toLowerCase());
                bookItem.innerHTML = `
                    <img src="${livro.image}" alt="${livro.title}" class="book-thumbnail">
                    <h3 class="book-title"translate="no">${livro.title}</h3>
                `;

                const handleClick = () => {
                    showDetails(livro.id);
                    history.pushState({ page: 'details', bookId: livro.id }, `${livro.title}`, `?book=${livro.id}`);
                };

                if (isMobile) {
                    bookItem.onclick = handleClick;
                } else {
                    bookItem.querySelector('.book-title').onclick = handleClick;
                    bookItem.querySelector('.book-thumbnail').onclick = handleClick;
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

    resizeSelectToFit('genreFilter');
    window.addEventListener('resize', () => resizeSelectToFit('genreFilter'));
    document.getElementById('genreFilter').addEventListener('change', () => resizeSelectToFit('genreFilter'));
});

function showDetails(bookId) {
    window.scrollTo(0, 0);

    const book = booksData.find(b => b.id === bookId);
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
    } else {
        console.error('Livro não encontrado:', bookId);
    }
}

function hideDetails() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('details').style.display = 'none';
    history.pushState({ page: 'list' }, 'Book List', '?');
}

document.addEventListener('DOMContentLoaded', function() {
    const reportButton = document.getElementById('reportButton');
    const backButton = document.getElementById('backButton');
    const originalButtonText = reportButton.textContent;

    reportButton.addEventListener('click', function() {
        const detailsContent = document.getElementById('detailsContent').textContent;
        const titleMatch = detailsContent.match(/Título:\s*(.+)/);
        const bookTitle = titleMatch ? titleMatch[1].trim() : 'Título não encontrado';

        const formData = new URLSearchParams();
        formData.append('entry.1901348521', bookTitle);

        fetch('https://docs.google.com/forms/d/e/1FAIpQLSftSlghH8SQUnueFUlngEXsD_q73G8y2VfIksgJ8Mq8gRG3Vw/formResponse', {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            console.log('Dados enviados com sucesso.');
            reportButton.disabled = true;
            reportButton.textContent = "Avisado!";
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    });

    backButton.addEventListener('click', function() {
        console.log('Back button clicked');
        resetReportButton();
    });

    function resetReportButton() {
        if (reportButton) {
            reportButton.disabled = false;
            reportButton.textContent = originalButtonText;
        }
    }

    window.addEventListener('popstate', function(event) {
        if (!event.state || event.state.page === 'list') {
            resetReportButton();
        }
    });

    if (window.location.search === '') {
        resetReportButton();
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

function resizeSelectToFit(selectId) {
    const select = document.getElementById(selectId);
    const options = Array.from(select.options);
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    document.body.appendChild(tempSpan);

    let maxWidth = 0;
    options.forEach(option => {
        tempSpan.textContent = option.textContent;
        const width = tempSpan.offsetWidth;
        if (width > maxWidth) {
            maxWidth = width;
        }
    });

    document.body.removeChild(tempSpan);

    const minFontSize = 10;
    let fontSize = parseFloat(window.getComputedStyle(select).fontSize);
    select.style.fontSize = fontSize + 'px';

    while (select.scrollWidth > select.clientWidth && fontSize > minFontSize) {
        fontSize -= 1;
        select.style.fontSize = fontSize + 'px';
    }
}