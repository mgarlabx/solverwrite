import settings from "./settings.js";
import ai from "./ai.js";
import blocks from "./blocks.js";

const dialog = {

    pageJson: {},
    pageJsonIndex: 0,
    language: 0,
   
    modalShow(pageJson = this.pageJson, pageJsonIndex = this.pageJsonIndex, language = this.language) {
        this.pageJson = pageJson;
        this.pageJsonIndex = pageJsonIndex;
        this.language = language;
        document.getElementById('dialog-editor').showModal();
        document.getElementById('content-textarea-0').blur();
    },

    modalHide() {
        document.getElementById('dialog-editor').close();
    },

    saveContents() {
        let contents = [];
        contents[0] = document.getElementById('content-textarea-0').value;
        contents[1] = document.getElementById('content-textarea-1').value;
        contents[2] = document.getElementById('content-textarea-2').value;
        const block = this.pageJson.blocks[this.pageJsonIndex];
        block.contents = contents;
        let parsedContent = blocks.parseContent(contents[this.language], block.type, JSON.stringify(block.options));
        document.getElementById(`block-content-value-${this.pageJsonIndex}`).innerHTML = parsedContent;
        this.modalHide();
    },

    copyContents() {
        const content = document.getElementById('content-textarea-1').value;
        document.getElementById('content-textarea-0').value = content;
        document.getElementById('content-textarea-2').value = content;
    },

    writeContents() {
        const content = document.getElementById('content-textarea-1').value;
        document.getElementById('dialog-write').innerHTML = settings.processing;
        ai.write(content);
    },

    improveContents() {
        const content = document.getElementById('content-textarea-1').value;
        document.getElementById('dialog-improve').innerHTML = settings.processing;
        ai.improve(content);
    },

    translateContents() {
        const content = document.getElementById('content-textarea-1').value;
        document.getElementById('dialog-translate').innerHTML = settings.processing;
        ai.translate(content);
    },

   

   

}

export default dialog;
