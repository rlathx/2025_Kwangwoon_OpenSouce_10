// entryForm.js - 질문/답변 폼 관리
import { getQuestions, getEntry, upsertEntry, deleteEntry } from "./storage.js";
import { renderMoodSelector } from "./moodSelector.js";

export function buildQuestionsUI(container, answersById) {
    container.innerHTML = "";
    const questions = getQuestions();

    questions.forEach(q => {
        const wrap = document.createElement("div");
        wrap.className = "question";

        const label = document.createElement("label");
        label.textContent = q.text;

        const ta = document.createElement("textarea");
        ta.name = `q_${q.id}`;
        ta.placeholder = "여기에 기록하세요...";
        ta.value = answersById[q.id] || "";

        wrap.appendChild(label);
        wrap.appendChild(ta);
        container.appendChild(wrap);
    });
}

export function collectAnswers(container) {
    const answers = [];
    const questions = getQuestions();

    questions.forEach(q => {
        const ta = container.querySelector(`textarea[name="q_${q.id}"]`);
        const text = (ta?.value || "").trim();
        answers.push({ questionId: q.id, text });
    });
    return answers;
}

export function mountEntryForm({
    formEl, questionsContainer, moodContainer,
    onSave, onDelete
}) {
    formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        onSave();
    });

    const clearBtn = document.getElementById("clearBtn");
    clearBtn.addEventListener("click", () => {
        onDelete();
    });

    return {
        render(dateStr) {
            const entry = getEntry(dateStr);
            const answersById = {};
            entry?.answers?.forEach(a => { answersById[a.questionId] = a.text; });

            buildQuestionsUI(questionsContainer, answersById);

            renderMoodSelector(moodContainer, entry?.mood || null, (mood) => {
                // 즉시 저장 느낌으로 반영을 원한다면 여기서 onSave 호출 가능.
                // 우선은 UI만 상태 갱신하고 저장은 명시적 제출에서 처리.
                moodContainer.dataset.moodType = mood.type;
                moodContainer.dataset.moodEmoji = mood.emoji;
                moodContainer.dataset.moodColor = mood.color;
            });
        },
        getPayload(dateStr) {
            const answers = collectAnswers(questionsContainer);
            const mood = {
                type: moodContainer.dataset.moodType || "",
                emoji: moodContainer.dataset.moodEmoji || "",
                color: moodContainer.dataset.moodColor || ""
            };
            return { date: dateStr, answers, mood };
        },
        save(dateStr) {
            const payload = this.getPayload(dateStr);
            upsertEntry(payload);
        },
        remove(dateStr) {
            deleteEntry(dateStr);
        }
    };
}
