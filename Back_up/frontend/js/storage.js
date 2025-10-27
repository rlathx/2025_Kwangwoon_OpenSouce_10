// storage.js - LocalStorage 기반 데이터 계층
const STORAGE_KEY = "memarc:data";
const SNAPSHOT_KEY = "memarc:snapshot";
const SCHEMA_VERSION = 1;

const DEFAULT_QUESTIONS = [
    { id: "q1", text: "오늘 어떤 감정을 느꼈어?" },
    { id: "q2", text: "지금 나에게 해주고 싶은 말은?" }
];

const defaultData = () => ({
    version: SCHEMA_VERSION,
    questions: DEFAULT_QUESTIONS,
    entries: [],
    settings: { mbti: "", palette: "default" }
});

export function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultData();
        const parsed = JSON.parse(raw);
        if (!parsed.version) parsed.version = 1; // 간단 마이그레이션 훅
        return parsed;
    } catch {
        return defaultData();
    }
}

export function saveData(data) {
    // 스냅샷(간단 롤백용)
    try {
        localStorage.setItem(SNAPSHOT_KEY, localStorage.getItem(STORAGE_KEY) || "");
    } catch { }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getQuestions() {
    return loadData().questions;
}

export function setQuestions(questions) {
    const data = loadData();
    data.questions = questions;
    saveData(data);
}

export function getEntry(dateStr) {
    const data = loadData();
    return data.entries.find((e) => e.date === dateStr) || null;
}

export function upsertEntry(entry) {
    const data = loadData();
    const idx = data.entries.findIndex((e) => e.date === entry.date);
    const now = new Date().toISOString();
    if (idx >= 0) {
        data.entries[idx] = { ...data.entries[idx], ...entry, updatedAt: now };
    } else {
        data.entries.push({ ...entry, updatedAt: now });
    }
    saveData(data);
}

export function deleteEntry(dateStr) {
    const data = loadData();
    data.entries = data.entries.filter((e) => e.date !== dateStr);
    saveData(data);
}

export function exportJson() {
    const data = loadData();
    return JSON.stringify(data, null, 2);
}

export async function importJson(file) {
    const text = await file.text();
    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error("JSON 형식이 아닙니다.");
    }
    if (!parsed.entries || !Array.isArray(parsed.entries)) {
        throw new Error("유효한 데이터 구조가 아닙니다.");
    }
    parsed.version = SCHEMA_VERSION;
    saveData(parsed);
}

export function getSettings() {
    return loadData().settings || {};
}

export function setSettings(next) {
    const data = loadData();
    data.settings = { ...(data.settings || {}), ...next };
    saveData(data);
}
