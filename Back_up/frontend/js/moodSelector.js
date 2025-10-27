// moodSelector.js - 감정 선택 UI
export const MOOD_PRESET = [
    { type: "joy", emoji: "😊", name: "기쁨", color: "#FFD54F" },
    { type: "calm", emoji: "😌", name: "차분", color: "#81D4FA" },
    { type: "neutral", emoji: "😐", name: "보통", color: "#B0BEC5" },
    { type: "sad", emoji: "😢", name: "슬픔", color: "#90A4AE" },
    { type: "angry", emoji: "😤", name: "화남", color: "#EF9A9A" }
];

export function renderMoodSelector(container, currentMood, onSelect) {
    container.innerHTML = "";
    MOOD_PRESET.forEach((m) => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "mood-pill";
        pill.setAttribute("aria-pressed", currentMood?.type === m.type ? "true" : "false");
        pill.dataset.selected = currentMood?.type === m.type ? "true" : "false";
        pill.title = m.name;

        const emoji = document.createElement("span");
        emoji.className = "mood-emoji";
        emoji.textContent = m.emoji;

        const name = document.createElement("span");
        name.className = "mood-name";
        name.textContent = m.name;

        pill.appendChild(emoji);
        pill.appendChild(name);

        pill.addEventListener("click", () => {
            onSelect({ type: m.type, emoji: m.emoji, color: m.color });
        });

        container.appendChild(pill);
    });
}
