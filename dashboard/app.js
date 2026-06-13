const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
    ? "http://localhost:8787" 
    : "https://vs-shorts-automation.khcho0421.workers.dev";

let issuesData = [];
let selectedIssue = null;

document.addEventListener("DOMContentLoaded", () => {
    loadIssues();
});

// Helper: Show/Hide Loading
function setLoading(show) {
    const el = document.getElementById('loadingIndicator');
    if (show) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

// 1. [가져오기] 버튼 1 로직
window.fetchNewIssues = async function() {
    const btn = document.getElementById('btnFetch');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> 가져오는 중...`;
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/fetch-issues`, { method: "POST" });
        if (!res.ok) throw new Error("Fetch failed");
        
        await loadIssues(); // 테이블 리로드
        
        alert("오늘의 핫이슈 VS 데이터를 성공적으로 가져왔습니다!");
    } catch (e) {
        alert("데이터를 가져오는 데 실패했습니다.");
        console.error(e);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// 테이블 데이터 로드
async function loadIssues() {
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE_URL}/api/issues`);
        if (!res.ok) throw new Error("Load failed");
        
        issuesData = await res.json();
        renderTable();
    } catch (e) {
        document.getElementById('tableBody').innerHTML = `<tr><td colspan="4" class="p-4 text-center text-red-400">데이터 로드 실패. API 연결을 확인하세요.</td></tr>`;
    } finally {
        setLoading(false);
    }
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    if (issuesData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-slate-500">생성된 데이터가 없습니다. 상단 버튼을 눌러 가져오세요.</td></tr>`;
        return;
    }

    tbody.innerHTML = issuesData.map(item => `
        <tr class="cursor-pointer hover:bg-slate-800/80 transition-colors ${selectedIssue?.id === item.id ? 'row-selected' : ''}" onclick="selectRow(${item.id})">
            <td class="p-4 text-slate-400">${item.analyze_date}</td>
            <td class="p-4"><span class="bg-white/10 px-2.5 py-1 rounded-md text-xs border border-white/5 shadow-sm">${item.category}</span></td>
            <td class="p-4 font-medium tracking-wide">
                <span class="text-blue-400">${item.keyword_a}</span>
                <span class="text-slate-600 text-[10px] mx-1.5 uppercase font-bold">vs</span>
                <span class="text-red-400">${item.keyword_b}</span>
            </td>
            <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm ${
                    item.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    item.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    item.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }">${item.status}</span>
            </td>
        </tr>
    `).join('');
}

// 행(Row) 클릭 처리 로직
window.selectRow = function(id) {
    selectedIssue = issuesData.find(i => i.id === id);
    renderTable(); // 하이라이트 반영
    
    // 선택 시 [미리보기] 버튼 활성화
    document.getElementById('btnPreview').disabled = false;
    
    // [발행] 버튼은 PENDING 상태일 때만 활성화 (이미 완료된 건 막기 위함)
    document.getElementById('btnPublish').disabled = selectedIssue.status !== 'PENDING';
}

// 2. [결과물 보기] 버튼 2 로직
window.renderPreview = function() {
    if (!selectedIssue) return;
    
    const emptyPreview = document.getElementById('emptyPreview');
    const activePreview = document.getElementById('activePreview');
    
    // 초기화 및 페이드인 효과를 위해 클래스 토글
    emptyPreview.style.opacity = '0';
    setTimeout(() => {
        emptyPreview.classList.add('hidden');
        activePreview.classList.remove('hidden');
        
        // 데이터 주입
        document.getElementById('previewCategory').innerText = selectedIssue.category;
        document.getElementById('previewA').innerText = selectedIssue.keyword_a;
        document.getElementById('previewB').innerText = selectedIssue.keyword_b;
        document.getElementById('previewTitle').innerText = selectedIssue.title;

        // 수치 포맷팅 (콤마)
        const formatNumber = num => new Intl.NumberFormat().format(num);
        
        // 애니메이션을 위한 값 세팅 (0 -> Target)
        let valA = 0;
        let valB = 0;
        const targetA = selectedIssue.metric_a_value;
        const targetB = selectedIssue.metric_b_value;

        // 비율 계산 (Total이 0일 경우 50:50 방어 로직)
        const total = targetA + targetB;
        const pctA = total === 0 ? 50 : Math.round((targetA / total) * 100);
        const pctB = 100 - pctA;

        // 게이지 바 애니메이션 트리거
        document.getElementById('barA').style.width = '0%';
        document.getElementById('barB').style.width = '0%';
        
        // 카운트업 타이머
        const interval = setInterval(() => {
            valA += Math.ceil(targetA / 30);
            valB += Math.ceil(targetB / 30);
            
            if (valA >= targetA) valA = targetA;
            if (valB >= targetB) valB = targetB;
            
            document.getElementById('valA').innerText = formatNumber(valA);
            document.getElementById('valB').innerText = formatNumber(valB);
            
            if (valA >= targetA && valB >= targetB) clearInterval(interval);
        }, 30);
        
        setTimeout(() => {
            document.getElementById('barA').style.width = `${pctA}%`;
            document.getElementById('barB').style.width = `${pctB}%`;
        }, 50);

    }, 300);
}

// 3. [유튜브 발행] 버튼 3 로직
window.publishYoutube = async function() {
    if (!selectedIssue) return;
    
    const btn = document.getElementById('btnPublish');
    btn.disabled = true;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<div class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> 유튜브 업로드 진행 중...`;

    try {
        const res = await fetch(`${API_BASE_URL}/api/publish-youtube`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ issueId: selectedIssue.id })
        });
        
        if (!res.ok) throw new Error("Publish trigger failed");
        
        alert("유튜브 업로드 파이프라인이 시작되었습니다!\n(현재 백그라운드 인코딩 및 API 연동 모사 진행 중)\n약 6초 뒤 화면이 갱신됩니다.");
        
        // 임시로 테이블을 PROCESSING 처럼 보이게 UI만 변경
        selectedIssue.status = 'PROCESSING';
        renderTable();
        
        // 실제 Worker의 setTimeout 딜레이(4s+2s)에 맞춰서 리로드
        setTimeout(() => {
            loadIssues();
            btn.innerHTML = originalHtml;
            // 리로드 후 버튼 상태는 loadIssues() -> selectRow() 유지 로직이나 renderTable()에서 초기화됨
        }, 6500);
        
    } catch (e) {
        alert("유튜브 발행 API 호출에 실패했습니다.");
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        console.error(e);
    }
}
