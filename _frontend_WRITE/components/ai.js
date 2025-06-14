import settings from './settings.js';
import page from './page.js';
import blocks from './blocks.js';

const ai = {

    write(content) {
        const body = JSON.stringify({ content: content });
        this.post(body, 'write');
    },

    improve(content) {
        const body = JSON.stringify({ content: content });
        this.post(body, 'improve');
    },

    translate(content) {
        const body = JSON.stringify({ content: content });
        this.post(body, 'translate');
    },

    quizAI(bookId, chapterNumber, addRequest) {
        const body = JSON.stringify({ bookId: bookId, chapterNumber: chapterNumber, addRequest: addRequest });
        this.post(body, 'quizAI');
    },

    textInAI(bookId, chapterNumber, addRequest) {
        const body = JSON.stringify({ bookId: bookId, chapterNumber: chapterNumber, addRequest: addRequest });
        this.post(body, 'textInAI');
    },

    codeInAI(bookId, chapterNumber, addRequest) {
        const body = JSON.stringify({ bookId: bookId, chapterNumber: chapterNumber, addRequest: addRequest });
        this.post(body, 'codeInAI');
    },

    textInAssess(blockIndex, textInText, textInFeedback, bookId, chapterNumber, language) {
        const body = JSON.stringify({ bookId: bookId, chapterNumber: chapterNumber, textInText: textInText, textInFeedback: textInFeedback, language: Number(language) });
        document.getElementById(`text-in-button-${blockIndex}`).classList.add('disabled');
        document.getElementById(`text-in-feedback-${blockIndex}`).innerHTML = settings.processing;
        this.post(body, 'textInAssess', false, { blockIndex: blockIndex });
    },

    codeInAssess(blockIndex, codeInText, codeInInstructions, syntax, language) {
        codeInText = codeInText.replace(/[\""]/g, '\\"');
        codeInInstructions = codeInInstructions.replace(/[\""]/g, '\\"');
        const body = JSON.stringify({ codeInText: codeInText, codeInInstructions: codeInInstructions, syntax: syntax, language: Number(language) });
        document.getElementById(`code-in-button-${blockIndex}`).classList.add('disabled');
        document.getElementById(`code-in-feedback-${blockIndex}`).innerHTML = settings.processing;
        this.post(body, 'codeInAssess', false, { blockIndex: blockIndex });
    },

    post(body, func, read = true, options = {}) {

        let appUrl = `https://xypyxrar7msnub7ptfwcvudhme0xszxx.lambda-url.us-west-2.on.aws/`;
        if (!read) {
            appUrl = `https://wx2vat7rcqu4eorzypicv7h5oi0ihtqu.lambda-url.us-west-2.on.aws/`;
        }

        const url = `${appUrl}/${func}`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + settings.tkAI,
            },
            body: body
        }).then(response => {
            return response.json();

        }).then(data => {
            this.refresh(data, func, options);

        }).catch(error => {
            if (func === 'write') {
                document.getElementById('dialog-write').innerHTML = 'Write';
            } else if (func === 'improve') {
                document.getElementById('dialog-improve').innerHTML = 'Improve';
            } else if (func === 'translate') {
                document.getElementById('dialog-translate').innerHTML = 'Translate';
            } else if (func === 'quizAI') {
                document.getElementById('block-insert').innerHTML = '<i class="fa fa-plus pointer" aria-hidden="true"></i>';
            } else if (func === 'textInAI') {
                document.getElementById('block-insert').innerHTML = '<i class="fa fa-plus pointer" aria-hidden="true"></i>';
            } else if (func === 'codeInAI') {
                document.getElementById('block-insert').innerHTML = '<i class="fa fa-plus pointer" aria-hidden="true"></i>';
            } else if (func === 'textInAssess') {
                document.getElementById(`text-in-button-${options.blockIndex}`).classList.remove('disabled');
                document.getElementById(`text-in-feedback-${options.blockIndex}`).innerHTML = 'Error';
            } else if (func === 'codeInAssess') {
                document.getElementById(`code-in-button-${options.blockIndex}`).classList.remove('disabled');
                document.getElementById(`code-in-feedback-${options.blockIndex}`).innerHTML = 'Error';
            }
            console.log(body);
            console.log(error);
        });
    },

    refresh(data, func, options) {

        if (func === 'write') {
            document.getElementById('dialog-write').innerHTML = 'Write';
            document.getElementById('content-textarea-1').value = data.paragraph;

        } else if (func === 'improve') {
            document.getElementById('dialog-improve').innerHTML = 'Improve';
            document.getElementById('content-textarea-1').value = data.paragraph;

        } else if (func === 'translate') {
            document.getElementById('dialog-translate').innerHTML = 'Translate';
            document.getElementById('content-textarea-0').value = data.english;
            document.getElementById('content-textarea-2').value = data.spanish;

        } else if (func === 'quizAI') {

            let content = '';
            content += '## Pergunta X \n\n';
            content += data.question + ' \n\n';
            content += 'A. ' + data.A + ' \n\n';
            content += 'B. ' + data.B + ' \n\n';
            content += 'C. ' + data.C + ' \n\n';
            content += 'D. ' + data.D + ' \n\n\n\n';
            content += '[feedback]\n';
            content += data.feedA + '\n' + data.feedB + '\n' + data.feedC + '\n' + data.feedD + '\n';
            content += '[/feedback]';

            let correct = '0';
            if (data.correct === 'B') {
                correct = '1';
            } else if (data.correct === 'C') {
                correct = '2';
            } else if (data.correct === 'D') {
                correct = '3';
            }

            const options = {
                items: '4',
                numeric: '0',
                correct: correct,
            }

            page.pageJson.blocks.push({
                index: page.pageJson.blocks.length,
                type: 'quiz',
                contents: ['', content, ''],
                options: options
            });

            document.getElementById('block-insert').innerHTML = '<i class="fa fa-plus pointer" aria-hidden="true"></i>';
            blocks.showBlocks();

        } else if (func === 'textInAI') {

            let content = '';
            content += '## Pergunta X \n\n';
            content += data.question + ' \n\n';
            content += '[feedback]\n';
            content += '{good} ' + data.feedback.good + '\n';
            content += '{meh} ' + data.feedback.meh + '\n';
            content += '{bad} ' + data.feedback.bad + '\n';
            content += '{null} ' + data.feedback.null + '\n';
            content += '[/feedback]';

            page.pageJson.blocks.push({
                index: page.pageJson.blocks.length,
                type: 'text-in',
                contents: ['', content, ''],
                options: {}
            });

            document.getElementById('block-insert').innerHTML = '<i class="fa fa-plus pointer" aria-hidden="true"></i>';
            blocks.showBlocks();


        } else if (func === 'codeInAI') {

            let content = '';
            content += '## Desafio X \n\n';
            content += data.challenge + ' \n\n';

            page.pageJson.blocks.push({
                index: page.pageJson.blocks.length,
                type: 'code-in',
                contents: ['', content, ''],
                options: { syntax: 'python' }
            });

            document.getElementById('block-insert').innerHTML = '<i class="fa fa-plus pointer" aria-hidden="true"></i>';
            blocks.showBlocks();

        } else if (func === 'textInAssess') {

            const iconGood = '<i class="text-success fa fa-smile-o" aria-hidden="true"></i>';
            const iconMeh = '<i class="fa fa-meh-o" aria-hidden="true"></i>';
            const iconBad = '<i class="text-danger fa fa-frown-o" aria-hidden="true"></i>';
            const iconNull = '<i class="text-danger fa fa-exclamation-triangle" aria-hidden="true"></i>';

            let icon = iconGood;
            if (data.sentiment === 'meh') {
                icon = iconMeh;
            } else if (data.sentiment === 'bad') {
                icon = iconBad;
            } else if (data.sentiment === 'null') {
                icon = iconNull;
            }

            let response = `<div class="d-flex">`;
            response += `<div class="fs-3">${icon}</div>`;
            response += `<div class="p-2">${data.analysis + " " + data.suggestions}<div>`;
            response += `</div>`;

            document.getElementById(`text-in-button-${options.blockIndex}`).classList.remove('disabled');
            document.getElementById(`text-in-feedback-${options.blockIndex}`).innerHTML = response;

        } else if (func === 'codeInAssess') {

            const iconGood = '<i class="text-success fa fa-smile-o" aria-hidden="true"></i>';
            const iconMeh = '<i class="fa fa-meh-o" aria-hidden="true"></i>';
            const iconBad = '<i class="text-danger fa fa-frown-o" aria-hidden="true"></i>';
            const iconNull = '<i class="text-danger fa fa-exclamation-triangle" aria-hidden="true"></i>';

            let icon = iconGood;
            if (data.sentiment === 'meh') {
                icon = iconMeh;
            } else if (data.sentiment === 'bad') {
                icon = iconBad;
            } else if (data.sentiment === 'null') {
                icon = iconNull;
            }

            let response = `<div class="d-flex">`;
            response += `<div class="fs-3">${icon}</div>`;
            response += `<div class="p-2">${data.analysis}<div>`;
            response += `</div>`;

            document.getElementById(`code-in-button-${options.blockIndex}`).classList.remove('disabled');
            document.getElementById(`code-in-feedback-${options.blockIndex}`).innerHTML = response;

        }
    },

};

export default ai;