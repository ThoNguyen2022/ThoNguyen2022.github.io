let quizData = [];
let currentQuizIndex = 1;
let currentQuestionIndex = 0;

async function startQuiz() {
    try {
        const response = await fetch('Part7.json');
        if (!response.ok) {
            throw new Error('Lỗi khi tải file Part7.json.');
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 1) {
            quizData = data;
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('quizContent').style.display = 'block';
            document.getElementById('navigationControls').style.display = 'flex';
            renderQuiz(currentQuizIndex);
        } else {
            alert('File Part7.json không hợp lệ.');
        }
    } catch (error) {
        alert('Không thể tải bài kiểm tra: ' + error.message);
        console.error('Fetch error: ', error);
    }
}

function togglePassage() {
    const passageSection = document.getElementById('passageContent');
    if (passageSection.style.display === 'block') {
        passageSection.style.display = 'none';
        document.getElementById('viewPassageBtn').textContent = 'Xem';
    } else {
        passageSection.style.display = 'block';
        document.getElementById('viewPassageBtn').textContent = 'Ẩn';
    }
}

function togglePassageTranslation() {
    const passageTranslations = document.querySelectorAll('.passage-dich');
    const button = document.getElementById('translatePassageBtn');
    const isVisible = passageTranslations[0].style.display === 'inline';
    passageTranslations.forEach(span => {
        span.style.display = isVisible ? 'none' : 'inline';
    });
    button.textContent = isVisible ? 'Dịch' : 'Dịch';
}

function findPassageForQuiz(questionIndex) {
    let passage = null;
    for (let i = questionIndex; i >= 0; i--) {
        if (quizData[i] && quizData[i].DoanVan) {
            passage = quizData[i].DoanVan;
            break;
        }
    }
    return passage;
}

function renderPassage(passageData) {
    const passageTextContainer = document.getElementById('passage-text');
    passageTextContainer.innerHTML = '';
    if (passageData) {
        passageData.forEach(sentence => {
            const p = document.createElement('p');
            p.innerHTML = `${sentence.Cau} <span class="passage-dich">(${sentence.Dich})</span>`;
            passageTextContainer.appendChild(p);
        });
    } else {
        passageTextContainer.textContent = 'Không có đoạn văn cho câu hỏi này.';
    }
}

function renderQuiz(index) {
    const questionIndex = index;
    if (questionIndex < 1 || questionIndex >= quizData.length) {
        return;
    }

    const data = quizData[questionIndex];
    
    const passageData = findPassageForQuiz(questionIndex);
    renderPassage(passageData);

    document.getElementById('questionDich').style.display = 'none';
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('showAnswerBtn').disabled = false;

    document.getElementById('questionNumber').textContent = `Câu ${index}`;
    document.getElementById('questionText').textContent = data.CauHoi;
    document.getElementById('questionDich').textContent = data.DichCauHoi;

    const optionsList = document.getElementById('options');
    optionsList.innerHTML = '';
    data.CauTraLoi.forEach((option, i) => {
        const optionLetter = String.fromCharCode(65 + i);
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="radio" name="answer" id="option${i}" value="${optionLetter}">
            <label for="option${i}">
                <span class="original-text">${optionLetter}. ${option.TraLoi}</span>
                <span class="dich-tra-loi">(${option.Dich})</span>
            </label>
        `;
        optionsList.appendChild(listItem);
    });

    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            checkAnswer(event.target.value, questionIndex);
        });
    });

    document.getElementById('prevBtn').disabled = (index === 1);
    document.getElementById('nextBtn').disabled = (index === quizData.length - 1);
    document.getElementById('quizNumberInput').setAttribute('max', quizData.length - 1);
}

function checkAnswer(selectedAnswer, index) {
    const data = quizData[index];
    const isCorrect = (selectedAnswer === data.DapAn);
    
    showTranslations();

    const options = document.querySelectorAll('#options li');
    options.forEach(li => {
        const radio = li.querySelector('input[type="radio"]');
        radio.disabled = true;

        if (radio.value === data.DapAn) {
            li.classList.add('correct');
        } else if (radio.value === selectedAnswer) {
            li.classList.add('incorrect');
        }
    });

    showExplanation(index);
}

function showTranslations() {
    document.getElementById('questionDich').style.display = 'block';
    document.querySelectorAll('.dich-tra-loi').forEach(span => {
        span.style.display = 'inline';
    });
}

function showAnswer() {
    const data = quizData[currentQuizIndex];
    showTranslations();
    const options = document.querySelectorAll('#options li');
    options.forEach(li => {
        const radio = li.querySelector('input[type="radio"]');
        radio.disabled = true;
        if (radio.value === data.DapAn) {
            li.classList.add('correct');
        }
    });
    showExplanation(currentQuizIndex);
}

function showExplanation(index) {
    const data = quizData[index];
    document.getElementById('explanationText').textContent = data.GiaiThich;
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
    if (currentQuizIndex > 1) {
        currentQuizIndex--;
        renderQuiz(currentQuizIndex);
    }
}

function goToQuiz() {
    const input = document.getElementById('quizNumberInput');
    const newIndex = parseInt(input.value);
    if (!isNaN(newIndex) && newIndex >= 1 && newIndex < quizData.length) {
        currentQuizIndex = newIndex;
        renderQuiz(currentQuizIndex);
        input.value = '';
    } else {
        alert('Vui lòng nhập số câu hợp lệ (từ 1 đến ' + (quizData.length - 1) + ')');
    }
}