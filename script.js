const questions = [
    {id: 1, text: "我经常向他人隐藏我的真实情绪。", dimension: "C"},
    {id: 2, text: "当我感到强烈的情绪时，我能很快让自己平静下来。", dimension: "A"},
    {id: 3, text: "我觉得体验负面情绪是可以接受的。", dimension: "T"},
    {id: 4, text: "我尽量不在别人面前表露我的不悦。", dimension: "C"},
    {id: 5, text: "我能够很好地控制自己的情绪反应。", dimension: "A"},
    {id: 6, text: "当悲伤或焦虑出现时，我允许自己去感受它们。", dimension: "T"},
    {id: 7, text: "人们通常看不出我内心的真实感受。", dimension: "C"},
    {id: 8, text: "遇到突发状况时，我能迅速调整心态。", dimension: "A"},
    {id: 9, text: "我认为情绪低落是生活正常的一部分。", dimension: "T"},
    {id: 10, text: "我习惯将情绪压抑在心里。", dimension: "C"},
    {id: 11, text: "我知道如何让自己从糟糕的情绪中走出来。", dimension: "A"},
    {id: 12, text: "面对不确定性带来的焦虑，我能够与之共处。", dimension: "T"},
    {id: 13, text: "我很少与他人分享我深层的感受。", dimension: "C"},
    {id: 14, text: "如果我愿意，我可以轻易改变自己的情绪状态。", dimension: "A"},
    {id: 15, text: "即使感到害怕，我也能接纳这种恐惧。", dimension: "T"},
    {id: 16, text: "我经常戴着面具与人交往。", dimension: "C"},
    {id: 17, text: "我善于在不同场合展现出恰当的情绪。", dimension: "A"},
    {id: 18, text: "我倾向于掩饰自己的脆弱。", dimension: "C"},
    {id: 19, text: "当情绪激动时，我很难让自己恢复理智。", dimension: "A_rev"},
    {id: 20, text: "我不喜欢让别人看到我哭泣。", dimension: "C"}
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
        } else if (q.dimension === 'A_rev') {
            scores.A += (6 - val);
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
