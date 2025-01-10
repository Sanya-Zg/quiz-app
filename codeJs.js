const allbtns = document.querySelectorAll('.nav-button');
const screenColor = document.getElementById('screen_color');
const quizTheme = document.querySelector('.quiz_theme');
const blockWelcome = document.querySelector('.content__welcome');
const blockQuiz = document.querySelector('.quiz__main');
const blockResult = document.querySelector('.result__quiz');
const askElement = document.getElementById('ask_element');
const progressItem = document.querySelector('.progress-item');
const answerItems = document.querySelectorAll('.answer');
const submitAnswer = document.getElementById('answer_submit');
const nextAnswer = document.getElementById('answer_next');
const checkResult = document.getElementById('answer_check');
const playAgain = document.getElementById('play-again');
const err = document.querySelector('.err');
const resultTitle = document.querySelector('.result-title');

fetch('./data.json')
    .then(response => response.json())
    .then(data =>{
        
        let currentQuestion = 0;
        let currentIndex;
        let countOfQuestions;
        let correctAnswers = 0;

        // choosing a quiz
        allbtns.forEach((el, index) => {
            el.addEventListener('click', () => {
                currentIndex = index;
                quizTheme.style.visibility = 'visible';
                blockWelcome.style.display = 'none';
                blockQuiz.style.display = 'block';
                countOfQuestions = data.quizzes[index].questions.length;
                currentQuestion = 0;
                correctAnswers = 0; 
                questionFunc(index, countOfQuestions, currentQuestion);
                progress(currentQuestion, countOfQuestions);

// ------------add icon and title of page-----------
                const img = document.createElement('img');
                const titleIcon = document.createElement('p');

                switch(index) {
                case 0: img.classList.add('icon_quiz-html');
                    break;
                case 1: img.classList.add('icon_quiz-css');
                    break;
                case 2: img.classList.add('icon_quiz-js');
                    break;
                case 3: img.classList.add('icon_quiz-access');
            }
            
            titleIcon.classList.add('title_quiz');
            img.src = `${data.quizzes[index].icon}`;
            titleIcon.textContent = `${data.quizzes[index].title}`;
            quizTheme.innerHTML = '';
            quizTheme.append(img, titleIcon);
            });
        });
        //Progress of questions
        function progress(currentQuestion, countOfQuestions) {
            let progress = (currentQuestion + 1) / countOfQuestions * 100;
            progressItem.style.width = progress + '%';
        }
        //main function for quiz
        function questionFunc(ind, num, curr) {
            const questionNum = document.createElement('p');
            const questionEl = document.createElement('p');
            questionNum.classList.add('italic_p');
            questionEl.classList.add('question');
            questionNum.textContent = `Question ${curr + 1} of ${num}`;
            questionEl.textContent = data.quizzes[ind].questions[curr].question;
            askElement.innerHTML = ''; // Clear the previous question

            answerItems.forEach((element, indexItem) => {
                element.style.pointerEvents = 'auto';
                element.innerHTML = '';
                element.classList.remove('green-border', 'red-border', 'purple-border', 'selected');
                // Adding new content
                const alphabet = "ABCD";
                const alphList = document.createElement('div');
                const answerA = document.createElement('p');
                alphList.classList.add('v-a');
                alphList.textContent = alphabet[indexItem];
                answerA.setAttribute('data-answerCorrect', data.quizzes[ind].questions[curr].options[indexItem] === data.quizzes[ind].questions[curr].answer);
                answerA.textContent = data.quizzes[ind].questions[curr].options[indexItem];
                element.append( alphList, answerA);
                
                element.onclick = null;
                element.addEventListener('click', () => handleAnswerClick(element, answerA, ind));
            });
            askElement.append(questionNum, questionEl);
        }
        // -------dark theme-------
        screenColor.addEventListener('input', () => {
            document.body.classList.toggle('dark-theme');
        })

        // Click handler
        function handleAnswerClick(itemEl, ans, i) {
            answerItems.forEach(el => {
                el.classList.remove('selected', 'green-border', 'red-border', 'purple-border')
                el.style.pointerEvents = 'none';
            });
            itemEl.classList.add('selected', 'purple-border');
            itemEl.querySelector('div').classList.add('purple-ground');
        }

        // Next question
        nextAnswer.addEventListener('click', () => {
            currentQuestion++;
            progress(currentQuestion, countOfQuestions);
            if (currentQuestion < countOfQuestions) {
                questionFunc(currentIndex, countOfQuestions, currentQuestion);
                submitAnswer.style.display = 'block';
                nextAnswer.style.display = 'none';
            }
             else {
                nextAnswer.style.display = 'none';
                checkResult.style.display = 'block';
            }
        });

        //button show final result
        checkResult.addEventListener('click', () => {
            blockQuiz.style.display = 'none';
            blockResult.style.display = 'block';
            document.querySelector('.result_amount').textContent = correctAnswers;
            let resP =  quizTheme.querySelector('p').cloneNode(true);
            let resImg = quizTheme.querySelector('img').cloneNode(true);
            resultTitle.innerHTML = '';
            resultTitle.append(resImg, resP);
        })

        // Send answer and check if correct
        submitAnswer.addEventListener('click', () => {
            const choosedEl = document.querySelector('.selected');
                if(!choosedEl) {
                    err.style.visibility = 'visible';
                    return;
                } else {
                    err.style.visibility = 'hidden';
                }
                const correctEl = Array.from(answerItems).find(elem => elem.querySelector('p').getAttribute('data-answerCorrect') === 'true');

            let divGround = choosedEl.querySelector('div');
             choosedEl.classList.remove('purple-border');
             divGround.classList.remove('purple-ground');
             const imgIcon = document.createElement('img');

             if (choosedEl.querySelector('p').getAttribute('data-answerCorrect') === "true") {
                choosedEl.classList.add('green-border');
                imgIcon.src = './assets/images/icon-correct.svg';
                imgIcon.classList.add('correct-img');
                choosedEl.append(imgIcon);
                divGround.classList.add('green-ground');
                 correctAnswers++;
            } else {
                choosedEl.classList.add('red-border');
                imgIcon.src = './assets/images/icon-incorrect.svg';
                imgIcon.classList.add('incorrect-img');
                choosedEl.append(imgIcon);
                choosedEl.querySelector('div').classList.add('red-ground');
                    const imgIconGreen = document.createElement('img');
                imgIconGreen.src = './assets/images/icon-correct.svg';
                imgIconGreen.classList.add('correct-img');
                correctEl.append(imgIconGreen);
            }
            if (currentQuestion < countOfQuestions -1) {
                submitAnswer.style.display = 'none';
                nextAnswer.style.display = 'block';
            } else {
                nextAnswer.style.display = 'none';
                submitAnswer.style.display = 'none';
                checkResult.style.display = 'block';
            }
        });
// ------New quiz-----
        playAgain.addEventListener('click', () => {
            blockResult.style.display = 'none';
            blockWelcome.style.display = 'block';
            checkResult.style.display = 'none';
            submitAnswer.style.display = 'block';
            quizTheme.style.visibility = 'hidden';
        })
    })
    .catch(error => {
        console.log("EEERRROOOORRR!!");
        
    })