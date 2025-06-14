
const header = {

    dom: document.getElementById('screen-header'),

    show() {

        // Set the header content
        this.dom.innerHTML = `
            <div class="d-flex justify-content-between header fixed-top p-2 border" style="background-color: #e9f0ff;">
                <div class="d-flex justify-content-between" style="max-width:320px">    
                    <h4 class="p-2" id="header-books"><img width="30" src="images/cube.png"> SolverWrite</h4>
                </div>
            </div>
        `;


    },



};


export default header;