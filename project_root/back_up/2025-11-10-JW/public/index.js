        // ====== 상태 ======
        let view = new Date();                         // 수정 : 상태 변수 구조 변경 (기존 currentYear/currentMonth → Date 객체 기반 view로 단순화)
        let viewYear = view.getFullYear();             // 수정 : currentYear 대신 viewYear 사용
        let viewMonth = view.getMonth();               // 수정 : currentMonth 대신 viewMonth 사용
        // 수정 : diariesData(서버 데이터) 사용 제거 → 로컬스토리지 기반으로 전환

        // 추가: 날짜 선택
        let selectedDate = null; // 현재 강조(선택)된 날짜 (YYYY-MM-DD)

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


        // 브라우저가 DOM을 다 읽은 뒤 실행 (window.onload → DOMContentLoaded)
        window.addEventListener('DOMContentLoaded', () => {   // 수정 : window.onload(이미지/리소스까지 대기) → DOMContentLoaded(구조만 준비되면 실행)로 변경
            
            //추가 : 오늘을 기본 선택으로
            const t = new Date();
            const mm = String(t.getMonth() + 1).padStart(2, '0');
            const dd = String(t.getDate()).padStart(2, '0');
            selectedDate = `${t.getFullYear()}-${mm}-${dd}`;

            renderCalendar();                                  
            // 수정 : 초기화 시 서버 호출(loadTodayMessage/loadDiaries) 제거, 바로 달력 렌더만 수행
            
            // 이전달
            document.getElementById('btnPrev').addEventListener('click', () => {
                if (viewMonth === 0) { viewMonth = 11; viewYear--; }
                else viewMonth--;
                renderCalendar();
            });                                               
            // 수정 : changeMonth(delta) 함수 사용 제거, 버튼 리스너에서 직접 월/년 갱신

            // 다음달
            document.getElementById('btnNext').addEventListener('click', () => {
                if (viewMonth === 11) { viewMonth = 0; viewYear++; }
                else viewMonth++;
                renderCalendar();
            });                                               // 수정 : 동일하게 changeMonth 제거 로직

            // 오늘 버튼
            document.getElementById('btnToday').addEventListener('click', () => {
                const t = new Date();
                viewYear = t.getFullYear();
                viewMonth = t.getMonth();

                const mm = String(t.getMonth() + 1).padStart(2, '0');
                const dd = String(t.getDate()).padStart(2, '0');
                selectedDate = `${t.getFullYear()}-${mm}-${dd}`;

                renderCalendar();
            });                                               // 수정 : 오늘 이동 로직 단순화 (별도 전역 today 상태 없이 즉시 계산)
        });

        // ====== 유틸 ======
        function toISO(y, m, d) {                              // 수정 : 날짜 포맷 유틸 신규 추가 (YYYY-MM-DD 고정 포맷)
            const mm = String(m).padStart(2, '0');
            const dd = String(d).padStart(2, '0');
            return `${y}-${mm}-${dd}`;
        }

        // ====== 렌더링 ======
        function renderCalendar() {                             // 수정 : 핵심 렌더 함수 재구성 (서버 데이터/모달 의존 제거)
            const grid = document.getElementById('calendarGrid');
            const title = document.getElementById('monthTitle'); // 수정 : 제목 요소 id 변경 (currentMonth → monthTitle)

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
                div.className = 'cell muted';                   // 수정 : 빈칸 클래스 변경 (empty → cell muted)
                grid.appendChild(div);
            }

            // 날짜 채우기
            const todayIso = new Date().toISOString().slice(0, 10); // 수정 : 오늘 비교값 생성 방식 변경 (Date 조립 → ISO 슬라이스)
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = toISO(viewYear, viewMonth + 1, d);  // 수정 : 날짜 키 생성 방식 변경 (문자열 조합 → toISO 유틸)
                const cell = document.createElement('div');
                cell.className = 'cell';                            // 수정 : 셀 클래스 네이밍 변경 (calendar-day → cell)
                cell.setAttribute('data-date', dateStr);

                const num = document.createElement('div');
                num.className = 'date-num';                         // 수정 : 숫자 클래스 변경 (date-number → date-num)
                num.textContent = String(d);
                cell.appendChild(num);

                // 오늘 칸 강조 
                if (dateStr === todayIso) {                         // 수정 : today 판별 로직 유지하되
                    cell.classList.add('today');                    // 수정 : 인라인 배경/색상 지정 → CSS 클래스 today로 일원화
                }

                // 기분 이모지 불러오기
                const emo = localStorage.getItem(`ma_mood_${dateStr}`); // 수정 : 서버 diariesData 대신 localStorage 키(ma_mood_YYYY-MM-DD)에서 이모지 로드
                if (emo) {
                    const badge = document.createElement('span');
                    badge.className = 'mood-emoji';                 // 수정 : 이모지 뱃지 클래스 유지(렌더 구조만 단순화)
                    badge.textContent = emo;
                    cell.appendChild(badge);
                    cell.classList.add('has-emoji');                // 수정 : 이모지 있을 때 여백/레이아웃 보정용 클래스 추가
                }

                // 더블클릭 시 diary.html 이동
                attachHandlers(cell, dateStr);                   // 수정 : 단일 클릭 모달(viewDiary) → 더블클릭 페이지 이동(diary.html?date=...)로 UX 변경

                grid.appendChild(cell);    
            }

            // 다음달 빈칸 채우기
            const totalCells = firstDay + daysInMonth;
            const tail = (7 - (totalCells % 7)) % 7;
            for (let i = 0; i < tail; i++) {
                const div = document.createElement('div');
                div.className = 'cell muted';                       // 수정 : 동일하게 빈칸 클래스(cell muted) 사용
                grid.appendChild(div);
            }

            updateSelection();
        }

        // 수정 : 단일 클릭=선택 / 더블클릭=이동
        function attachHandlers(cell, dateStr) {
            cell.addEventListener('click', () => {
                selectedDate = dateStr;
                updateSelection();
            });
            cell.addEventListener('dblclick', () => {
                window.location.href = `diary.html?date=${dateStr}`;
             });
            }


        // -------------------------------
        // 참고 : 아래 기능들은 제거/대체됨
        // - loadTodayMessage() / loadDiaries() : 서버 API(fetch) 의존 제거
        // - diariesData / getWeatherColor() / getWeatherEmoji() : 날씨색/이모지 표시 제거
        // - viewDiary(), closeModal(), window.onclick : 모달 기반 뷰 제거
        // - changeMonth(delta) : 월 변경 헬퍼 제거, 버튼 리스너에서 직접 처리
        // - 요일 헤더 생성 : JS로 생성하던 부분 삭제(HTML에서 이미 주간 헤더를 렌더)
        // -------------------------------