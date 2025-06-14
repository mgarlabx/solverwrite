import auth from './components/auth.js';
import header from './components/header.js';
import book from './components/book.js';
import page from './components/page.js';
import blocks from './components/blocks.js';
import dialog from './components/dialog.js';

document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();
    auth.load();
    header.show();
    book.load();
    page.load();
});

const addEventListeners = () => {

    // <dialog>
    document.getElementById('dialog-copy').addEventListener('click', () => dialog.copyContents());
    document.getElementById('dialog-write').addEventListener('click', () => dialog.writeContents());
    document.getElementById('dialog-improve').addEventListener('click', () => dialog.improveContents());
    document.getElementById('dialog-translate').addEventListener('click', () => dialog.translateContents());
    document.getElementById('dialog-save').addEventListener('click', () => dialog.saveContents());
    document.getElementById('dialog-close').addEventListener('click', () => dialog.modalHide());

    // book
    document.getElementById('select-book').addEventListener('change', () => book.select());

    // input bar
    document.getElementById('input-get').addEventListener('click', () => page.download());
    document.getElementById('input-save').addEventListener('click', () => page.save());

    // page title
    document.getElementById('edit-title').addEventListener('click', () => page.editTitle());

    // new blocks
    document.querySelectorAll('.new-block').forEach(item => {
        item.addEventListener('click', event => {
            const type = event.target.id.replace('new-block-', '');
            blocks.newBlock(type);
        });
    });

    // dropdown menu - scroll to bottom
    document.getElementById('dropdown-menu-new-block').addEventListener('click', () => {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 0);

    });

    // keyboard shortcuts
    document.getElementById('input-chapter-number').addEventListener('keydown', event => {
        if (event.key === 'Enter') page.download()
    });
    document.getElementById('input-page-number').addEventListener('keydown', event => {
        if (event.key === 'Enter') page.download()
    });
    document.getElementById('input-version-number').addEventListener('keydown', event => {
        if (event.key === 'Enter') page.download()
    });
    document.getElementById('input-language').addEventListener('keydown', event => {
        if (event.key === 'Enter') page.download()
    });

    document.addEventListener('keydown', event => {
        if (event.metaKey && event.key === 's') {
            event.preventDefault(); // Prevent the default action (save in the browser)
            page.save();
        }
    });

    document.getElementById('book-download').addEventListener('click', () => book.download());


};

