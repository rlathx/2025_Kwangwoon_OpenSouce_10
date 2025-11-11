window.addEventListener('DOMContentLoaded', () => {
    // 저장된 설정 불러와서 화면에 적용하기
    loadSettingsAndQuestions();
    
    // 저장 버튼
    document.getElementById('btnSave').addEventListener('click', saveSettings);
    // 나만의 질문 추가 버튼
    document.getElementById('btnAddMyQ').addEventListener('click', addCustomQuestion);

    // 질문 목록에서 삭제 버튼 클릭 시 
    document.getElementById('myQList').addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.btn-delete');
        if (deleteButton) {
            const index = parseInt(deleteButton.dataset.index, 10);
            deleteCustomQuestion(index);
        }
    });

    // 오늘의 질문 설정 드롭다운이 바뀔 때마다 나만의 질문 추가 영역을 보여주거나 숨김
    document.getElementById('qSource').addEventListener('change', toggleCustomQWrap);
});

async function loadSettingsAndQuestions() {
    try {
        const [settingsRes, questionsRes] = await Promise.all([
            fetch('/api/settings'), //
            fetch('/api/questions')  //
        ]);

        if (!settingsRes.ok || !questionsRes.ok) {
            throw new Error('Failed to fetch initial data');
        }

        const settings = await settingsRes.json();
        const questions = await questionsRes.json();

        // ---  설정(settings) 적용 ---
        document.getElementById('mbtiSelect').value = settings.selectedMBTI || ''; 
        document.getElementById('qSource').value = settings.questionType || 'basic';
        document.getElementById('quoteMode').value = settings.messageType || 'quote';

        // ---  질문 목록(questions) 렌더링 ---
        renderCustomQuestions(questions.custom || []);

        // ---  UI 업데이트 ---
        toggleCustomQWrap();

    } catch (error) {
        console.error('설정 로드 실패:', error);
    }
}
async function saveSettings() {
    // 현재 화면(setting.html)의 값들을 가져옴
    const mbti = document.getElementById('mbtiSelect').value;
    const qSource = document.getElementById('qSource').value;
    const quoteMode = document.getElementById('quoteMode').value;

    // HTML의 값 -> 서버가 이해하는 객체로 변환
    const settingsData = {
        selectedMBTI: mbti,
        questionType: qSource,
        messageType: quoteMode
    };

    try {
        // 서버로 PUT 요청
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settingsData)
        });

        if (!response.ok) {
            throw new Error('Server failed to save settings');
        }

        // 저장 완료 뱃지 표시
        const badge = document.getElementById('savedOk');
        badge.classList.add('show');
        setTimeout(() => { 
            badge.classList.remove('show'); 
        }, 2000);

    } catch (error) {
        console.error('설정 저장 실패:', error);
        alert('설정 저장에 실패했습니다.');
    }
}


// 나만의 질문 목록을 화면(myQList)에 렌더링 
function renderCustomQuestions(questions = []) {
    const listElement = document.getElementById('myQList');
    
    listElement.innerHTML = ''; 

    if (questions.length === 0) {
        listElement.innerHTML = '<li class="list-group-item text-muted">추가된 질문이 없습니다.</li>';
        return;
    }

    questions.forEach((q, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = q;
        li.appendChild(textSpan);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-outline-danger btn-sm btn-delete';
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i> 삭제';
        deleteBtn.dataset.index = index; 
        li.appendChild(deleteBtn);

        listElement.appendChild(li);
    });
}

// '나만의 질문'을 서버(/api/questions/custom)로 전송
async function addCustomQuestion() {
    const input = document.getElementById('myQInput');
    const question = input.value.trim();

    if (!question) {
        alert('질문을 입력해주세요!');
        return;
    }

    try {
        // 서버로 POST 요청
        const response = await fetch('/api/questions/custom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });

        if (!response.ok) {
            throw new Error('Server failed to add question');
        }

        // 성공 시, 질문 목록을 다시 불러와 렌더링
        const questionsRes = await fetch('/api/questions');
        const questions = await questionsRes.json();
        renderCustomQuestions(questions.custom || []);

        input.value = ''; // 입력창 비우기

    } catch (error) {
        console.error('질문 추가 실패:', error);
        alert('질문 추가에 실패했습니다.');
    }
}

async function deleteCustomQuestion(index) {
    if (!confirm('이 질문을 삭제하시겠습니까?')) {
        return;
    }

    try {
        // 서버로 DELETE 요청
        const response = await fetch(`/api/questions/custom/${index}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Server failed to delete question');
        }
        
        // 성공 시, 질문 목록을 다시 불러와 렌더링
        const questionsRes = await fetch('/api/questions');
        const questions = await questionsRes.json();
        renderCustomQuestions(questions.custom || []);

    } catch (error) {
        console.error('질문 삭제 실패:', error);
        alert('질문 삭제에 실패했습니다.');
    }
}

function toggleCustomQWrap() {
    const qSource = document.getElementById('qSource').value;
    const wrap = document.getElementById('customQsWrap'); 
    
    wrap.style.display = (qSource === 'custom') ? 'block' : 'none';
}