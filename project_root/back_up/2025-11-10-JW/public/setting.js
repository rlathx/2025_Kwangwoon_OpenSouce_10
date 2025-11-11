        let currentSettings = {};
        let customQuestions = [];

        // 페이지 로드 시 초기화
        window.onload = async () => {
            await loadSettings();
            await loadCustomQuestions();
            renderCustomQuestions();
        };

        // 설정 로드
        async function loadSettings() {
            try {
                const response = await fetch('/api/settings');
                currentSettings = await response.json();

                // 라디오 버튼 설정
                document.querySelector(`input[name="questionType"][value="${currentSettings.questionType}"]`).checked = true;
                document.querySelector(`input[name="messageType"][value="${currentSettings.messageType}"]`).checked = true;

                // MBTI 선택 설정
                document.getElementById('mbtiSelect').value = currentSettings.selectedMBTI;
                document.getElementById('mbtiMessageSelect').value = currentSettings.selectedMBTI;

                // 조건부 표시
                updateQuestionType();
                updateMessageType();
            } catch (error) {
                console.error('설정 로드 실패:', error);
            }
        }

        // 사용자 정의 질문 로드
        async function loadCustomQuestions() {
            try {
                const response = await fetch('/api/questions');
                const data = await response.json();
                customQuestions = data.custom || [];
            } catch (error) {
                console.error('질문 로드 실패:', error);
                customQuestions = [];
            }
        }

        // 질문 유형 변경 시
        function updateQuestionType() {
            const questionType = document.querySelector('input[name="questionType"]:checked').value;
            const mbtiSelector = document.getElementById('mbtiSelector');

            if (questionType === 'mbti') {
                mbtiSelector.style.display = 'block';
            } else {
                mbtiSelector.style.display = 'none';
            }

            saveSettings();
        }

        // 메시지 유형 변경 시
        function updateMessageType() {
            const messageType = document.querySelector('input[name="messageType"]:checked').value;
            const mbtiMessageSelector = document.getElementById('mbtiMessageSelector');

            if (messageType === 'mbti') {
                mbtiMessageSelector.style.display = 'block';
            } else {
                mbtiMessageSelector.style.display = 'none';
            }

            saveSettings();
        }

        // 설정 저장
        async function saveSettings() {
            const questionType = document.querySelector('input[name="questionType"]:checked').value;
            const messageType = document.querySelector('input[name="messageType"]:checked').value;
            const selectedMBTI = document.getElementById('mbtiSelect').value;

            const settings = {
                questionType: questionType,
                messageType: messageType,
                selectedMBTI: selectedMBTI
            };

            try {
                const response = await fetch('/api/settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(settings)
                });

                if (response.ok) {
                    console.log('설정이 저장되었습니다.');
                }
            } catch (error) {
                console.error('설정 저장 실패:', error);
                alert('설정 저장에 실패했습니다.');
            }
        }

        // 사용자 정의 질문 추가
        async function addCustomQuestion() {
            const input = document.getElementById('newQuestionInput');
            const question = input.value.trim();

            if (!question) {
                alert('질문을 입력해주세요!');
                return;
            }

            try {
                const response = await fetch('/api/questions/custom', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ question: question })
                });

                if (response.ok) {
                    input.value = '';
                    await loadCustomQuestions();
                    renderCustomQuestions();
                    alert('질문이 추가되었습니다! ✅');
                } else {
                    alert('질문 추가에 실패했습니다.');
                }
            } catch (error) {
                console.error('질문 추가 실패:', error);
                alert('질문 추가 중 오류가 발생했습니다.');
            }
        }

        // 사용자 정의 질문 삭제
        async function deleteCustomQuestion(index) {
            if (!confirm('이 질문을 삭제하시겠습니까?')) {
                return;
            }

            try {
                const response = await fetch(`/api/questions/custom/${index}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await loadCustomQuestions();
                    renderCustomQuestions();
                    alert('질문이 삭제되었습니다.');
                } else {
                    alert('질문 삭제에 실패했습니다.');
                }
            } catch (error) {
                console.error('질문 삭제 실패:', error);
                alert('질문 삭제 중 오류가 발생했습니다.');
            }
        }

        // 사용자 정의 질문 렌더링
        function renderCustomQuestions() {
            const listDiv = document.getElementById('customQuestionsList');

            if (customQuestions.length === 0) {
                listDiv.innerHTML = '<p class="empty-message">아직 추가된 질문이 없습니다.</p>';
                return;
            }

            listDiv.innerHTML = customQuestions.map((question, index) => `
                <div class="question-item">
                    <span class="question-text">${question}</span>
                    <button class="btn btn-delete" onclick="deleteCustomQuestion(${index})">🗑️ 삭제</button>
                </div>
            `).join('');
        }