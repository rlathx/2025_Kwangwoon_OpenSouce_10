const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(express.json());
app.use(express.static('public'));

// 데이터 디렉토리 생성
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    console.log('📁 data 폴더 생성 중...');
    fs.mkdirSync(dataDir);
}

// 기본 질문 데이터
const defaultQuestions = {
    default: [
        "오늘 가장 감사했던 일은 무엇인가요?",
        "오늘 나를 웃게 만든 순간은?",
        "오늘 배운 것이 있다면 무엇인가요?",
        "오늘 가장 기억에 남는 순간은?",
        "내일 하고 싶은 일은 무엇인가요?",
        "오늘 누구와 함께 시간을 보냈나요?",
        "오늘 나에게 했던 다짐은 무엇이었나요?",
        "오늘 가장 맛있었던 음식은?",
        "오늘 나를 힘들게 했던 일은 무엇이었나요?",
        "오늘 하루를 한 단어로 표현한다면?"
    ],
    mbti: {
        ISTJ: ["오늘 계획한 일을 모두 완수했나요?", "오늘 규칙을 지키기 위해 노력한 순간은?"],
        ISFJ: ["오늘 누군가를 도와준 순간이 있나요?", "오늘 당신의 배려가 필요했던 순간은?"],
        INFJ: ["오늘 깊이 생각했던 주제는 무엇인가요?", "오늘 직관이 당신에게 알려준 것은?"],
        INTJ: ["오늘 세운 전략이 잘 작동했나요?", "오늘 개선하고 싶은 시스템은?"],
        ISTP: ["오늘 새롭게 시도해본 것은?", "오늘 문제를 해결한 방법은?"],
        ISFP: ["오늘 아름답다고 느낀 순간은?", "오늘 당신의 가치관대로 행동한 순간은?"],
        INFP: ["오늘 당신의 이상에 가까워진 순간은?", "오늘 진정성을 느낀 순간은?"],
        INTP: ["오늘 가장 흥미로웠던 생각은?", "오늘 분석하고 싶은 주제는?"],
        ESTP: ["오늘 가장 짜릿했던 순간은?", "오늘 즉흥적으로 결정한 일은?"],
        ESFP: ["오늘 가장 즐거웠던 순간은?", "오늘 누구와 함께 웃었나요?"],
        ENFP: ["오늘 떠오른 새로운 아이디어는?", "오늘 열정을 느낀 순간은?"],
        ENTP: ["오늘 도전한 새로운 것은?", "오늘 토론하고 싶은 주제는?"],
        ESTJ: ["오늘 효율적으로 처리한 일은?", "오늘 리더십을 발휘한 순간은?"],
        ESFJ: ["오늘 사람들과 어떤 시간을 보냈나요?", "오늘 누군가와 소통한 순간은?"],
        ENFJ: ["오늘 누군가에게 영감을 준 순간은?", "오늘 사람들과 연결된 느낌이 들었나요?"],
        ENTJ: ["오늘 달성한 목표는 무엇인가요?", "오늘 이끌어낸 성과는?"]
    },
    custom: []
};

// 기본 설정 데이터
const defaultSettings = {
    questionType: "default",
    selectedMBTI: "INFP",
    messageType: "mbti",
    mbtiMessages: {
        ISTJ: "오늘도 꾸준히 계획을 실행한 당신, 정말 멋져요! 내일도 차근차근 나아가세요.",
        ISFJ: "당신의 따뜻한 마음이 누군가에게 큰 힘이 되었을 거예요. 오늘도 수고했어요!",
        INFJ: "깊이 생각하고 통찰한 하루였나요? 당신의 생각은 언제나 소중해요.",
        INTJ: "오늘도 목표를 향해 한 걸음 나아갔군요. 당신의 전략적 사고가 빛났어요!",
        ISTP: "새로운 것을 시도해본 하루였나요? 당신의 실용적인 면이 멋져요!",
        ISFP: "오늘도 당신만의 방식으로 아름다운 하루를 만들었네요. 잘했어요!",
        INFP: "이상을 향해 걸어간 하루, 당신의 진실함이 빛나는 하루였어요.",
        INTP: "흥미로운 생각들로 가득했던 하루였나요? 당신의 호기심이 매력적이에요!",
        ESTP: "활기차게 보낸 하루! 당신의 에너지가 주변을 밝게 만들었어요.",
        ESFP: "즐거운 순간들로 가득한 하루였기를! 당신의 긍정 에너지 최고예요!",
        ENFP: "열정적으로 보낸 하루! 당신의 창의성과 에너지가 빛났어요.",
        ENTP: "새로운 아이디어와 도전으로 가득한 하루였나요? 당신의 창의력에 박수를!",
        ESTJ: "오늘도 효율적으로 일을 처리했군요! 당신의 리더십이 빛났어요.",
        ESFJ: "다른 사람들과 좋은 시간을 보냈나요? 당신의 배려심이 아름다워요!",
        ENFJ: "누군가에게 영감을 준 하루였을 거예요. 당신의 카리스마가 빛났어요!",
        ENTJ: "목표를 향해 힘차게 나아간 하루! 당신의 추진력이 대단해요!"
    },
    quotes: [
        "하루하루를 소중히 여기세요. 오늘이 바로 어제의 당신이 기다리던 내일입니다.",
        "작은 발걸음도 계속 걸으면 멀리 갈 수 있습니다.",
        "당신의 이야기는 쓸 가치가 있습니다.",
        "완벽하지 않아도 괜찮아요. 오늘의 당신이 최선입니다.",
        "기록된 순간들이 모여 당신의 역사가 됩니다."
    ]
};

// 파일 읽기/쓰기 헬퍼 함수 (에러 처리 강화)
const readData = (filename, defaultData) => {
    const filepath = path.join(dataDir, filename);
    try {
        if (!fs.existsSync(filepath)) {
            console.log(`📝 ${filename} 파일이 없어서 생성합니다...`);
            fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        const content = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`❌ ${filename} 읽기 오류:`, error.message);
        // 파일이 손상된 경우 기본값으로 재생성
        console.log(`🔧 ${filename} 파일을 기본값으로 재생성합니다...`);
        fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
};

const writeData = (filename, data) => {
    const filepath = path.join(dataDir, filename);
    try {
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`❌ ${filename} 쓰기 오류:`, error.message);
        return false;
    }
};

// API 엔드포인트

// 일기 관련
app.get('/api/diaries', (req, res) => {
    try {
        const diaries = readData('diaries.json', {});
        res.json(diaries);
    } catch (error) {
        console.error('일기 목록 로드 오류:', error);
        res.status(500).json({ error: 'Failed to load diaries' });
    }
});

app.get('/api/diaries/:date', (req, res) => {
    try {
        const diaries = readData('diaries.json', {});
        const diary = diaries[req.params.date];
        if (diary) {
            res.json(diary);
        } else {
            res.status(404).json({ error: 'Diary not found' });
        }
    } catch (error) {
        console.error('일기 로드 오류:', error);
        res.status(500).json({ error: 'Failed to load diary' });
    }
});

app.post('/api/diaries', (req, res) => {
    try {
        const diaries = readData('diaries.json', {});
        const { date, content, mood, weather, question, message } = req.body;

        diaries[date] = {
            content,
            mood,
            weather,
            question,
            message,
            timestamp: new Date().toISOString()
        };

        if (writeData('diaries.json', diaries)) {
            res.json({ success: true, date });
        } else {
            res.status(500).json({ error: 'Failed to save diary' });
        }
    } catch (error) {
        console.error('일기 저장 오류:', error);
        res.status(500).json({ error: 'Failed to save diary' });
    }
});

// 질문 관련
app.get('/api/questions', (req, res) => {
    try {
        const questions = readData('questions.json', defaultQuestions);
        res.json(questions);
    } catch (error) {
        console.error('질문 로드 오류:', error);
        res.status(500).json({ error: 'Failed to load questions' });
    }
});

app.post('/api/questions/custom', (req, res) => {
    try {
        const questions = readData('questions.json', defaultQuestions);
        const { question } = req.body;

        if (!questions.custom) {
            questions.custom = [];
        }

        questions.custom.push(question);
        
        if (writeData('questions.json', questions)) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to save question' });
        }
    } catch (error) {
        console.error('질문 추가 오류:', error);
        res.status(500).json({ error: 'Failed to add question' });
    }
});

app.delete('/api/questions/custom/:index', (req, res) => {
    try {
        const questions = readData('questions.json', defaultQuestions);
        const index = parseInt(req.params.index);

        if (questions.custom && index >= 0 && index < questions.custom.length) {
            questions.custom.splice(index, 1);
            
            if (writeData('questions.json', questions)) {
                res.json({ success: true });
            } else {
                res.status(500).json({ error: 'Failed to delete question' });
            }
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (error) {
        console.error('질문 삭제 오류:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// 설정 관련
app.get('/api/settings', (req, res) => {
    try {
        const settings = readData('settings.json', defaultSettings);
        res.json(settings);
    } catch (error) {
        console.error('설정 로드 오류:', error);
        res.status(500).json({ error: 'Failed to load settings' });
    }
});

app.put('/api/settings', (req, res) => {
    try {
        const currentSettings = readData('settings.json', defaultSettings);
        const updatedSettings = { ...currentSettings, ...req.body };
        
        if (writeData('settings.json', updatedSettings)) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to save settings' });
        }
    } catch (error) {
        console.error('설정 저장 오류:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// 오늘의 질문 가져오기
app.get('/api/today-question', (req, res) => {
    try {
        const questions = readData('questions.json', defaultQuestions);
        const settings = readData('settings.json', defaultSettings);

        let questionList = [];

        if (settings.questionType === 'default') {
            questionList = questions.default || [];
        } else if (settings.questionType === 'mbti') {
            const mbtiQuestions = questions.mbti?.[settings.selectedMBTI];
            questionList = Array.isArray(mbtiQuestions) ? mbtiQuestions : [];
        } else if (settings.questionType === 'custom') {
            questionList = Array.isArray(questions.custom) ? questions.custom : [];
        }

        // 폴백
        if (!Array.isArray(questionList) || questionList.length === 0) {
            questionList = Array.isArray(questions.default) ? questions.default : ["오늘 하루를 한 문장으로 남겨볼까요?"];
        }

        const randomQuestion = questionList[Math.floor(Math.random() * questionList.length)];
        res.json({ question: randomQuestion });
    } catch (error) {
        console.error('❌ 오늘의 질문 로드 오류:', error);
        res.status(500).json({ 
            error: 'Failed to load question',
            question: '오늘 하루를 한 문장으로 남겨볼까요?' 
        });
    }
});

// 오늘의 한 마디 가져오기
app.get('/api/today-message', (req, res) => {
    try {
        const settings = readData('settings.json', defaultSettings);

        let message = '';

        if (settings.messageType === 'mbti') {
            message = settings.mbtiMessages?.[settings.selectedMBTI] || '';
        } else if (settings.messageType === 'quote') {
            const quotes = settings.quotes || [];
            if (quotes.length > 0) {
                message = quotes[Math.floor(Math.random() * quotes.length)];
            }
        }

        res.json({ message, type: settings.messageType, mbti: settings.selectedMBTI });
    } catch (error) {
        console.error('메시지 로드 오류:', error);
        res.status(500).json({ 
            error: 'Failed to load message',
            message: '오늘도 좋은 하루 되세요!' 
        });
    }
});

// 루트 경로 리다이렉트
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// 확장자 없는 라우팅
app.get('/diary', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'diary.html'));
});

app.get('/setting', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'setting.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`✨ 테마 일기 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`📁 데이터 디렉토리: ${dataDir}`);
});