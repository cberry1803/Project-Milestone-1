// Quiz Code
// Questions and Answers Array
const questions = [
    {
        question: "Who is credited with creating the World Wide Web?",
        type: "single-answer",
        answers: [
            { text: "Steve Jobs", correct: false },
            { text: "Tim Berners-Lee", correct: true },
            { text: "Bill Gates", correct: false },
            { text: "Mark Zuckerberg", correct: false }
        ]

    },
    {
        question: "What does HTML stand for?",
        type: "single-answer",
        answers: [
            { text: "Hyperlinks and Text Markup Language", correct: false },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyper Text Markup Language", correct: true },
            { text: "Hyperlinking Text Marking Language", correct: false }
        ]
    },
    {
        question: "Which company developed the first web browser?",
        type: "single-answer",
        answers: [
            { text: "Netscape", correct: false },
            { text: "Microsoft", correct: false },
            { text: "CERN", correct: true },
            { text: "Apple", correct: false }
        ]
    },
    {
        question: "This is a place holder question?",
        type: "multi-answer",
        answers: [
            { text: "False", correct: false },
            { text: "True", correct: true },
            {text: "Also true", correct: true},
            {text: "Also false", correct: false}
        ]
    },
    {
        question: "What is 'UI' the abbreviation for in web development?",
        type: "blank",
        answers: [{ text: "User Interface", correct: true }]
    }
];

// DOM Elements
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-btns");
const nextButton = document.getElementById("next-btn");

// Quiz State Variables
let currentQuestionIndex = 0;
let score = 0;

// Start Quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}
// Show Question
function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;


    if (currentQuestion.type === "blank") {
        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("fill-in-blank-input");
        answerButtons.appendChild(input);
        nextButton.innerHTML = "Check Answer";
        nextButton.style.display = "block";
    }    else if (currentQuestion.type === "multi-answer") {
        currentQuestion.answers.forEach(answer => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("answer-checkbox");
            checkbox.dataset.correct = answer.correct;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(answer.text));
            label.classList.add("answer-label");
            answerButtons.appendChild(label);
            answerButtons.appendChild(document.createElement("br"));
        });
        nextButton.innerHTML = "Check Answers";
        nextButton.style.display = "block";
    } else {
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer.text;
            button.classList.add("answer-btn");
            answerButtons.appendChild(button);
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener("click", selectAnswer);
        });
    }
}
function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.type === "blank") {
        const input = answerButtons.querySelector("input.fill-in-blank-input");
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = currentQuestion.answers[0].text.trim().toLowerCase();

        if (userAnswer === correctAnswer) {
            input.classList.add("correct");
            score++;
        } else {
            input.classList.add("incorrect");
        }
        input.disabled = true;

    } else if (currentQuestion.type === "multi-answer") {
        const checkboxes = Array.from(answerButtons.querySelectorAll("input[type='checkbox']"));
        let userCorrect = true;
        let anyAnswerSelected = false;
        
        checkboxes.forEach((checkbox) => {
            const isCorrectOption = checkbox.dataset.correct === "true";
            const label = checkbox.parentNode;

            if (isCorrectOption) {
                label.classList.add("correct");
            }
            
            if (checkbox.checked) {
                anyAnswerSelected = true;
                if (!isCorrectOption) {
                    userCorrect = false;
                    label.classList.add("incorrect");
                }
            } else if (isCorrectOption) {
                userCorrect = false;
            }
            checkbox.disabled = true;
        });

        if (userCorrect && anyAnswerSelected) {
            score++;
        }
    } else { 
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }
        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
    }

    nextButton.style.display = "block";
    nextButton.innerHTML = "Next";
}


function showScore(){
    resetState();
    questionElement.innerHTML = `Score: ${score} out of ${questions.length}.`;
    if (score / questions.length >= 0.7) {
        questionElement.innerHTML += "<br>Great job! You passed.";
    } else {
        questionElement.innerHTML += "<br> You failed.";
    }   
    nextButton.innerHTML = "Try Again";
    nextButton.style.display = "block";
}


function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    } else{
        showScore();
    }
}


nextButton.addEventListener("click", () => {
     if (nextButton.innerHTML === "Try Again") {
        startQuiz();
    } else if (nextButton.innerHTML === "Check Answers") {
        selectAnswer();
    } else if (nextButton.innerHTML === "Check Answer") {
        selectAnswer();
    } else { // "Next"
        handleNextButton();
    }
});

startQuiz();