let quizData = [];
let currentQuizIndex = 0;

function showQuizScreen() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.querySelector('.quiz-content').style.display = 'block';
    document.querySelector('.navigation').style.display = 'flex';
}

function updateQuizTitle(title) {
    let heading = document.querySelector('.container h2');
    if (!heading) {
        heading = document.createElement('h2');
        document.querySelector('.container').prepend(heading);
    }
    heading.textContent = 'Bài kiểm tra: ' + title;
}

async function loadQuizFile(fileName, title) {
    try {
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error('Lỗi khi tải file ' + fileName);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            quizData = data;
            currentQuizIndex = 0;
            showQuizScreen();
            updateQuizTitle(title);
            renderQuiz(currentQuizIndex);
        } else {
            alert('File JSON không hợp lệ. Dữ liệu phải là một mảng.');
        }
    } catch (error) {
        alert('Không thể tải bài kiểm tra: ' + error.message);
        console.error('Fetch error: ', error);
    }
}

async function loadQuizList() {
    try {
        const response = await fetch('quiz_list.json');
        if (!response.ok) {
            throw new Error('Lỗi khi tải danh sách đề thi.');
        }
        const listData = await response.json();
        if (Array.isArray(listData)) {
            const quizListContainer = document.getElementById('quizListContainer');
            quizListContainer.innerHTML = '';
            if (listData.length === 0) {
                quizListContainer.innerHTML = '<p>Không có đề thi có sẵn.</p>';
            } else {
                listData.forEach(quiz => {
                    const button = document.createElement('button');
                    button.textContent = 'Làm đề ' + quiz.name;
                    button.onclick = () => loadQuizFile(quiz.file, quiz.name);
                    quizListContainer.appendChild(button);
                });
            }
        }
    } catch (error) {
        alert('Không thể tải danh sách bài kiểm tra: ' + error.message);
        console.error('Fetch error: ', error);
    }
}

document.addEventListener('DOMContentLoaded', loadQuizList);

document.getElementById('jsonFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    quizData = importedData;
                    currentQuizIndex = 0;
                    showQuizScreen();
                    const fileName = file.name.replace(/\.json$/i, '');
                    updateQuizTitle(fileName);
                    renderQuiz(currentQuizIndex);
                } else {
                    alert('File JSON không hợp lệ. Dữ liệu phải là một mảng.');
                }
            } catch (error) {
                alert('Lỗi khi đọc file JSON: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
});

function renderQuiz(index) {
    if (quizData.length === 0) {
        document.getElementById('questionText').textContent = 'Không có câu hỏi nào. Vui lòng import file JSON.';
        document.getElementById('questionDich').style.display = 'none';
        document.getElementById('options').innerHTML = '';
        document.getElementById('explanation').style.display = 'none';
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('showAnswerBtn').disabled = true;
        return;
    }

    const data = quizData[index];

    document.getElementById('explanation').style.display = 'none';
    document.getElementById('questionDich').style.display = 'none';
    document.getElementById('showAnswerBtn').disabled = false;

    document.getElementById('questionText').textContent = `${index + 1}. ${data.CauHoi}`;

    const optionsList = document.getElementById('options');
    optionsList.innerHTML = '';

    data.CauTraLoi.forEach(option => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<input type="radio" name="answer" value="${option.TraLoi.split('.')[0]}"> ${option.TraLoi}<span class="dich">(${option.Dich})</span>`;
        listItem.onclick = () => checkAnswer(option.TraLoi.split('.')[0]);
        optionsList.appendChild(listItem);
    });

    document.getElementById('prevBtn').disabled = (index === 0);
    document.getElementById('nextBtn').disabled = (index === quizData.length - 1);
    document.getElementById('quizNumberInput').value = index + 1;
}

function checkAnswer(selectedAnswer) {
    const currentQuiz = quizData[currentQuizIndex];
    const isCorrect = (selectedAnswer === currentQuiz.DapAn);

    const options = document.querySelectorAll('#options li');
    options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        radio.disabled = true;

        if (radio.value === currentQuiz.DapAn) {
            option.classList.add('correct');
        } else if (radio.value === selectedAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
    });

    showExplanation();
}

function showAnswer() {
    const currentQuiz = quizData[currentQuizIndex];
    const options = document.querySelectorAll('#options li');
    options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.value === currentQuiz.DapAn) {
            option.classList.add('correct');
        }
        radio.disabled = true;
    });
    showExplanation();
}

function showExplanation() {
    const currentQuiz = quizData[currentQuizIndex];

    document.getElementById('questionDich').textContent = currentQuiz.DichCauHoi;
    document.getElementById('questionDich').style.display = 'block';

    const options = document.querySelectorAll('#options li');
    options.forEach(option => {
        option.classList.add('show-dich');
    });

    document.getElementById('explanationText').textContent = currentQuiz.GiaiThich;
    document.getElementById('explanation').style.display = 'block';
    document.getElementById('showAnswerBtn').disabled = true;
}

function nextQuiz() {
    if (currentQuizIndex < quizData.length - 1) {
        currentQuizIndex++;
        renderQuiz(currentQuizIndex);
    }
}

function prevQuiz() {
    if (currentQuizIndex > 0) {
        currentQuizIndex--;
        renderQuiz(currentQuizIndex);
    }
}

function goToQuiz() {
    const inputElement = document.getElementById('quizNumberInput');
    const quizNumber = parseInt(inputElement.value);

    if (isNaN(quizNumber) || quizNumber < 1 || quizNumber > quizData.length) {
        alert(`Vui lòng nhập một số hợp lệ từ 1 đến ${quizData.length}.`);
        inputElement.value = currentQuizIndex + 1;
        return;
    }

    const newIndex = quizNumber - 1;
    if (newIndex !== currentQuizIndex) {
        currentQuizIndex = newIndex;
        renderQuiz(currentQuizIndex);
    }
}