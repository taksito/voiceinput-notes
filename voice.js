const recordBtn = document.getElementById('recordBtn');
const copyBtn = document.getElementById('copyBtn');
const transcriptArea = document.getElementById('transcript');
const statusText = document.getElementById('status');
const langButtons = document.querySelectorAll('.lang-btn');
const micIcon = document.getElementById('micIcon');
const stopIcon = document.getElementById('stopIcon');

let recognition;
let isRecording = false;
let currentLang = 'zh-TW';

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLang;

    recognition.onstart = () => {
        isRecording = true;
        recordBtn.classList.add('recording');
        micIcon.style.display = 'none';
        stopIcon.style.display = 'block';
        statusText.innerText = '正在聆聽... / Listening...';
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript) {
            transcriptArea.innerText += (transcriptArea.innerText ? ' ' : '') + finalTranscript;
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
        if (event.error === 'not-allowed') {
            statusText.innerText = '錯誤：無麥克風權限 / Permission Denied';
        } else {
            statusText.innerText = `錯誤: ${event.error}`;
        }
    };

    recognition.onend = () => {
        if (isRecording) {
            recognition.start();
        } else {
            stopRecording();
        }
    };
} else {
    statusText.innerText = '您的瀏覽器不支持語音辨識 / Browser not supported';
    recordBtn.disabled = true;
    recordBtn.style.opacity = '0.5';
}

function startRecording() {
    if (!recognition) return;
    recognition.lang = currentLang;
    recognition.start();
}

function stopRecording() {
    isRecording = false;
    if (recognition) {
        recognition.stop();
    }
    recordBtn.classList.remove('recording');
    micIcon.style.display = 'block';
    stopIcon.style.display = 'none';
    statusText.innerText = '錄音結束 / Ready';
}

recordBtn.addEventListener('click', () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRecording) {
            alert('切換語言前請先停止錄音 / Please stop recording before switching language');
            return;
        }
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLang = btn.dataset.lang;
        const langLabel = currentLang === 'zh-TW' ? '中文 (繁體)' : 'English';
        statusText.innerText = `語言已切換為: ${langLabel}`;
    });
});

copyBtn.addEventListener('click', () => {
    const text = transcriptArea.innerText;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = '已複製！ / Copied!';
        setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
    });
});
