const characterInput = document.getElementById('characterInput');
const characterGrid = document.getElementById('characterGrid');
const addCharacterButton = document.getElementById('addCharacter');
let modal; 
const characterColors = {};
let characterIdCounter = 0;

addCharacterButton.addEventListener('click', addCharacters);

const characterColorsMap = new Map(); 

function addCharacters() {
    const inputText = characterInput.value;
    const characterDataList = inputText.split(/(?<=\.png)/);

    characterGrid.innerHTML = ''; 

    characterDataList.forEach((characterData) => {
        const trimmedData = characterData.trim();
        if (trimmedData) {
            const characterId = `character-${characterIdCounter}`;
            const initialColor = '#670d08';
            characterColors[characterId] = initialColor; 

            const characterCard = createCharacterCard(trimmedData, initialColor, characterId);
            characterCard.dataset.characterData = trimmedData;
            characterGrid.appendChild(characterCard);
            characterIdCounter++;
        }
    });
    characterInput.value = '';
}

function extractImageURL(data) {
    const imageRegex = /https:\/\/.*\.png/;
    const match = data.match(imageRegex);
    return match ? match[0] : '';
}

function extractCharacterName(data) {
    const nameRegex = /^(.*?) ·/i;
    const match = data.match(nameRegex);
    return match ? match[1].trim() : '';
}


function extractCharacterNumber(data) {
    const numberRegex = /\((\d+)\)/;
    const match = data.match(numberRegex);
    return match ? match[1] : '';
}

characterGrid.addEventListener('click', function (e) {
    const characterCard = e.target.closest('.character-card');
    if (characterCard) {
        modal = document.createElement('div');
        modal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const characterData = characterCard.dataset.characterData;
        const initialColor = characterCard.dataset.characterColor || '#670d08';

        const modalCharacterCard = createCharacterCard(characterData, initialColor, characterCard.dataset.characterId);

        const modalClose = document.createElement('span');
        modalClose.classList.add('modal-close');
        modalClose.innerHTML = '&times;';
        modalClose.addEventListener('click', function () {
            modal.style.display = 'none';
        });

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = initialColor;

        colorPicker.addEventListener('input', function () {
            const selectedColor = colorPicker.value;
            modalCharacterCard.style.borderLeftColor = selectedColor;

            const characterId = characterCard.dataset.characterId;

            characterCard.style.borderLeftColor = selectedColor;
            characterColors[characterId] = selectedColor;
            characterCard.dataset.characterColor = selectedColor;
        });

        modalContent.appendChild(modalCharacterCard);
        modalContent.appendChild(colorPicker);
        modalContent.appendChild(modalClose);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }
});



function createCharacterCard(characterData, initialColor = '#670d08', characterId) {
    const characterCard = document.createElement('div');
    characterCard.classList.add('character-card');
    characterCard.dataset.characterId = characterId;


    const characterImage = document.createElement('img');
    characterImage.classList.add('character-image');
    characterImage.src = extractImageURL(characterData);

    const characterInfo = document.createElement('div');
    characterInfo.classList.add('character-info');

    const characterName = document.createElement('div');
    characterName.classList.add('character-name');
    characterName.textContent = extractCharacterName(characterData);

    characterCard.style.borderLeftColor = initialColor; 

    const characterNumber = document.createElement('div');
    characterNumber.textContent = extractCharacterNumber(characterData);

    characterInfo.appendChild(characterName);
    characterCard.appendChild(characterImage);
    characterCard.appendChild(characterInfo);
    characterCard.dataset.characterColor = initialColor;

    return characterCard;
}

document.body.addEventListener('click', function (e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});


const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', function () {
    const characterCards = document.querySelectorAll('.character-card');

    const exportList = Array.from(characterCards).map((characterCard) => {
        const characterName = characterCard.querySelector('.character-name').textContent;
        const characterColor = characterCard.dataset.characterColor;

        if (characterColor && characterColor !== '#670d08') {
            return `$embedcolor ${characterName}$${characterColor}`;
        }

        return null;
    }).filter((item) => item !== null);

    const exportText = exportList.join('\n');

    const exportTextArea = document.createElement('textarea');
    exportTextArea.value = exportText;
    document.body.appendChild(exportTextArea);

    exportTextArea.select();
    document.execCommand('copy');

    document.body.removeChild(exportTextArea);

    alert('Exported list has been copied to the clipboard.');
});