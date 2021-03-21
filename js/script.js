let preQuestions;

let promise = new Promise((resolve, reject) => {
    setTimeout(function(){
        resolve("OK!");
        fetch('https://quiztai.herokuapp.com/api/quiz')
            .then(resp => resp.json())
            .then(resp => {
                preQuestions = resp;
                // kod wykorzystujący preQuestions  <-

                let next = document.querySelector('.next');
                let previous = document.querySelector('.previous');

                let question = document.querySelector('.question');
                let answers = document.querySelectorAll('.list-group-item');
                let list = document.querySelector('.list');
                let results = document.querySelector('.results');
                let average = document.querySelector('.average');
                let score = document.querySelector('.score');
                let restart = document.querySelector('.restart');

                let userPoints = document.querySelector('.userPoints');
                let questionCounter = document.querySelector('#index');

                let index = 0;
                let points = 0;

                setQuestion(index);
                activateAnswers();

                for (let i = 0; i < answers.length; i++) {
                    answers[i].addEventListener('click', doAction);
                }

                function doAction(event) {
                    if (event.target.innerHTML === preQuestions[index].correct_answer) {
                        points++;
                        score.innerText = points;
                        markCorrect(event.target);
                    }
                    else {
                        markInCorrect(event.target);
                    }
                    disableAnswers();
                }

                function activateAnswers() {
                    for (let i = 0; i < answers.length; i++) {
                        answers[i].addEventListener('click', doAction);
                    }
                }

                function disableAnswers() {
                    for (let i = 0; i < answers.length; i++) {
                        answers[i].removeEventListener('click', doAction);
                    }
                }

                function markCorrect(elem) {
                    elem.classList.add('correct');
                }

                function markInCorrect(elem) {
                    elem.classList.add('incorrect');
                }

                function clearAnswer(){
                    for (let i = 0; i < answers.length; i++) {
                        answers[i].classList.remove('correct');
                        answers[i].classList.remove('incorrect');
                    }
                }

                function setQuestion(index) {
                    clearAnswer();

                    questionCounter.innerHTML = (index+1);
                    question.innerHTML = preQuestions[index].question;

                    for(let i = 0 ; i < 4;i++){
                        if(i<preQuestions[index].answers.length){
                            answers[i].innerHTML = preQuestions[index].answers[i];
                            answers[i].style.display = 'block';
                        } else {
                            answers[i].style.display = 'none';
                        }
                    }
                }

                restart.addEventListener('click', function (event) {
                    event.preventDefault();

                    points = 0;
                    index = 0;

                    let score = document.querySelector('.score');
                    score.innerHTML = 0;
                    setQuestion(0);
                    activateAnswers();
                    list.style.display = 'block';
                    results.style.display = 'none';
                });

                next.addEventListener('click', function () {
                    index++;
                    if (index >= preQuestions.length) {
                        list.style.display = 'none';
                        results.style.display = 'block';
                        userPoints.innerHTML = points;
                        let games = localStorage.getItem("games");
                        let pointsLocalStorage = localStorage.getItem("points");

                        if (games === null) {
                            localStorage.setItem("games", "1");
                            localStorage.setItem("points", points);
                        } else {
                            games = parseInt(games) + 1;
                            pointsLocalStorage = parseFloat(pointsLocalStorage);
                            let avg = (pointsLocalStorage + points) / games;
                            avg = Math.round(avg * 1000) / 1000;
                            localStorage.removeItem("games");
                            localStorage.removeItem("points");
                            localStorage.setItem("games", games);
                            localStorage.setItem("points", avg);
                            average.innerHTML = avg;
                        }
                    } else {
                        setQuestion(index);
                        activateAnswers();
                    }

                });

                previous.addEventListener('click', function () {
                    if(index > 0){
                        index--;
                        setQuestion(index);
                        activateAnswers();
                    }
                });
            });
    });
});

promise.then((response) => {
    console.log("Test! " + response);
});
