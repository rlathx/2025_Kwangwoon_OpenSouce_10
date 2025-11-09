        let currentQuestion = '';
        let currentMessage = '';

        // 페이지 로드 시 초기화
        window.onload = async () => {
            // 날짜 세팅 (URL ?date=YYYY-MM-DD 없으면 오늘)
            const params = new URLSearchParams(location.search);
            const dateStr = params.get('date') || getTodayDate();
            document.getElementById('dateText').textContent = dateStr;

            // 2) 질문 로드 + 일기/이모지 로드 (임시로 주석처리)
            //await loadTodayQuestion(dateStr);
            //await loadTodayDiary(dateStr); 

            // 3) 이모지(기분/날씨) 클릭 저장
            document.getElementById('moodList').addEventListener('click', (e) => {
                const emo = e.target.closest('.emoji-item')?.textContent;
                if (!emo) return;
                document.getElementById('moodNow').textContent = emo;
                localStorage.setItem(`ma_mood_${dateStr}`, emo);
            });
            document.getElementById('weatherList').addEventListener('click', (e) => {
                const emo = e.target.closest('.emoji-item')?.textContent;
                if (!emo) return;
                document.getElementById('weatherNow').textContent = emo;
                localStorage.setItem(`ma_weather_${dateStr}`, emo);
            });

            // 4) 저장 버튼: 로컬스토리지 저장 후 index로 이동
            document.getElementById('btnSave').addEventListener('click', () => saveDiary(dateStr));

            // 5) 뒤로가기 버튼
            document.getElementById('btnBack').addEventListener('click', (e) => {
                e.preventDefault();
                window.location.assign('index.html');
            });
            // 6) 기분/날씨 초기화 버튼 
            document.getElementById('btnResetMood').addEventListener('click', () => {
                document.getElementById('moodNow').textContent = '—';
                localStorage.removeItem(`ma_mood_${dateStr}`);
            });

            document.getElementById('btnResetWeather').addEventListener('click', () => {
                document.getElementById('weatherNow').textContent = '—';
                localStorage.removeItem(`ma_weather_${dateStr}`);
            });
        };


        // 오늘의 한 마디 로드
        async function loadTodayMessage() {
            try {
                const response = await fetch('/api/today-message');
                const data = await response.json();

                currentMessage = data.message;
                const messageBox = document.getElementById('todayMessage');

                if (data.type === 'mbti') {
                    messageBox.innerHTML = `
                        <h3>💬 ${data.mbti}의 한 마디</h3>
                        <p>${data.message}</p>
                    `;
                } else {
                    messageBox.innerHTML = `
                        <h3>💬 오늘의 명언</h3>
                        <p>${data.message}</p>
                    `;
                }
            } catch (error) {
                console.error('메시지 로드 실패:', error);
                document.getElementById('todayMessage').innerHTML =
                    '<p class="error">메시지를 불러올 수 없습니다.</p>';
            }
        }

        // 오늘의 질문 로드
        async function loadTodayQuestion() {
            try {
                const response = await fetch('/api/today-question');
                const data = await response.json();

                currentQuestion = data.question;
                const questionBox = document.getElementById('todayQuestion');
                questionBox.innerHTML = `
                    <h3>❓ 오늘의 질문</h3>
                    <p>${data.question}</p>
                `;
            } catch (error) {
                console.error('질문 로드 실패:', error);
                document.getElementById('todayQuestion').innerHTML =
                    '<p class="error">질문을 불러올 수 없습니다.</p>';
            }
        }

        // 오늘 날짜의 일기가 있는지 확인하고 로드
        async function loadTodayDiary() {
            const today = getTodayDate();
            try {
                const response = await fetch(`/api/diaries/${today}`);
                if (response.ok) {
                    const diary = await response.json();

                    // 기존 일기 내용 로드
                    document.getElementById('diaryContent').value = diary.content;
                    document.getElementById('moodSelect').value = diary.mood;
                    document.getElementById('weatherSelect').value = diary.weather;
                }
            } catch (error) {
                // 일기가 없으면 그냥 빈 상태로 시작
                console.log('오늘 작성된 일기가 없습니다.');
            }
        }

        // 일기 저장
        async function saveDiary() {
            const content = document.getElementById('diaryContent').value.trim();
            const mood = document.getElementById('moodSelect').value;
            const weather = document.getElementById('weatherSelect').value;

            if (!content) {
                alert('일기 내용을 입력해주세요!');
                return;
            }

            const today = getTodayDate();

            const diaryData = {
                date: today,
                content: content,
                mood: mood,
                weather: weather,
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
                    // 메인 페이지로 이동
                    window.location.href = 'index.html';
                } else {
                    alert('일기 저장에 실패했습니다. 다시 시도해주세요.');
                }
            } catch (error) {
                console.error('저장 오류:', error);
                alert('일기 저장 중 오류가 발생했습니다.');
            }
        }

        // 일기 초기화
        function clearDiary() {
            if (confirm('작성 중인 내용을 모두 지우시겠습니까?')) {
                document.getElementById('diaryContent').value = '';
                document.getElementById('moodSelect').selectedIndex = 0;
                document.getElementById('weatherSelect').selectedIndex = 0;
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