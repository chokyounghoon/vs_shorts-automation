-- D1 Database Schema for VS Shorts Automation V2

DROP TABLE IF EXISTS hot_issues;

CREATE TABLE hot_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analyze_date TEXT NOT NULL,          -- 분석 날짜 (YYYY-MM-DD)
    category TEXT NOT NULL,              -- 구분 (주식, 스포츠, 로컬맛집 등)
    layout_type TEXT DEFAULT 'VS',       -- 레이아웃 타입 ('VS' 또는 'LIST')
    keyword_a TEXT,                      -- VS 대상 A (예: 삼성전자)
    keyword_b TEXT,                      -- VS 대상 B (예: SK하이닉스)
    items_json TEXT,                     -- LIST용 데이터 (JSON 포맷)
    title TEXT NOT NULL,                 -- 영상 타이틀 후킹 문구
    controversy_score INTEGER DEFAULT 50,-- 논쟁 지수 (0 ~ 100)
    metric_a_value INTEGER DEFAULT 0,    -- A의 비교 수치
    metric_b_value INTEGER DEFAULT 0,    -- B의 비교 수치
    status TEXT DEFAULT 'PENDING',       -- 상태 (PENDING, COMPLETED, FAILED)
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_hot_issues_status ON hot_issues(status);

DROP TABLE IF EXISTS app_settings;
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

INSERT OR IGNORE INTO app_settings (key, value) VALUES ('schedule_time', '09:00');

-- YouTube OAuth Tokens
CREATE TABLE IF NOT EXISTS youtube_tokens (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- 단일 채널 연동이므로 id=1 하나만 사용
    refresh_token TEXT NOT NULL,
    updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

-- Instagram (Facebook) OAuth Tokens
CREATE TABLE IF NOT EXISTS instagram_tokens (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    access_token TEXT NOT NULL,
    ig_user_id TEXT,
    updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

-- Image Generation System Prompts
CREATE TABLE IF NOT EXISTS system_prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

INSERT OR IGNORE INTO system_prompts (id, name, prompt) VALUES 
(1, '시네마틱 3D 렌더링 (Cinematic 3D)', '당신은 세계 최고의 3D 아티스트입니다. 제공된 주식 뉴스나 핫이슈를 바탕으로, 언리얼 엔진 5와 픽사 스타일이 결합된 시네마틱 3D 렌더링 이미지를 생성하기 위한 미드저니/달리 프롬프트를 작성해주세요. 핵심 키워드 간의 대결 구도나 상징적인 요소를 극적인 조명(Volumetric lighting)과 화려한 질감으로 웅장하게 표현해야 합니다.'),
(2, '사이버펑크 데이터 시각화 (Cyberpunk)', '당신은 SF 컨셉 아티스트입니다. 제공된 경제 지표나 뉴스를 바탕으로 사이버펑크 스타일의 데이터 시각화 이미지를 생성하기 위한 프롬프트를 작성해주세요. 네온 빛, 홀로그램, 데이터 노드, 짙은 어둠 속에서 빛나는 하이테크 요소를 활용하여 주식 시장의 흐름과 트렌드를 미래지향적으로 표현하세요.'),
(3, '팝아트 코믹북 스타일 (Pop-Art Comic)', '당신은 팝아트 일러스트레이터입니다. 뉴스의 핵심 갈등이나 대결 구도를 미국 히어로 코믹스 스타일의 팝아트 이미지로 생성하기 위한 프롬프트를 작성해주세요. 강렬한 원색, 하프톤 도트(Halftone dots), 굵은 아웃라인, 그리고 역동적인 구도를 사용하여 주식 시장의 격동을 흥미진진하게 묘사하세요.'),
(4, '미니멀리스트 코퍼레이트 (Minimalist)', '당신은 모던 그래픽 디자이너입니다. 제공된 뉴스의 핵심 은유를 미니멀리스트 벡터 일러스트 스타일로 생성하기 위한 프롬프트를 작성해주세요. 깔끔한 선, 플랫한 단색 배경, 제한된 세련된 색상 팔레트(Corporate memphis 스타일)를 사용하여 복잡한 뉴스를 전문적이고 심플하게 시각화하세요.');

-- Stock and Market Data
CREATE TABLE IF NOT EXISTS stock_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,          -- 'NEWS_US', 'NEWS_KR', 'KOSPI', 'KOSDAQ', 'ETF'
    title TEXT NOT NULL,             -- 종목명 또는 뉴스 제목
    value TEXT,                      -- 현재가 또는 빈칸
    change_rate TEXT,                -- 등락률 또는 빈칸
    theme TEXT,                      -- 테마
    us_stock TEXT,                   -- 연관 미국주식
    fetch_date TEXT DEFAULT (date('now', 'localtime')),
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_stock_data_category ON stock_data(category);
CREATE INDEX IF NOT EXISTS idx_stock_data_fetch_date ON stock_data(fetch_date);
