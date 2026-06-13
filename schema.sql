-- D1 Database Schema for VS Shorts Automation

DROP TABLE IF EXISTS hot_issues;

CREATE TABLE hot_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PUBLISHED, FAILED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 상태 기반 조회를 최적화하기 위한 인덱스
CREATE INDEX idx_hot_issues_status ON hot_issues(status);
