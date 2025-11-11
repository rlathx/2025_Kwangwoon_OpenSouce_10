let currentQuestion = '';
let currentMessage = '';

// 페이지 로드 시 초기화
window.onload = async () => {
    // 날짜 세팅
    const params = new URLSearchParams(location.search);
    const dateStr = params.get('date') || getTodayDate();
    document.getElementById('dateText').textContent = dateStr;

    //서버에서 오늘의 질문 로드
    await loadTodayQuestion();
    // 서버에서 기존 일기/기분/날씨 로드
    await loadDiaryData(dateStr); 

    // 이모지(기분, 날씨) 클릭 시 UI 업데이트
    document.getElementById('moodList').addEventListener('click', (e) => {
        const emo = e.target.closest('.emoji-item')?.textContent;
        if (!emo) return;
        document.getElementById('moodNow').textContent = emo;
    });
    document.getElementById('weatherList').addEventListener('click', (e) => {
        const emo = e.target.closest('.emoji-item')?.textContent;
        if (!emo) return;
        document.getElementById('weatherNow').textContent = emo;
    });

    // 저장 버튼
    document.getElementById('btnSave').addEventListener('click', () => saveDiary(dateStr));

    // 뒤로가기 버튼
    document.getElementById('btnBack').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('index.html');
    });
    
    // 기분/날씨 초기화 버튼
    document.getElementById('btnResetMood').addEventListener('click', () => {
        document.getElementById('moodNow').textContent = '—';
    });

    document.getElementById('btnResetWeather').addEventListener('click', () => {
        document.getElementById('weatherNow').textContent = '—';
    });
};

// 오늘의 질문 로드
async function loadTodayQuestion() {
    const listElement = document.getElementById('question-list');
    listElement.innerHTML = '<li>질문을 불러오는 중...</li>';

    try {
        const res = await fetch('/api/today-question', { cache: 'no-store' });
        
        if (!res.ok) {
            throw new Error(`서버 응답 오류: ${res.status}`);
        }
        
        const data = await res.json();
        const question = data?.question || '';
        
        if (!question) {
            throw new Error('질문이 비어있습니다');
        }
        
        currentQuestion = question;
        listElement.innerHTML = '';
        const li = document.createElement('li');
        li.textContent = question;
        listElement.appendChild(li);
        
    } catch (error) {
        console.error('질문 로드 실패:', error);
        listElement.innerHTML = '<li style="color: #ef4444;">질문을 불러오지 못했습니다. 서버를 확인해주세요.</li>';
        currentQuestion = '오늘 하루를 한 문장으로 남겨볼까요?';
    }
}

// 기존 일기 데이터 로드
async function loadDiaryData(dateStr) {
    try {
        const response = await fetch(`/api/diaries/${dateStr}`);
        if (response.ok) {
            const diary = await response.json();
            
            document.getElementById('note').value = diary.content || '';
            document.getElementById('moodNow').textContent = diary.mood || '—';
            document.getElementById('weatherNow').textContent = diary.weather || '—';
        }
    } catch (error) {
        console.error('일기 로드 실패:', error);
    }
}

// 일기 저장
async function saveDiary(dateStr) {
    const content = document.getElementById('note').value;
    const mood = document.getElementById('moodNow').textContent;
    const weather = document.getElementById('weatherNow').textContent;

    const diaryData = {
        date: dateStr,
        content: content,
        mood: (mood === '—') ? '' : mood,
        weather: (weather === '—') ? '' : weather,
        question: currentQuestion,
        message: currentMessage
    };

    try {
        const response = await fetch('/api/diaries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diaryData)
        });

        if (response.ok) {
            alert('일기가 저장되었습니다! 📝');
            window.location.href = 'index.html';
        } else {
            throw new Error('저장 실패');
        }
    } catch (error) {
        console.error('저장 오류:', error);
        alert('일기 저장 중 오류가 발생했습니다. 서버를 확인해주세요.');
    }
}

// 오늘 날짜 가져오기 (YYYY-MM-DD 형식)
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}