"use strict"

const countries = [{name: 'United States', code: 'US'}, {name: 'Australia', code: 'AU'},
    {name: 'Austria', code: 'AT'}, {name: 'Belgium', code: 'BE'}, {name: 'Bulgaria', code: 'BG'}]

function createOptionElement(country) {
    const option = document.createElement('div');
    option.classList.add('selector__option', 'hidden');
    option.value = country.code;

    const textDiv = document.createElement('div');
    textDiv.classList.add('option__text');
    textDiv.textContent = country.name;

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('option__container')

    const img = document.createElement('img');
    img.classList.add('option__img');
    img.src = `https://flagsapi.com/${country.code}/flat/32.png`
    img.alt = country.name + ' Flag';

    const button = document.createElement('button');
    button.classList.add('button', 'selector__button', 'hidden');
    const iconElement = document.createElement('i');
    iconElement.classList.add('fa-solid', 'fa-angle-down', 'button__icon');

    button.appendChild(iconElement);
    containerDiv.appendChild(img);
    containerDiv.appendChild(button);
    option.appendChild(textDiv);
    option.appendChild(containerDiv);

    return option;
}

function toggleSelectList(selector) {
    toggleSelectButton(selector.firstChild);
    const children = selector.childNodes;
    const secondChildIndex = 1;
    for (let i = secondChildIndex; i < children.length; i++) {
        children[i].classList.toggle('hidden');
    }
}

function toggleSelectButton(option)
{
    const selectorButton = option.querySelector('.selector__button');
    selectorButton.classList.toggle('hidden');
}

customElements.define('country-select', class extends HTMLElement {
    shadow = this.attachShadow({mode: 'open'});



    connectedCallback() {
        this.loadFontAwesome();

        const options = this.createOptions();
        options.forEach((option) => {
            this.shadow.appendChild(option);
        });

        const styles = this.createStyles();
        this.shadow.appendChild(styles);

        this.shadow.firstChild.classList.remove('hidden');
        toggleSelectButton(this.shadow.firstChild);
    }

    //TODO get all this methods outside, or idk. Ideally they should belong to the shadow class, but we can't manipulate that

    loadFontAwesome(){
        const fontAwesomeScript = this.getScript("fontawesome");

        const id = setInterval(() => {
            const fontAwesomeFont = document.querySelector('#fa-v5-font-face');
            const fontAwesomeMain = document.querySelector('#fa-main');
            if (fontAwesomeScript && fontAwesomeFont && fontAwesomeMain) {
                this.shadow.appendChild(fontAwesomeScript.cloneNode());
                this.shadow.appendChild(fontAwesomeFont.cloneNode('deep'));
                this.shadow.appendChild(fontAwesomeMain.cloneNode('deep'));
                clearInterval(id);
            }
        }, 200);
    }

    getScript(substring){
        return document.querySelector(
            `script[src*=${substring}]`
        );
    }

    createOptions() {
        const options = countries.map((country) => {
            const option = createOptionElement(country);
            option.addEventListener('click', (event) => {
                this.shadow.prepend(option);
                toggleSelectList(this.shadow);
            });
            return option;
        });

        return options;
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
                flex-direction: column;
                width: 200px;
                padding: 5px;
                border: 1px solid black;
            }
          
            .selector__option {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .button {
                background: none;
                border: none;
            }
                   
            .option__container {
                display: flex;
                align-items: center;
            }
            
            .hidden {
                display: none;
            }
            `;

        return style;
    }
});
