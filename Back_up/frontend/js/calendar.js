// calendar.js - 달력 렌더링 및 날짜 선택
import { getEntry } from "./storage.js";
import { MOOD_PRESET } from "./moodSelector.js";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function moodToClass(moodType) {
    const found = MOOD_PRESET.find(m => m.type === moodType);
    if (!found) return "";
    return found.type; // CSS .dot.[type]
}

export function formatYearMonth(dt) {
    return `${dt.getFullYear()}년 ${String(dt.getMonth() + 1).padStart(2, "0")}월`;
}

export function getMonthMatrix(year, month) {
    // month: 0-11
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevDays = startDay; // 앞쪽 비우기 개수
    const totalCells = Math.ceil((prevDays + daysInMonth) / 7) * 7;

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
        const dateNum = i - prevDays + 1;
        const inMonth = dateNum >= 1 && dateNum <= daysInMonth;
        const date = inMonth ? new Date(year, month, dateNum) : null;
        cells.push({ inMonth, date });
    }
    return cells;
}

export function renderCalendar(gridEl, titleEl, currentYM, onSelectDate) {
    gridEl.innerHTML = "";

    // 요일 헤더
    WEEKDAYS.forEach(w => {
        const wEl = document.createElement("div");
        wEl.className = "calendar-weekday";
        wEl.textContent = w;
        gridEl.appendChild(wEl);
    });

    titleEl.textContent = formatYearMonth(currentYM);

    const matrix = getMonthMatrix(currentYM.getFullYear(), currentYM.getMonth());

    matrix.forEach(cell => {
        const cellEl = document.createElement("button");
        cellEl.type = "button";
        cellEl.className = "calendar-cell";
        if (!cell.inMonth) cellEl.classList.add("out");

        const dateLabel = document.createElement("span");
        dateLabel.className = "date";
        dateLabel.textContent = cell.inMonth ? cell.date.getDate() : "";
        cellEl.appendChild(dateLabel);

        // mood dot
        if (cell.inMonth) {
            const iso = cell.date.toISOString().slice(0, 10);
            const entry = getEntry(iso);
            if (entry?.mood?.type) {
                const moodDot = document.createElement("span");
                moodDot.className = "mood-dot";
                // apply class via type to map color legend (we use background via class)
                const moodCls = moodToClass(entry.mood.type);
                moodDot.style.background = entry.mood.color || "";
                moodDot.classList.add(moodCls);
                cellEl.appendChild(moodDot);
            }
            cellEl.addEventListener("click", () => onSelectDate(iso));
        }

        gridEl.appendChild(cellEl);
    });
}
