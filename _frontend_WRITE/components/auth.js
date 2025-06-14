import settings from './settings.js';

const auth = {
    load() {

        let userId = localStorage.getItem('solverbooks_userId');
        if (userId) {
            this.userId = userId;
        } else {
            localStorage.setItem('solverbooks_userId', '');
        }
        settings.userId = userId;

        let bookId = localStorage.getItem('solverbooks_bookId');
        if (bookId) {
            bookId = bookId.replace('book-', '');
        } else {
            bookId = 'yjxfP75lMmCH86yI1Bt1dGSLAm51z34AtAmz'; // default book - Python beginners
            localStorage.setItem('solverbooks_bookId', 'book-' + bookId);
        }
        settings.bookId = bookId;
        document.getElementById('select-book').value = settings.bookId;

        const bookIdStr = settings.bookId.replace('book-', '');

        const appUrl = `https://utawlxp5y3yxtup6ecr42f2lsa0kbqyh.lambda-url.us-west-2.on.aws/`;
        const url = `${appUrl}/writeAI/?bookId=${bookIdStr}&userId=${settings.userId}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            return response.json();
            
        }).then(data => {
            settings.tkAI = data.tk;
            
        }).catch(error => {
            console.log(error);
        });

    },
};

export default auth;