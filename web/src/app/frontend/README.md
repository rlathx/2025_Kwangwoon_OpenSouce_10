# 기억 아카이브 (Frontend)

바닐라 HTML/CSS/JS + ES Modules 기반 MVP.

## 실행
- 로컬: `frontend/index.html` 파일을 브라우저로 직접 열어도 작동합니다.
- 배포: Vercel/Netlify 정적 배포로 사용 가능합니다.

## 구조
- `css/` : 전체 스타일, 달력, 감정 셀렉터
- `js/`  : 모듈화
  - `storage.js` : LocalStorage CRUD
  - `calendar.js` : 달력 렌더링
  - `entryForm.js` : 질문/답변 폼 + 감정 연결
  - `moodSelector.js` : 감정 선택 UI
  - `backup.js` : JSON 내보내기/가져오기
  - `main.js` : 초기화/전체 연결

## 데이터
- LocalStorage 키: `memarc:data`
- 스키마 버전: `version: 1`
- 질문: 2문항(기본) — 확장 시 `storage.setQuestions()`로 업데이트

## 접근성
- 키보드 탐색, 명도 대비, 포커스 스타일 포함
