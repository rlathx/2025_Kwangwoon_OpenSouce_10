# 기억 아카이브 (Memory Archive)

> 바닐라 HTML/CSS/JS + Node.js(확장 대비) 구조. MVP는 정적 배포만으로 동작.

## 폴더 구조
memory-archive/
├─ frontend/ # MVP 클라이언트(바닐라 JS)
│ ├─ index.html
│ ├─ css/
│ └─ js/
├─ backend/ # 확장용(Express/SQLite), 초기엔 비어있어도 무방
├─ docs/ # 설계 문서
└─ vercel.json # 정적 배포 설정(MVP)


## 현재 범위 (MVP)
- 고정 1~2문항 답변 저장
- 달력 UI(감정 표시)
- JSON 내보내기/가져오기
- 로그인 없음(비로그인 LocalStorage)

## 배포
- **Vercel**에서 `frontend`를 루트로 정적 배포하거나, 루트에서 `vercel.json`을 사용해 `frontend`를 공개 디렉터리로 지정.
