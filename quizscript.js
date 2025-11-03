// Quiz Code
// Questions and Answers Array
const questions = [
    {
        question: "What is the main purpose of a browsers' rendering engine?",
        type: "single-answer",
        answers: [
            { text: "To store cookies.", correct: false },
            { text: "To display HTML and CSS code visually.", correct: true },
            { text: "To connect to the internet.", correct: false },
            { text: "To protect the computer from viruses.", correct: false }
        ]

    },
    {
        question: "Which of the following browsers introduced Javascirpt to the web?",
        type: "single-answer",
        answers: [
            { text: "Opera", correct: false },
            { text: "Internet Explorer", correct: false },
            { text: "Netscape Navigator", correct: true },
            { text: "Mosaic", correct: false }
        ]
    },
    {
        question: "Which protocol is used by broswers to retrieve content from web servers?",
        type: "single-answer",
        answers: [
            { text: "HTML", correct: false },
            { text: "FTP", correct: false },
            { text: "HTTP", correct: true },
            { text: "TCP", correct: false }
        ]
    },
    {
        question: "Which of the following are modern web browsers? (Select all that apply)",
        type: "multi-answer",
        answers: [
            { text: "Google Chrome", correct: true },
            { text: "Mozilla Firefox", correct: true },
            {text: "Microsoft Edge", correct: true},
            {text: "Windows XP", correct: false}
        ]
    },
    {
        question: "While at _____ Tim Berners-Lee invented the World Wide Web.",
        type: "blank",
        answers: [{ text: "CERN", correct: true }]
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
// Reset State
function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}
// Select Answer
function selectAnswer(e){
    const currentQuestion = questions[currentQuestionIndex];
    // Handle different question types
    // Fill-in-the-blank
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
    // Multiple-answer
    } else if (currentQuestion.type === "multi-answer") {
        const checkboxes = Array.from(answerButtons.querySelectorAll("input[type='checkbox']"));
        let userCorrect = true;
        let anyAnswerSelected = false;
    // Check each checkbox
        checkboxes.forEach((checkbox) => {
            const isCorrectOption = checkbox.dataset.correct === "true";
            const label = checkbox.parentNode;
            // Correct option
            if (isCorrectOption) {
                label.classList.add("correct");
            }
            // User selected this option
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
    // Single-answer
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
    // Show Next Button
    nextButton.style.display = "block";
    nextButton.innerHTML = "Next";
}

// Show Score
function showScore(){
    resetState();
    // Display final score
    questionElement.innerHTML = `Score: ${score} out of ${questions.length}.`;
    // Pass/Fail Message based on 70% threshold
    if (score / questions.length >= 0.7) {
        questionElement.innerHTML += "<br>Great job! You passed.";
    } else {
        questionElement.innerHTML += "<br> You failed.";
    }   
    // Show Try Again button
    nextButton.innerHTML = "Try Again";
    nextButton.style.display = "block";
}

// Handle Next Button Click
function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    } else{
        showScore();
    }
}

// Next Button Event Listener
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