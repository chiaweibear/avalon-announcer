const synth = window.speechSynthesis;
let utterance;
let instructionQueue = [];
let currentInstruction = 0;
let selectedCharacters = [];

document.getElementById('numPlayers').addEventListener('change', function() {
    updateCharacterSelection(this.value);
});

function updateCharacterSelection(numPlayers) {
    const characters = {
        5: ['Merlin', 'Assassin', 'Mordred'],
        6: ['Merlin', 'Assassin'],
        7: ['Merlin', 'Assassin', 'Percival', 'Morgana'],
        8: ['Merlin', 'Assassin', 'Percival', 'Morgana', 'Oberon'],
        9: ['Merlin', 'Assassin', 'Percival', 'Morgana', 'Oberon'],
        10: ['Merlin', 'Assassin', 'Percival', 'Mordred', 'Oberon']
    };

    const selectionDiv = document.getElementById('charactersSelection');
    selectionDiv.innerHTML = '';
    characters[numPlayers].forEach(char => {
        const button = document.createElement('button');
        button.textContent = char;
        button.onclick = () => toggleCharacter(char, button);
        selectionDiv.appendChild(button);
    });
}

function toggleCharacter(character, button) {
    const idx = selectedCharacters.indexOf(character);
    if (idx > -1) {
        selectedCharacters.splice(idx, 1);
        button.classList.remove('selected');
    } else {
        selectedCharacters.push(character);
        button.classList.add('selected');
    }
}

function startGame() {
    buildInstructions(selectedCharacters);
    currentInstruction = 0;
    speakNext();
}

function buildInstructions(characters) {
    instructionQueue = [
        { text: "Everyone, close your eyes and extend your hand into a fist in front of you.", delay: 3000 },
        { text: "Minions of Mordred, extend your thumbs.", delay: 3000 },
        { text: "Minions of Mordred, open your eyes and look around to recognize each other.", delay: 7000 },
        { text: "Minions of Mordred, close your eyes and put your thumbs down.", delay: 3000 }
    ];

    if (characters.includes('Merlin')) {
        instructionQueue.push({ text: "Minions of Mordred, extend your thumb so Merlin can see you.", delay: 3000 });
        instructionQueue.push({ text: "Merlin, open your eyes and look for Minions of Mordred.", delay: 7000 });
        instructionQueue.push({ text: "Minions of Mordred, put your thumbs down. Merlin, close your eyes.", delay: 3000 });
    }
    if (characters.includes('Percival')) {
        instructionQueue.push({ text: "Merlin and Morgana, extend your thumbs.", delay: 3000 });
        instructionQueue.push({ text: "Percival, open your eyes and look for Merlin and Morgana.", delay: 7000 });
        instructionQueue.push({ text: "Percival, close your eyes. Merlin and Morgana, put your thumbs down.", delay: 3000 });
    }
    instructionQueue.push({ text: "Everyone, open your eyes.", delay: 1000 });
}

function speakNext() {
    if (currentInstruction >= instructionQueue.length) return;
    const instruction = instructionQueue[currentInstruction];
    utterance = new SpeechSynthesisUtterance(instruction.text);
    utterance.rate = parseFloat(document.getElementById('speechRate').value);
    utterance.onend = function() {
        setTimeout(speakNext, instruction.delay);
    };
    synth.speak(utterance);
    currentInstruction++;
}

function abortNarration() {
    synth.cancel();
    currentInstruction = 0; // Reset instruction sequence
}

function resetGame() {
    // Clear selected characters array
    selectedCharacters = [];
    // Remove 'selected' class from all character buttons
    const buttons = document.querySelectorAll('#charactersSelection button');
    buttons.forEach(button => {
        button.classList.remove('selected');
    });
    // Optionally reset the instruction queue and current instruction index if needed
    instructionQueue = [];
    currentInstruction = 0;
    // Stop any ongoing narration
    synth.cancel();
}
