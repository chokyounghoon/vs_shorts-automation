-- D1 Database Schema for VS Shorts Automation V2

DROP TABLE IF EXISTS hot_issues;

CREATE TABLE hot_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analyze_date TEXT NOT NULL,          -- 분석 날짜 (YYYY-MM-DD)
    category TEXT NOT NULL,              -- 구분 (주식, 스포츠, 로컬맛집 등)
    keyword_a TEXT NOT NULL,             -- VS 대상 A (예: 삼성전자)
    keyword_b TEXT NOT NULL,             -- VS 대상 B (예: SK하이닉스)
    title TEXT NOT NULL,                 -- 영상 타이틀 후킹 문구
    controversy_score INTEGER DEFAULT 50,-- 논쟁 지수 (0 ~ 100) (기존 데이터 호환성 위해 유지)
    metric_a_value INTEGER DEFAULT 0,    -- A의 비교 수치 (예: 검색량, 지지율 등)
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
