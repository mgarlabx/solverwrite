import auth from "./auth.js";
import settings from "./settings.js";
const book = {

    language: document.getElementById('input-language').value,
    title: '',
    subtitle: '',
    author: '',
    chapters: [],
    path: '',

    select() {
        settings.bookId = document.getElementById('select-book').value;
        localStorage.setItem('solverbooks_bookId', 'book-' + settings.bookId);
        window.location.reload();
    },


    async load() {
        const url = `https://w5rotl5zo2qgefnmwyjls4jtlm0mafzb.lambda-url.us-west-2.on.aws/books/?language=${this.language}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const book = data.find(book => book.bookId === 'book-' + settings.bookId);
            this.chapters = book.chapters;
            this.chapters = this.chapters.sort((a, b) => a.chapterOrder - b.chapterOrder);
            this.title = book.title;
            this.subtitle = book.subtitle;
            this.author = book.author;
            this.path = book.path;
        } catch (error) {
            console.log(error);
            throw error; 
        }
    },



    async download() {
        this.language = document.getElementById('input-language').value;
        const url = `https://w5rotl5zo2qgefnmwyjls4jtlm0mafzb.lambda-url.us-west-2.on.aws/book/?language=${this.language}&bookId=book-${settings.bookId}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            //Sort pages by chapter order and page order
            let sortedPages = [];
            if (data.length > 0) {
                this.chapters.forEach(chapter => {
                    let pages = data.filter(page => page.chapterNumber == chapter.chapterNumber);
                    pages.sort((a, b) => a.pageOrder - b.pageOrder);
                    sortedPages = sortedPages.concat(pages);
                });
            }

            //Build the book

            let strChapter = 'CHAPTER';
            if (this.language == 1) strChapter = 'CAPÍTULO';
            if (this.language == 2) strChapter = 'CAPÍTULO';

            let strPage = 'PAGE';
            if (this.language == 1) strPage = 'PÁGINA';
            if (this.language == 2) strPage = 'PÁGINA';

            let strAuthor = 'AUTHOR';
            if (this.language == 1) strAuthor = 'AUTOR';
            if (this.language == 2) strAuthor = 'AUTOR';

            let strLanguage = 'English';
            if (this.language == 1) strLanguage = 'Português';
            if (this.language == 2) strLanguage = 'Español';

            let bookOut = '';

            bookOut += `${this.title}\n\n`;
            bookOut += `${this.subtitle}\n\n`;
            bookOut += `${strAuthor}: ${this.author}\n\n\n\n\n\n`;
            this.chapters.forEach(chapter => {
                bookOut += `${strChapter} - ${chapter.chapterOrder}. ${chapter.title}\n\n`;
                let pages = sortedPages.filter(page => page.chapterNumber == chapter.chapterNumber);
                pages.forEach(page => {
                    bookOut += `${strPage} - ${page.pageOrder}. ${page.title}\n\n`;
                    page.blocks.forEach(block => {
                        if (block.type === 'text' || block.type === 'code') {
                            bookOut += `${block.content}\n\n`;
                        }
                    });
                });
            });
            bookOut += `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`;

            // download bookOut to local txt file
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(bookOut));
            element.setAttribute('download', `${this.title} - ${strLanguage}.txt`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

        } catch (error) {
            console.log(error);
            throw error; 
        }
    }
}

export default book;