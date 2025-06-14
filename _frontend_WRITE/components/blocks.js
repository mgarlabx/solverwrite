import settings from "./settings.js";
import ai from "./ai.js";
import dialog from "./dialog.js";
import book from "./book.js";

const icon = {
    alert: '<i class="bi bi-exclamation-triangle-fill"></i>',
    info: '<i class="bi bi-info-circle-fill"></i>',
    quote: '<i class="bi bi-quote"></i>',
};

const blocks = {

    pageJson: {},
    language: 1,
    chapterNumber: 1,

    newBlock(type) {

        let contents = ['', '', ''];
        let options = {};

        if (type == 'image') {
            options = { width: '100%' }

        } else if (type == 'quiz') {
            contents = ['', '## Pergunta X\n\nQuem foi Fulano de Tal?\n\nA - Fulano\n\nB - Ciclano\n\nC - Beltrano\n\nD - Soltano\n\n[feedback]\nFeedA\nFeedB\nFeedC\nFeedD\n[/feedback]', ''];
            options = { items: '4', numeric: '0', correct: '0' }

        } else if (type == 'quiz-ai') {
            const addRequest = prompt('Additional request to the prompt?');
            if (addRequest !== null) {
                document.getElementById('block-insert').innerHTML = settings.processing;
                ai.quizAI(this.pageJson.bookId, this.pageJson.chapterNumber, addRequest);
            }
            return

        } else if (type == 'text-in') {
            contents = ['', '## Pergunta X\n\nQuem foi Fulano de Tal?\n\n\[feedback]\n{Good} FeedGood\n{Meh} FeedMeh\n{Bad} FeedBad\n{Null} FeedNull\n[/feedback]', ''];

        } else if (type == 'text-in-ai') {
            const addRequest = prompt('Additional request to the prompt?');
            if (addRequest !== null) {
                document.getElementById('block-insert').innerHTML = settings.processing;
                ai.textInAI(this.pageJson.bookId, this.pageJson.chapterNumber, addRequest);
            }
            return

        } else if (type == 'code') {
            contents = ['', 'print("Hello World")', ''];
            options = { syntax: 'python' }


        } else if (type == 'code-in') {
            contents = ['', '## Pergunta X\n\Imprima Hello World', ''];
            options = { syntax: 'python' }

        } else if (type == 'code-in-ai') {
            const addRequest = prompt('Additional request to the prompt?');
            if (addRequest !== null) {
                document.getElementById('block-insert').innerHTML = settings.processing;
                ai.codeInAI(this.pageJson.bookId, this.pageJson.chapterNumber, addRequest);
            }
            return
        }

        this.pageJson.blocks.push({
            index: this.pageJson.blocks.length,
            type: type,
            contents: contents,
            options: options
        });

        this.showBlocks();


    },

    showBlocks(pageJson = this.pageJson, language = this.language) {

        this.pageJson = pageJson;
        this.language = language;
        this.chapterNumber = pageJson.chapterNumber;

        document.getElementById('page-blocks').innerHTML = '';

        let index = 0;
        let tx = ``;

        this.pageJson.blocks.forEach(block => {

            const type = block.type;
            const content = block.contents[this.language];
            const options = JSON.stringify(block.options);

            this.pageJson.blocks[index].index = index;

            tx += `<div class="mb-5 mt-5 p-1 border" id="block-${index}">`;

            // Index, Duplicate, Delete
            tx += `<div class="mb-2 d-flex">`;
            tx += `<div class="w-100 p-3">${index}</div>`;
            tx += `<div class="p-3 block-icon"><i id="block-duplicate-${index}" class="fa fa-files-o pointer" aria-hidden="true"></i></div>`;
            tx += `<div class="p-3 block-icon"><i id="block-delete-${index}" class="fa fa-trash pointer" aria-hidden="true"></i></div>`;
            tx += `</div>`;

            // Type
            tx += `<div class="mb-2 d-flex">`;
            tx += `<div class="w-100 bg-light p-3" id="block-type-value-${index}">${type}</div>`;
            tx += `<div class="p-3 block-icon"><i id="block-type-${index}" class="fa fa-pencil-square-o pointer" aria-hidden="true"></i></div>`;
            tx += `</div>`;

            // Options
            tx += `<div class="mb-2 d-flex">`;
            tx += `<div class="w-100 bg-light p-3" id="block-options-value-${index}">${options}</div>`;
            tx += `<div class="p-3 block-icon"><i id="block-options-${index}" class="fa fa-pencil-square-o pointer" aria-hidden="true"></i></div>`;
            tx += `</div>`;

            // Content
            const parsedContent = this.parseContent(content, type, options, index);
            tx += `<div class="mb-2 d-flex">`;
            tx += `<div class="w-100 bg-light p-3" id="block-content-value-${index}">${parsedContent}</div>`;
            tx += `<div class="p-3 block-icon"><i id="block-content-${index}" class="fa fa-pencil-square-o pointer" aria-hidden="true"></i></div>`;
            tx += `</div>`;

            tx += `</div>`;

            index++;

        });

        document.getElementById('page-blocks').innerHTML = tx;

        // https://github.com/SortableJS/Sortable
        Sortable.create(document.getElementById('page-blocks'), {
            onEnd: () => {
                this.reorderBlocks()
                this.showBlocks();
            }
        });

        this.blockClick();
        this.quizClick();
        this.textInClick();
        this.codeInClick();
        this.allowTabs();

        hljs.highlightAll();
        hljs.addPlugin(new CopyButtonPlugin()); // https://github.com/arronhunt/highlightjs-copy
        //hljs.initLineNumbersOnLoad(); // https://github.com/wcoder/highlightjs-line-numbers.js

    },

    allowTabs() {
        document.querySelectorAll('.text-area').forEach(item => {
            item.addEventListener('keydown', function (e) {
                if (e.key == 'Tab') {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 1;
                }
            });
        });
    },

    parseMarkdown(content) {
        let newContent = marked.parse(content); // https://github.com/markedjs/marked
        newContent = newContent.replace(/<a /g, '<a target="_blank" ');
        return newContent;
    },

    parseContent(content, type, options, index) {

        const optionsJson = JSON.parse(options);
        let newContent = content;

        if (type == 'text') {
            
            if (optionsJson.style) {
                if (optionsJson.style == 'quote') {
                    newContent = `<div class="d-flex align-items-center rounded p-2 m-4" style="background-color:#ebf5fb;">`;
                    newContent += `<div class="p-2 m-2" style="font-size:300%;color:#2e86c1">${icon.quote}</div>`;
                    newContent += `<div class="p-2">${this.parseMarkdown(content)}</div>`;
                    newContent += `</div>`;
                } else if (optionsJson.style == 'information') {
                    newContent = `<div class="d-flex align-items-center rounded p-2 m-4" style="background-color:#eafaf1;">`;
                    newContent += `<div class="p-2 m-2" style="font-size:300%;color:#1d8348">${icon.info}</div>`;
                    newContent += `<div class="p-2">${this.parseMarkdown(content)}</div>`;
                    newContent += `</div>`;
                } else if (optionsJson.style == 'important') {
                    newContent = `<div class="d-flex align-items-center rounded p-2 m-4" style="background-color:#fcf3cf;">`;
                    newContent += `<div class="p-2 m-2" style="font-size:300%;color:#d68910">${icon.alert}</div>`;
                    newContent += `<div class="p-2">${this.parseMarkdown(content)}</div>`;
                    newContent += `</div>`;
                }
            } else {
                newContent = this.parseMarkdown(content);
            }

        } else if (type == 'text-in') {
            newContent = this.parseMarkdown(content);
            newContent = this.hideFeedback(newContent);
            newContent += `<div class="form-group mb-3">`;
            newContent += `<textarea class="form-control text-area" rows="5" id="text-in-text-${index}"></textarea>`;
            newContent += `</div>`;
            newContent += `<div class="bg-info p-2 d-flex justify-content-around rounded">`;
            newContent += `<button class="btn btn-primary" id="text-in-button-${index}"><i class="text-in fa fa-share" aria-hidden="true" id="text-in-${index}"></i></button>`;
            newContent += `</div>`;
            newContent += `<div class="p-3 d-flex border-bottom" id="text-in-feedback-${index}"></div><p>`;

        } else if (type == 'image') {
            const folder = `${book.path}chapter_${this.chapterNumber.padStart(3, '0')}`;
            const imgId = newContent;
            newContent = `<div class="w-100 text-center">`;
            newContent += `<img src="${folder}/${imgId}" style="width:${optionsJson.width}">`;
            newContent += `<br><small>${imgId}</small>`;
            newContent += `</div>`;

        } else if (type == 'youtube') {
            const videoId = newContent;
            newContent = `<div class="youtube-video-container">`;
            newContent += `<iframe class="youtube-video" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            newContent += `<br><small>${videoId}</small>`;
            newContent += `</div>`;

        } else if (type == 'quiz') {
            newContent = this.parseMarkdown(content);
            newContent = this.hideFeedback(newContent);

            newContent += `<div class="bg-info p-3 d-flex justify-content-around rounded">`;
            for (let i = 0; i < optionsJson.items; i++) {
                newContent += `<div class="form-check form-check-inline">`;
                newContent += `<input class="form-check-input quiz" type="radio" name="quiz-${index}" id="quiz-${index}-${i}">`;
                if (optionsJson.numeric == '1') {
                    newContent += `<div class="form-check-label">${i + 1}</div>`;
                } else {
                    newContent += `<div class="form-check-label">${String.fromCharCode(65 + i)}</div>`;
                }
                newContent += `</div>`;
            }
            newContent += `</div>`;
            newContent += `<div class="p-3 d-flex border-bottom" id="quiz-feedback-${index}"></div><p>`;



        } else if (type == 'code') {
            newContent = `<pre><code class="language-${optionsJson.syntax}">${content}</code></pre>`;

        } else if (type == 'code-in') {
            newContent = this.parseMarkdown(content);
            newContent = this.hideFeedback(newContent);
            newContent += `<div class="form-group mb-3">`;
            newContent += `<textarea class="form-control text-area hljs language-${optionsJson.syntax}" rows="5" id="code-in-text-${index}"></textarea>`;
            newContent += `</div>`;
            newContent += `<div class="bg-info p-2 d-flex justify-content-around rounded">`;
            newContent += `<button class="btn btn-primary" id="code-in-button-${index}"><i class="code-in fa fa-share" aria-hidden="true" id="code-in-${index}"></i></button>`;
            newContent += `</div>`;
            newContent += `<div class="p-3 d-flex border-bottom" id="code-in-feedback-${index}"></div><p>`;

        }
        return newContent;
    },



    getFeedback(content) {
        const regex = /\[feedback\]([\s\S]*?)\[\/feedback\]/g;
        let matches = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            matches.push(match[1].trim());
        }
        return matches[0];
    },

    hideFeedback(content) {
        let newContent = content;
        newContent = newContent.replace(/\[feedback\]/g, '<div style="display:none">');
        newContent = newContent.replace(/\[\/feedback\]/g, '<\/div>');
        return newContent;
    },

    textInClick() {
        document.querySelectorAll('.text-in').forEach(item => {
            item.addEventListener('click', event => {
                const blockIndex = event.target.id.split('-')[2];
                const block = this.pageJson.blocks[blockIndex];
                const textInText = document.getElementById(`text-in-text-${blockIndex}`).value;
                const textInFeedback = this.getFeedback(block.contents[this.language]);
                ai.textInAssess(blockIndex, textInText, textInFeedback, this.pageJson.bookId, this.pageJson.chapterNumber, this.language);
            });
        });

    },

    codeInClick() {
        document.querySelectorAll('.code-in').forEach(item => {
            item.addEventListener('click', event => {
                const blockIndex = event.target.id.split('-')[2];
                const syntax = this.pageJson.blocks[blockIndex].options.syntax;
                const codeInInstructions = this.pageJson.blocks[blockIndex].contents[this.language];
                const codeInText = document.getElementById(`code-in-text-${blockIndex}`).value;
                ai.codeInAssess(blockIndex, codeInText, codeInInstructions, syntax, this.language);
            });
        });

    },

    quizClick() {
        document.querySelectorAll('.quiz').forEach(item => {
            item.addEventListener('click', event => {

                const [_, blockIndex, alternative] = event.target.id.match(/quiz-(\d+)-(\d+)/);
                const block = this.pageJson.blocks[blockIndex];

                let feedbacks = this.getFeedback(block.contents[this.language]);
                feedbacks = feedbacks.split(/\r?\n|\r/); // split by new line

                const icon = alternative == block.options.correct ? '<i class="text-success fa fa-smile-o" aria-hidden="true"></i>' : '<i class="text-danger fa fa-frown-o" aria-hidden="true"></i>'

                let response = `<div class="d-flex">`;
                response += `<div class="fs-3">${icon}</div>`;
                if (feedbacks.length == block.options.items) {
                    response += `<div class="p-2">${feedbacks[parseInt(alternative)]}<div>`;
                }
                response += `</div>`;
                document.getElementById(`quiz-feedback-${blockIndex}`).innerHTML = response;

            });
        });
    },

    blockClick() {
        document.querySelectorAll('.block-icon').forEach(item => {
            item.addEventListener('click', event => {
                const id = event.target.id;
                const parts = id.split('-');
                const index = parts[2];
                const action = parts[1];
                if (index !== undefined && action !== undefined) this.blockIconClick(index, action);
            });
        });
    },

    blockIconClick(index, action) {
        this.pageJsonIndex = this.pageJson.blocks.findIndex(item => item.index == index);
        this.pageJsonIndex = parseInt(this.pageJsonIndex);
        const block = this.pageJson.blocks[this.pageJsonIndex];

        if (action == 'delete') {
            if (confirm('Are you sure to delete this block?')) {
                document.getElementById(`block-${index}`).remove();
                this.pageJson.blocks.splice(this.pageJsonIndex, 1);
            }

        } else if (action == 'duplicate') {
            const newBlock = JSON.parse(JSON.stringify(block));
            newBlock.index = this.pageJson.blocks.length;
            this.pageJson.blocks.push(newBlock);
            this.showBlocks();

        } else if (action == 'type') {
            const newType = prompt('Enter new type', this.pageJson.blocks[this.pageJsonIndex].type);
            if (newType !== null) {
                block.type = newType;
                document.getElementById(`block-type-value-${index}`).innerHTML = newType;
            }

        } else if (action == 'options') {
            const currentOptions = JSON.stringify(this.pageJson.blocks[this.pageJsonIndex].options);
            const newOptionsStr = prompt('Enter new options', currentOptions);
            if (newOptionsStr !== null) {
                const newOptions = JSON.parse(newOptionsStr);
                block.options = newOptions;
                document.getElementById(`block-options-value-${index}`).innerHTML = newOptionsStr;
            }

        } else if (action == 'content') {
            document.getElementById('content-textarea-0').value = block.contents[0];
            document.getElementById('content-textarea-1').value = block.contents[1];
            document.getElementById('content-textarea-2').value = block.contents[2];
            dialog.modalShow(this.pageJson, index, this.language);
        }

    },

    reorderBlocks() {
        const blocks = document.getElementById('page-blocks').children;
        const newBlocks = [];
        for (let i = 0; i < blocks.length; i++) {
            const index = blocks[i].id.split('-')[1];
            const block = this.pageJson.blocks.find(item => item.index == index);
            newBlocks.push(block);
        }
        this.pageJson.blocks = newBlocks;
    },



}

export default blocks;
