// 실제 운영 환경 백엔드(Worker) URL로 변경 완료
const API_BASE_URL = "https://vs-shorts-automation.khcho0421.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
    fetchIssues();
});

async function fetchIssues() {
    const tableBody = document.getElementById("issuesBody");
    const loading = document.getElementById("loadingIndicator");
    const tableContainer = document.querySelector(".table-container");

    try {
        const response = await fetch(`${API_BASE_URL}/api/issues`);
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const issues = await response.json();
        
        loading.classList.add("hidden");
        tableContainer.classList.remove("hidden");
        
        if (issues.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No hot issues found. Wait for the background cron job to gather data.</td></tr>`;
            return;
        }

        tableBody.innerHTML = issues.map(issue => `
            <tr>
                <td style="color: var(--text-secondary); font-size: 0.9em;">${issue.analyze_date}</td>
                <td><span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">${issue.category}</span></td>
                <td><strong style="color: #60a5fa;">${issue.keyword_a}</strong> <span style="font-size: 0.8em; color: var(--text-secondary);">vs</span> <strong style="color: #f87171;">${issue.keyword_b}</strong></td>
                <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500;" title="${issue.title}">
                    ${issue.title}
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 50px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${issue.controversy_score}%; height: 100%; background: ${issue.controversy_score >= 80 ? 'var(--status-failed)' : 'var(--status-pending)'};"></div>
                        </div>
                        <span style="font-size: 0.85em;">${issue.controversy_score}</span>
                    </div>
                </td>
                <td><span class="status-badge status-${issue.status}">${issue.status}</span></td>
                <td>
                    <button 
                        class="btn-publish" 
                        onclick="publishIssue(${issue.id}, this)"
                        ${issue.status !== 'PENDING' ? 'disabled' : ''}
                    >
                        ${issue.status === 'PUBLISHED' ? 'Published' : (issue.status === 'FAILED' ? 'Failed' : 'Publish')}
                    </button>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Error:", error);
        loading.innerHTML = `<p style="color: var(--status-failed)">Error loading data. Please check if the Worker backend is running.</p>`;
    }
}

window.publishIssue = async function(issueId, btnElement) {
    // 낙관적 UI 업데이트
    const originalText = btnElement.innerText;
    btnElement.disabled = true;
    btnElement.innerText = "Processing...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/publish`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ issueId })
        });

        if (!response.ok) throw new Error("Failed to start publishing");

        alert("발행 작업이 성공적으로 시작되었습니다! 백그라운드에서 영상 렌더링 및 업로드가 진행됩니다.");
        
        // 2초 후 상태 업데이트를 위해 목록 리로드
        setTimeout(fetchIssues, 2000);

    } catch (error) {
        console.error("Error:", error);
        alert("발행 작업을 시작하는 중 오류가 발생했습니다.");
        btnElement.disabled = false;
        btnElement.innerText = originalText;
    }
}
