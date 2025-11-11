        let view = new Date();                         // 수정 : 상태 변수 구조 변경 (기존 currentYear/currentMonth → Date 객체 기반 view로 단순화)
        let viewYear = view.getFullYear();             // 수정 : currentYear 대신 viewYear 사용
        let viewMonth = view.getMonth();               // 수정 : currentMonth 대신 viewMonth 사용
        let allDiaries = {};

        // 날짜 선택
        let selectedDate = null; // 현재 선택된 날짜 (YYYY-MM-DD)

        function updateSelection() {
            // 기존 선택 제거
            document.querySelectorAll('#calendarGrid .cell.selected')
                .forEach(c => c.classList.remove('selected'));

            const grid = document.getElementById('calendarGrid');
            const todayIso = new Date().toISOString().slice(0, 10);

            // 오늘이 아닌 다른 날짜 선택했을때 강조 바꾸기
            if (selectedDate && selectedDate !== todayIso) {
                grid.classList.add('suppress-today');
            } else {
                grid.classList.remove('suppress-today');
            }

            // 현재 선택 반영
            if (!selectedDate) return;
            const cell = document.querySelector(`#calendarGrid .cell[data-date="${selectedDate}"]`);
            if (cell) cell.classList.add('selected');
            }


        // 브라우저가 DOM을 다 읽은 뒤 실행 
        window.addEventListener('DOMContentLoaded', async () => {   
            
            // 오늘을 기본 선택으로
            const t = new Date();
            const mm = String(t.getMonth() + 1).padStart(2, '0');
            const dd = String(t.getDate()).padStart(2, '0');
            selectedDate = `${t.getFullYear()}-${mm}-${dd}`;

            await loadAndApplySettings();
            await loadTodayMessage();
            await loadAllDiaries();

            renderCalendar();                                  
            // 초기화 시 서버 호출 제거, 바로 달력 렌더만 수행
            
            // 이전달
            document.getElementById('btnPrev').addEventListener('click', () => {
                if (viewMonth === 0) { viewMonth = 11; viewYear--; }
                else viewMonth--;
                renderCalendar();
            });

            // 다음달
            document.getElementById('btnNext').addEventListener('click', () => {
                if (viewMonth === 11) { viewMonth = 0; viewYear++; }
                else viewMonth++;
                renderCalendar();
            });                                               

            // 오늘 버튼
            document.getElementById('btnToday').addEventListener('click', () => {
                const t = new Date();
                viewYear = t.getFullYear();
                viewMonth = t.getMonth();

                const mm = String(t.getMonth() + 1).padStart(2, '0');
                const dd = String(t.getDate()).padStart(2, '0');
                selectedDate = `${t.getFullYear()}-${mm}-${dd}`;

                renderCalendar();
            });                                               
        });

        async function loadAndApplySettings() {
            try {
                const response = await fetch('/api/settings'); //
                if (!response.ok) {
                    throw new Error('Failed to fetch settings');
                }
                const settings = await response.json();
    
                // server.js의 응답 키(selectedMBTI) 사용
                const mbti = settings.selectedMBTI; 
                const badge = document.getElementById('mbtiBadge'); //

                if (mbti && mbti !== '') {
                    badge.textContent = `MBTI: ${mbti}`;
                } else {
                    badge.textContent = 'MBTI: 미설정';
                }
            } catch (error) {
                console.error('MBTI 설정 로드 실패:', error);
            }
        }
        // 오늘의 한마디
        async function loadTodayMessage(){
            const quoteElement = document.querySelector('.quote-text');

            if (!quoteElement) {
                console.warn('quote-text 요소를 찾을 수 없습니다.');
                return;
            }

            try {
                const response = await fetch('/api/today-message');
        
                if (!response.ok) {
                    throw new Error('Failed to fetch today message');
                }
        
                const data = await response.json();
                const message = data.message || '오늘도 좋은 하루 되세요!';
        
                // 메시지 업데이트
                quoteElement.textContent = message;
        
            } catch (error) {
                console.error('오늘의 한마디 로드 실패:', error);
                quoteElement.textContent = '하루하루를 소중히 여기세요. 오늘이 바로 어제의 당신이 기다리던 내일입니다.';
            }
        }
        // 일기 로드
        async function loadAllDiaries() {
            try {
                const response = await fetch('/api/diaries'); //
                allDiaries = await response.json();
            } catch (error) {
                console.error('전체 일기 로드 실패:', error);
                allDiaries = {};
            }
        }

        // ====== 유틸 ======
        function toISO(y, m, d) {                              
            const mm = String(m).padStart(2, '0');
            const dd = String(d).padStart(2, '0');
            return `${y}-${mm}-${dd}`;
        }

        // ====== 렌더링 ======
        function renderCalendar() {                             
            const grid = document.getElementById('calendarGrid');
            const title = document.getElementById('monthTitle'); 

            // 제목 업데이트
            title.textContent = `${viewYear}년 ${viewMonth + 1}월`;

            // 초기화
            grid.innerHTML = '';

            // 달력 정보 계산
            const first = new Date(viewYear, viewMonth, 1);
            const last = new Date(viewYear, viewMonth + 1, 0);
            const firstDay = first.getDay();
            const daysInMonth = last.getDate();

            // 이전달 여백 채우기
            for (let i = 0; i < firstDay; i++) {
                const div = document.createElement('div');
                div.className = 'cell muted';                  
                grid.appendChild(div);
            }

            // 날짜 채우기
            const todayIso = new Date().toISOString().slice(0, 10); 
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = toISO(viewYear, viewMonth + 1, d);  
                const cell = document.createElement('div');
                cell.className = 'cell';                           
                cell.setAttribute('data-date', dateStr);

                const num = document.createElement('div');
                num.className = 'date-num';                        
                num.textContent = String(d);
                cell.appendChild(num);

                // 오늘 칸 강조 
                if (dateStr === todayIso) {                         
                    cell.classList.add('today');                   
                }

                // 기분 이모지 불러오기 
                const diaryEntry = allDiaries[dateStr];
                if (diaryEntry && diaryEntry.mood) {
                    const emo = diaryEntry.mood;
                    const badge = document.createElement('span');
                    badge.className = 'mood-emoji';
                    badge.textContent = emo;
                    cell.appendChild(badge);
                    cell.classList.add('has-emoji');
                }

                // 더블클릭 시 diary.html 이동
                attachHandlers(cell, dateStr);                  

                grid.appendChild(cell);    
            }

            // 다음달 빈칸 채우기
            const totalCells = firstDay + daysInMonth;
            const tail = (7 - (totalCells % 7)) % 7;
            for (let i = 0; i < tail; i++) {
                const div = document.createElement('div');
                div.className = 'cell muted';                     
                grid.appendChild(div);
            }

            updateSelection();
        }

        // 단일 클릭=선택 / 더블클릭=이동
        function attachHandlers(cell, dateStr) {
            cell.addEventListener('click', () => {
                selectedDate = dateStr;
                updateSelection();
            });
            cell.addEventListener('dblclick', () => {
                window.location.href = `/diary?date=${dateStr}`;
            });
        }