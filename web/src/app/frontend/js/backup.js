// backup.js - JSON 내보내기/가져오기
import { exportJson, importJson } from "./storage.js";

export function mountBackup(exportBtn, importInput, onImported) {
    exportBtn.addEventListener("click", () => {
        const text = exportJson();
        const blob = new Blob([text], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const now = new Date();
        const stamp = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
        a.href = url;
        a.download = `memory-archive-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });

    importInput.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await importJson(file);
            onImported?.();
            alert("가져오기가 완료되었습니다.");
        } catch (err) {
            alert("가져오기에 실패했습니다: " + err.message);
        } finally {
            importInput.value = "";
        }
    });
}
