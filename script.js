'use strict'

class FruitCard {
    constructor(englishName, russianTranslation, example) {
        this.englishName = englishName;
        this.russianTranslation = russianTranslation;
        this.example = example;
    }
}

const appleCard = new FruitCard("Apple", "Яблоко", "I eat an apple every day.");
const bananaCard = new FruitCard("Banana", "Банан", "Bananas are rich in potassium.");
const orangeCard = new FruitCard("Orange", "Апельсин", "I like to drink orange juice.");
const grapeCard = new FruitCard("Grape", "Виноград", "Grapes can be fermented to make wine.");
const pineappleCard = new FruitCard("Pineapple", "Ананас", "Pineapples are tropical fruits.");
const strawberryCard = new FruitCard("Strawberry", "Клубника", "Strawberries are delicious in desserts.");

const fruitCards = [appleCard, bananaCard, orangeCard, grapeCard, pineappleCard, strawberryCard];

document.querySelector('#total-word').textContent = fruitCards.length;

const cardTemplate = document.querySelector('#word-cards');
const flipCards = document.querySelector('.flip-cards');

fruitCards.forEach(card => {
    const clone = document.importNode(cardTemplate.content, true);
    clone.querySelector('.flip-card-front h1').textContent = card.englishName;
    clone.querySelector('.flip-card-back h1').textContent = card.russianTranslation;
    clone.querySelector('.flip-card-back span').textContent = card.example;

    const flipCard = document.createElement('div');
    flipCard.classList.add('flip-card');
    flipCard.appendChild(clone);
    flipCards.appendChild(flipCard);
});

function updateProgress() {
    const totalWords = fruitCards.length;
    const currentWordIndex = currentCardIndex + 1;
    const progressValue = (currentWordIndex / totalWords) * 100;

    const wordsProgress = document.querySelector('#words-progress');
    wordsProgress.value = progressValue;
    wordsProgress.textContent = `${Math.round(progressValue)}%`;
}

const sliderflipCards = document.querySelectorAll('.flip-card');
const currentWordDisplay = document.querySelector('#current-word');
const backButton = document.querySelector('#back');
const nextButton = document.querySelector('#next');

document.querySelector('.flip-cards').addEventListener('click', (event) => {
    const card = event.target.closest('.flip-card');
    if (card) {
        card.classList.toggle('active');
    }
});

let currentCardIndex = 0;

function showCard(index) {
    sliderflipCards.forEach((card, i) => {
        card.style.display = (i === index) ? 'block' : 'none';
    });
    currentWordDisplay.textContent = index + 1;
    updateButtonStates();
    updateProgress();
}

function updateButtonStates() {
    backButton.disabled = currentCardIndex === 0;
    nextButton.disabled = currentCardIndex === sliderflipCards.length - 1;
}

document.querySelector('#shuffle-words').addEventListener('click', () => {

    const newArray = shuffleArray(Array.from(flipCards.querySelectorAll(".flip-card")));

    flipCards.innerHTML = '';

    newArray.forEach((card, index) => {
        card.querySelector('.flip-card-front h1').textContent = fruitCards[index].englishName;
        card.querySelector('.flip-card-back h1').textContent = fruitCards[index].russianTranslation;
        card.querySelector('.flip-card-back span').textContent = fruitCards[index].example;
        flipCards.appendChild(card);
    });

    const randomIndex = Math.floor(Math.random() * newArray.length);
    currentCardIndex = randomIndex;

    showCard(currentCardIndex);
});

nextButton.addEventListener('click', () => {
    if (currentCardIndex < sliderflipCards.length - 1) {
        currentCardIndex++;
        showCard(currentCardIndex);
        updateProgress();
    }
});

backButton.addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCard(currentCardIndex);
        updateProgress();
    }
});

function shuffleArray(array) {
    let i = array.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
    return array;
}

function updateExamTimer(remainingTime) {
    const timerElement = document.querySelector('#time');
    timerElement.textContent = formatTime(remainingTime);
}

document.querySelector('#exam').addEventListener('click', () => {
    flipCards.classList.add('hidden');
    document.querySelector('.slider-controls').classList.add('hidden');
    document.querySelector('#study-mode').classList.add('hidden');
    document.querySelector('#exam-mode').classList.remove('hidden');
    startTimer(0);
    startExam();
});

let timeInterval;

function startTimer(duration) {
    let remainingTime = duration;

    timeInterval = setInterval(() => {
        updateTimer(remainingTime);
        remainingTime++;
    }, 1000);
}

function updateTimer(remainingTime) {
    const timerElement = document.querySelector('#time');
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateExamProgress(correctAnswers, totalQuestions, fadedCardsCount) {
    const correctPercentElement = document.querySelector('#correct-percent');
    const examProgressElement = document.querySelector('#exam-progress');
    const percent = (correctAnswers / totalQuestions) * 100;
    correctPercentElement.textContent = `${percent.toFixed()}%`;
    examProgressElement.value = fadedCardsCount / totalQuestions * 100; // Обновление значения прогресса на основе исчезнувших карточек
}

function startExam() {

    const examCardTemplate = document.querySelector('#exam-card');
    const examCardsContainer = document.querySelector('#exam-cards');
    examCardsContainer.innerHTML = '';

    fruitCards.forEach(card => {
        const cloneFront = document.importNode(examCardTemplate.content, true);
        cloneFront.querySelector('.card h1').textContent = card.englishName;
        const examCardEnglish = document.createElement('div');
        examCardEnglish.classList.add('exam-card');
        examCardEnglish.appendChild(cloneFront);
        examCardsContainer.appendChild(examCardEnglish);

        const cloneBack = document.importNode(examCardTemplate.content, true);
        cloneBack.querySelector('.card h1').textContent = card.russianTranslation;
        const examCardRussian = document.createElement('div');
        examCardRussian.classList.add('exam-card');
        examCardRussian.appendChild(cloneBack);
        examCardsContainer.appendChild(examCardRussian);
    });

    document.querySelectorAll('.exam-card .card').forEach(card => {
        card.classList.remove('fade-out', 'wrong', 'correct');
        card.addEventListener('click', compareCards);
    });

    const randomExamCards = shuffleArray(Array.from(examCardsContainer.querySelectorAll(".exam-card")));
    examCardsContainer.innerHTML = '';
    randomExamCards.forEach(card => {
        examCardsContainer.appendChild(card);
    });
}

let firstCard = null;
let secondCard = null;

const attemptsCount = {};

fruitCards.forEach(card => {
    attemptsCount[card.englishName] = 0
});

function compareCards(event) {

    const clickedCard = event.currentTarget;

    if (!firstCard) {
        firstCard = clickedCard;
        firstCard.classList.add('correct');
    } else if (!secondCard && clickedCard !== firstCard) {
        secondCard = clickedCard;
        secondCard.classList.add('wrong');

        const firstCardObject = fruitCards.find(card => card.englishName === firstCard.querySelector('.exam-card .card h1').textContent || card.russianTranslation === firstCard.querySelector('.exam-card .card h1').textContent);
        const secondCardObject = fruitCards.find(card => card.russianTranslation === secondCard.querySelector('.exam-card .card h1').textContent || card.englishName === secondCard.querySelector('.exam-card .card h1').textContent);

        attemptsCount[firstCardObject.englishName]++;

        if (firstCardObject.englishName === secondCardObject.englishName) {

            firstCard.classList.add('correct');
            secondCard.classList.remove('wrong');
            secondCard.classList.add('correct');
            setTimeout(() => {
                firstCard.classList.add('fade-out');
                secondCard.classList.add('fade-out');
                firstCard.removeEventListener('click', compareCards);
                secondCard.removeEventListener('click', compareCards);
                updateExamProgress(document.querySelectorAll('.fade-out').length, fruitCards.length * 2, document.querySelectorAll('.fade-out').length);
                setTimeout(() => { checkEndExam() }, 100);
                firstCard = null;
                secondCard = null;
            }, 300);

        } else {
            setTimeout(() => {
                firstCard.classList.remove('correct');
                secondCard.classList.remove('wrong');
                firstCard = null;
                secondCard = null;
            }, 1000);
        }
    }
}

function checkEndExam() {
    if (document.querySelectorAll('.fade-out').length === fruitCards.length * 2) {
        clearInterval(timeInterval);

        const resultsModal = document.querySelector('.results-modal');
        const resultsContent = resultsModal.querySelector('.results-content');
        const templateWordStats = document.querySelector('#word-stats');
        resultsContent.innerHTML = '';

        fruitCards.forEach(card => {
            const clone = document.importNode(templateWordStats.content, true);
            clone.querySelector('.word span').textContent = card.englishName;
            clone.querySelector('.attempts span').textContent = attemptsCount[card.englishName];
            resultsContent.appendChild(clone);
        });

        const timerElement = resultsModal.querySelector('.time');
        timerElement.textContent = document.querySelector('#exam-mode #time').textContent;

        resultsModal.classList.remove('hidden');
    }
}

showCard(currentCardIndex);