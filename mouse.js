let clicks = 0;
let timeLeft = 30;
let timerStarted = false;
let timerId = null;

const testArea = document.getElementById('testArea');
const clickDisplay = document.getElementById('clickCount');
const timerDisplay = document.getElementById('timer');
const cpsDisplay = document.getElementById('cpsValue');
const resetBtn = document.getElementById('resetBtn');
const promptText = document.getElementById('promptText');
const resultLabel = document.getElementById('resultLabel');

function startTimer() {
    timerStarted = true;
    promptText.innerHTML = "點擊！點擊！點擊！<br>CLICK! CLICK! CLICK!";
    
    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        
        // Calculate real-time CPS
        const elapsed = 30 - timeLeft;
        if (elapsed > 0) {
            cpsDisplay.innerText = (clicks / elapsed).toFixed(1);
        }

        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    clearInterval(timerId);
    testArea.classList.add('disabled');
    promptText.innerHTML = "挑戰結束！<br>Challenge Finished!";
    
    const finalCPS = (clicks / 30).toFixed(1);
    cpsDisplay.innerText = finalCPS;
    
    let rank = "";
    if (finalCPS > 10) rank = "神速！ (Legendary Speed)";
    else if (finalCPS > 7) rank = "高手！ (Pro Clicker)";
    else if (finalCPS > 4) rank = "正常 (Normal)";
    else rank = "還需練習 (Needs Practice)";
    
    resultLabel.innerText = `最終結果: ${finalCPS} CPS - ${rank}`;
}

testArea.addEventListener('mousedown', (e) => {
    if (timeLeft <= 0) return;
    
    if (!timerStarted) {
        startTimer();
    }
    
    clicks++;
    clickDisplay.innerText = clicks;

    // Visual effect on click
    createClickEffect(e);
});

function createClickEffect(e) {
    const rect = testArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    testArea.appendChild(effect);
    setTimeout(() => effect.remove(), 400);
}

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    clicks = 0;
    timeLeft = 30;
    timerStarted = false;
    
    clickDisplay.innerText = "0";
    timerDisplay.innerText = "30";
    cpsDisplay.innerText = "0.0";
    promptText.innerHTML = "點擊此處開始測速！<br>Click here to start!";
    resultLabel.innerText = "";
    testArea.classList.remove('disabled');
});
