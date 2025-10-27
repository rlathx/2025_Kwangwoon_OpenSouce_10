// main.js - 앱 초기화/연결
import { renderCalendar, formatYearMonth } from "./calendar.js";
import { loadData, getEntry } from "./storage.js";
import { mountEntryForm } from "./entryForm.js";
import { mountBackup } from "./backup.js";

const state = {
    currentYM: new Date(), // 현재 표시 월
    selectedDate: null     // "YYYY-MM-DD"
};

function firstDayThisMonth() {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
}

function toISODate(date) {
    return date.toISOString().slice(0, 10);
}

function setSelectedDate(isoStr) {
    state.selectedDate = isoStr;
    document.getElementById("selectedDateLabel").textContent = isoStr || "날짜 선택";
}

function goMonth(delta) {
    const d = state.currentYM;
    const next = new Date(d.getFullYear(), d.getMonth() + delta, 1);
    state.currentYM = next;
    drawCalendar();
}

function drawCalendar() {
    const grid = document.getElementById("calendarGrid");
    const title = document.getElementById("calendarTitle");
    renderCalendar(grid, title, state.currentYM, (iso) => {
        setSelectedDate(iso);
        formController.render(iso);
    });
}

let formController;

document.addEventListener("DOMContentLoaded", () => {
    // 초기 월은 1일로 정규화
    state.currentYM = firstDayThisMonth();

    // 캘린더 렌더
    drawCalendar();

    // 월 이동
    document.getElementById("prevMonthBtn").addEventListener("click", () => goMonth(-1));
    document.getElementById("nextMonthBtn").addEventListener("click", () => goMonth(1));

    // 폼 마운트
    const formEl = document.getElementById("entryForm");
    const questionsContainer = document.getElementById("questionsContainer");
    const moodContainer = document.getElementById("moodSelector");

    formController = mountEntryForm({
        formEl,
        questionsContainer,
        moodContainer,
        onSave() {
            if (!state.selectedDate) {
                alert("먼저 달력에서 날짜를 선택하세요.");
                return;
            }
            formController.save(state.selectedDate);
            drawCalendar(); // mood 점 반영
            alert("저장되었습니다.");
        },
        onDelete() {
            if (!state.selectedDate) {
                alert("삭제할 날짜를 먼저 선택하세요.");
                return;
            }
            if (confirm(`${state.selectedDate}의 기록을 삭제할까요?`)) {
                formController.remove(state.selectedDate);
                drawCalendar();
                formController.render(state.selectedDate);
                alert("삭제되었습니다.");
            }
        }
    });

    // 백업/복원
    const exportBtn = document.getElementById("exportJsonBtn");
    const importInput = document.getElementById("importJsonInput");
    mountBackup(exportBtn, importInput, () => {
        // 데이터 구조 변경 후 UI 갱신
        if (state.selectedDate) {
            formController.render(state.selectedDate);
        }
        drawCalendar();
    });

    // 기본 선택: 오늘
    const today = toISODate(new Date());
    setSelectedDate(today);
    formController.render(today);
});
