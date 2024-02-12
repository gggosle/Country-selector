"use strict"

const countries = [{name: 'United States', code: 'US'}, {name: 'Australia', code: 'AU'},
    {name: 'Austria', code: 'AT'}, {name: 'Belgium', code: 'BE'}, {name: 'Bulgaria', code: 'BG'}]
const stylesForShadow = `
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

function createOptions(selector) {
    const options = countries.map((country) => {
        const option = createOptionElement(country);
        option.addEventListener('click', (event) => {
            selector.prepend(option);
            toggleSelectList(selector);
        });
        return option;
    });

    return options;
}

function createOptionElement(country) {
    const option = createElementWithClasses('div', ['selector__option', 'hidden']);
    option.value = country.code;

    const textDiv = createElementWithClasses('div', ['option__text']);
    textDiv.textContent = country.name;

    const containerDiv = createElementWithClasses('div', ['option__container']);

    const img = createElementWithClasses('img', ['option__img']);
    img.src = `https://flagsapi.com/${country.code}/flat/32.png`
    img.alt = country.name + ' Flag';

    const button = createElementWithClasses('button', ['button', 'selector__button', 'hidden']);

    const iconElement = createElementWithClasses('i', ['fa-solid', 'fa-angle-down', 'button__icon']);

    button.appendChild(iconElement);
    containerDiv.appendChild(img);
    containerDiv.appendChild(button);
    option.appendChild(textDiv);
    option.appendChild(containerDiv);

    return option;
}

function createElementWithClasses(tagName, classNames) {
    const element = document.createElement(tagName);
    if (classNames) {
        classNames.forEach(className => {
            element.classList.add(className);
        });
    }
    return element;
}

function toggleSelectList(selector) {
    toggleSelectButton(selector.firstChild);
    const children = selector.childNodes;
    const secondChildIndex = 1;
    for (let i = secondChildIndex; i < children.length; i++) {
        children[i].classList.toggle('hidden');
    }
}

function toggleSelectButton(option) {
    const selectorButton = option.querySelector('.selector__button');
    selectorButton.classList.toggle('hidden');
}

function createStyles(styles) {
    const style = document.createElement('style');
    style.textContent = styles;
    return style;
}

function loadFontAwesome(shadow){
    const fontAwesomeScript = getScript("fontawesome");

    const id = setInterval(() => {
        const fontAwesomeFont = document.querySelector('#fa-v5-font-face');
        const fontAwesomeMain = document.querySelector('#fa-main');
        if (fontAwesomeScript && fontAwesomeFont && fontAwesomeMain) {
            shadow.appendChild(fontAwesomeScript.cloneNode());
            shadow.appendChild(fontAwesomeFont.cloneNode('deep'));
            shadow.appendChild(fontAwesomeMain.cloneNode('deep'));
            clearInterval(id);
        }
    }, 200);
}

function getScript(substring){
    return document.querySelector(
        `script[src*=${substring}]`
    );
}

customElements.define('country-select', class extends HTMLElement {
    shadow = this.attachShadow({mode: 'open'});

    connectedCallback() {
        this.configureShadow();
    }

    configureShadow() {
        loadFontAwesome(this.shadow);

        const options = createOptions(this.shadow);
        options.forEach((option) => {
            this.shadow.appendChild(option);
        });

        const styles = createStyles(stylesForShadow);
        this.shadow.appendChild(styles);

        this.shadow.firstChild.classList.remove('hidden');
        toggleSelectButton(this.shadow.firstChild);
    }
});
