import settings from "./settings.js";
import blocks from "./blocks.js";

const page = {

    bookId: 'book-' + settings.bookId,
    language: 1,
    chapterNumber: 1,
    pageNumber: 1,
    pageOrder: 1,
    versionNumber: 1,
    active: 1,
    titles: [],
    blocks: [],
    pageJson: {},
    pageJsonIndex: 0,

    load() {
        this.bookId = 'book-' + settings.bookId;
        const stored_bookId = localStorage.getItem('solverbooks_editor_bookId');
        const stored_language = localStorage.getItem('solverbooks_editor_language');
        const stored_chapterNumber = localStorage.getItem('solverbooks_editor_chapterNumber');
        const stored_pageNumber = localStorage.getItem('solverbooks_editor_pageNumber');
        const stored_versionNumber = localStorage.getItem('solverbooks_editor_versionNumber');
        if (stored_bookId) this.bookId = stored_bookId;
        if (stored_language) this.language = stored_language;
        if (stored_chapterNumber) this.chapterNumber = stored_chapterNumber;
        if (stored_pageNumber) this.pageNumber = stored_pageNumber;
        if (stored_versionNumber) this.versionNumber = stored_versionNumber;
        document.getElementById('input-language').value = this.language;
        document.getElementById('input-chapter-number').value = this.chapterNumber;
        document.getElementById('input-page-number').value = this.pageNumber;
        document.getElementById('input-version-number').value = this.versionNumber;
        page.download();
    },

    download() {
        if (document.getElementById('input-save').innerHTML == 'Save')
            document.getElementById('input-get').innerHTML = settings.processing;


        this.language = document.getElementById('input-language').value;
        this.chapterNumber = document.getElementById('input-chapter-number').value;
        this.pageNumber = document.getElementById('input-page-number').value;
        this.versionNumber = document.getElementById('input-version-number').value;

        localStorage.setItem('solverbooks_editor_language', this.language);
        localStorage.setItem('solverbooks_editor_chapterNumber', this.chapterNumber);
        localStorage.setItem('solverbooks_editor_pageNumber', this.pageNumber);
        localStorage.setItem('solverbooks_editor_versionNumber', this.versionNumber);

        const appUrl = `https://w5rotl5zo2qgefnmwyjls4jtlm0mafzb.lambda-url.us-west-2.on.aws/`;
        const url = `${appUrl}/page/?bookId=${this.bookId}&chapterNumber=${this.chapterNumber}&pageNumber=${this.pageNumber}&versionNumber=${this.versionNumber}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            return response.json();
        }).then(data => {
            document.getElementById('input-get').innerHTML = 'Get';
            document.getElementById('input-save').innerHTML = 'Save';
            document.getElementById('block-insert').innerHTML = '<i class="fa fa-plus pointer" aria-hidden="true"></i>';

            if (Object.keys(data).length == 0) {
                document.getElementById('page-title').innerHTML = 'Page not found';
                document.getElementById('page-order').innerHTML = '';
                document.getElementById('page-active').innerHTML = '';
                document.getElementById('page-blocks').innerHTML = '';
                this.pageJson = {};
                if (confirm(`Do you want to create version ${this.versionNumber} of page ${this.pageNumber} of chapter ${this.chapterNumber}?`)) {
                    this.new();
                }
            } else {
                this.pageJson = data;
                this.pageJson.bookId = this.bookId;
                this.pageJson.chapterNumber = this.chapterNumber;
                this.pageJson.pageNumber = this.pageNumber;
                this.pageJson.versionNumber = this.versionNumber;
                this.showTitles();
                blocks.showBlocks(this.pageJson, this.language);
            }


        }).catch(error => {
            console.log(error);
        });


    },

    editTitle() {
        const newTitle0 = prompt('Enter new title ENGLISH', this.pageJson.titles[0]);
        if (newTitle0 !== null) {
            const newTitle1 = prompt('Entre new title PORTUGUESE', this.pageJson.titles[1]);
            if (newTitle1 !== null) {
                const newTitle2 = prompt('Entre new title SPANISH', this.pageJson.titles[2]);
                if (newTitle2 !== null) {
                    this.pageJson.titles[0] = newTitle0;
                    this.pageJson.titles[1] = newTitle1;
                    this.pageJson.titles[2] = newTitle2;
                    this.showTitles();
                }
            }
        }
    },

    showTitles() {
        document.getElementById('page-title').innerHTML = this.pageJson.titles[this.language];
        document.getElementById('page-order').innerHTML = `order: ${this.pageJson.pageOrder}`;
        document.getElementById('page-active').innerHTML = `active: ${this.pageJson.active}`;
    },


    new() {
        this.pageJson = {
            bookId: this.bookId,
            chapterNumber: this.chapterNumber,
            pageNumber: this.pageNumber,
            pageOrder: this.pageNumber,
            versionNumber: this.versionNumber,
            active: this.active.toString(),
            titles: ['Title 1 English', 'Title 2 Português', 'Title 3 Español'],
            blocks: [{
                index: 0,
                type: 'text',
                contents: ['', '', ''],
                options: {}
            }]
        };
        this.showTitles();
        blocks.showBlocks(this.pageJson, this.language);
    },

    save() {
        blocks.reorderBlocks();

        document.getElementById('input-save').innerHTML = settings.processing;
        document.getElementById('block-insert').innerHTML = settings.processing;

        const appUrl = `https://ysp7hwqt73k4bbsh6vrscxynmm0wmkhn.lambda-url.us-west-2.on.aws`;
        const url = `${appUrl}/page/`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pageJson: this.pageJson,
                userId: settings.userId,
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            this.download();
        }).catch(error => {
            console.log(error);
        });

    }

}

export default page;
