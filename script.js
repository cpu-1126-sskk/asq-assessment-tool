const questions = [
    {id: 1, text: "人们通常看不出我内心的真实感受。", english: "People usually can't tell how I am feeling inside.", dimension: "C"},
    {id: 2, text: "我能够很好地控制自己的情绪。", english: "I have my emotions well under control.", dimension: "A"},
    {id: 3, text: "我能够容忍强烈的的情绪。", english: "I can tolerate having strong emotions.", dimension: "T"},
    {id: 4, text: "我可以通过换个角度看问题来避免心烦意乱。", english: "I can avoid getting upset by taking a different perspective on things.", dimension: "A"},
    {id: 5, text: "我经常压抑自己对事物的情绪反应。", english: "I often suppress my emotional reactions to things.", dimension: "C"},
    {id: 6, text: "就算别人看到我心烦意乱也没关系。", english: "It's ok if people see me being upset.", dimension: "T"},
    {id: 7, text: "我能很快平静下来。", english: "I can calm down very quickly.", dimension: "A"},
    {id: 8, text: "我能够放下自己的情绪。", english: "I am able to let go of my feelings.", dimension: "A"},
    {id: 9, text: "我很擅长隐藏自己的感情。", english: "I am good at hiding my feelings.", dimension: "C"},
    {id: 10, text: "人们通常看不出我什么时候心烦意乱。", english: "People usually can't tell when I am upset.", dimension: "C"},
    {id: 11, text: "有时有负面情绪是可以的。", english: "It's ok to feel negative emotions at times.", dimension: "T"},
    {id: 12, text: "我能很快从坏情绪中走出来。", english: "I can get out of a bad mood very quickly.", dimension: "A"},
    {id: 13, text: "人们通常看不出我什么时候伤心。", english: "People usually can't tell when I am sad.", dimension: "C"},
    {id: 14, text: "我能容忍自己心烦意乱。", english: "I can tolerate being upset.", dimension: "T"},
    {id: 15, text: "我能表现得让别人看不出我心烦意乱。", english: "I can act in a way that people don't see me being upset.", dimension: "C"},
    {id: 16, text: "我确切地知道怎么做才能让自己的心情好起来。", english: "I know exactly what to do to get myself into a better mood.", dimension: "A"},
    {id: 17, text: "情绪激动并没有什么错。", english: "There is nothing wrong with feeling very emotional.", dimension: "T"},
    {id: 18, text: "我可以轻易伪装情绪。", english: "I could easily fake emotions.", dimension: "C"},
    {id: 19, text: "我能很容易地让心情变好。", english: "I can get into a better mood quite easily.", dimension: "A"},
    {id: 20, text: "如果必须的话，我能很好地隐藏我的愤怒。", english: "I can hide my anger well if I have to.", dimension: "C"}
];

let currentQuestionIndex = 0;
let responses = {};

// DOM Elements
const introView = document.getElementById('intro-view');
const quizView = document.getElementById('quiz-view');
const resultView = document.getElementById('result-view');
const startBtn = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const progressPercentage = document.getElementById('progress-percentage');

// Initialize
startBtn.addEventListener('click', () => {
    introView.style.display = 'none';
    quizView.style.display = 'block';
    renderQuestion();
});

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    const savedValue = responses[q.id] || null;

    questionContainer.innerHTML = `
        <div class="question-container active">
            <h2 class="question-text">${q.id}. ${q.text}</h2>
            <p class="english-text">${q.english}</p>
            <div class="options-grid">
                ${[1, 2, 3, 4, 5].map(val => `
                    <label class="option-item">
                        <input type="radio" name="q${q.id}" value="${val}" class="radio-hidden" ${savedValue == val ? 'checked' : ''} onchange="saveResponse(${q.id}, ${val})">
                        <div class="option-circle">${val}</div>
                        <span class="option-label">${getLabel(val)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;

    updateProgress();
    updateControls();
}

function getLabel(val) {
    const labels = {
        1: "完全不符合",
        2: "较不符合",
        3: "不确定",
        4: "较符合",
        5: "完全符合"
    };
    return labels[val];
}

window.saveResponse = (id, val) => {
    responses[id] = val;
    
    // Add fade-out animation to current question
    const currentContainer = questionContainer.querySelector('.question-container');
    if (currentContainer) {
        currentContainer.classList.add('fade-out');
    }

    // Advance after animation completes
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            showResults();
        }
    }, 400); // Matches the slideOut duration
};

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `第 ${currentQuestionIndex + 1} / ${questions.length} 题`;
    progressPercentage.innerText = `${Math.round(progress)}%`;
}

function updateControls() {
    prevBtn.style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';
    nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? '查看结果' : '下一题';
}

prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
});

nextBtn.addEventListener('click', () => {
    if (responses[questions[currentQuestionIndex].id]) {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            showResults();
        }
    } else {
        alert("请先选择一个选项");
    }
});

function showResults() {
    quizView.style.display = 'none';
    resultView.style.display = 'block';

    const scores = {C: 0, A: 0, T: 0};
    const counts = {C: 0, A: 0, T: 0};

    questions.forEach(q => {
        const val = responses[q.id];
        if (q.dimension === 'C') {
            scores.C += val;
            counts.C++;
        } else if (q.dimension === 'A') {
            scores.A += val;
            counts.A++;
        } else if (q.dimension === 'T') {
            scores.T += val;
            counts.T++;
        }
    });

    const avgC = (scores.C / counts.C).toFixed(2);
    const avgA = (scores.A / counts.A).toFixed(2);
    const avgT = (scores.T / counts.T).toFixed(2);

    document.getElementById('score-c').innerText = avgC;
    document.getElementById('score-a').innerText = avgA;
    document.getElementById('score-t').innerText = avgT;

    initChart(avgC, avgA, avgT);
}

function initChart(c, a, t) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    // Customizing Chart.js to fit the dark theme
    Chart.defaults.color = '#a0a0a8';
    Chart.defaults.font.family = "'Outfit', sans-serif";

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['隐藏 (Concealing)', '调整 (Adjusting)', '容忍 (Tolerating)'],
            datasets: [{
                label: '你的情感风格',
                data: [c, a, t],
                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                borderColor: '#4facfe',
                borderWidth: 3,
                pointBackgroundColor: '#00f2fe',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4facfe'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: {
                        font: { size: 14, weight: '600' },
                        color: '#ffffff'
                    },
                    suggestedMin: 1,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1,
                        backdropColor: 'transparent',
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            plugins: {
                legend: { display: false }
            },
            maintainAspectRatio: false
        }
    });
}
