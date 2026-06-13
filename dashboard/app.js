const API_BASE_URL = (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') || window.location.protocol === 'file:') 
    ? "https://vs-shorts-automation.khcho0421.workers.dev" // 로컬에서 테스트할 때도 워커(원격) API를 찌르도록 변경 (개발 편의성)
    : "https://vs-shorts-automation.khcho0421.workers.dev"; // Pages 배포 시 워커(백엔드) 주소

let issuesData = [];
let selectedIssue = null;

document.addEventListener("DOMContentLoaded", loadIssues);

async function fetchNewIssues() {
    const btn = document.getElementById('btnFetch');
    const orig = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = 'Fetching...';
    try {
        const res = await fetch(`${API_BASE_URL}/api/fetch-issues`, { method: 'POST' });
        if(!res.ok) throw new Error("Fetch failed");
        await loadIssues();
        alert("핫이슈를 생성했습니다!");
    } catch (e) { alert("데이터를 생성하는 데 실패했습니다. 원격 데이터베이스 스키마가 업데이트되었는지 확인해 주세요."); }
    btn.disabled = false; btn.innerHTML = orig;
}

async function loadIssues() {
    document.getElementById('loadingIndicator').classList.remove('hidden');
    try {
        const res = await fetch(`${API_BASE_URL}/api/issues`);
        issuesData = await res.json();
        renderTable();
    } finally {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = issuesData.map(function(item) {
        const isSelected = selectedIssue?.id === item.id ? 'row-selected' : '';
        const statusClass = item.status === 'COMPLETED' ? 'text-green-500 bg-green-500/10' : (item.status === 'FAILED' ? 'text-red-500 bg-red-500/10' : 'text-yellow-500 bg-yellow-500/10');
        return '<tr class="cursor-pointer hover:bg-slate-800/80 transition-colors ' + isSelected + '" onclick="selectRow(' + item.id + ')">' +
            '<td class="p-4 text-slate-400">' + item.analyze_date + '</td>' +
            '<td class="p-4"><span class="bg-white/10 px-2.5 py-1 rounded-md text-xs border border-white/5">' + item.category + '</span></td>' +
            '<td class="p-4 font-medium"><span class="text-blue-400">' + item.keyword_a + '</span><span class="mx-1 text-xs">vs</span><span class="text-red-400">' + item.keyword_b + '</span></td>' +
            '<td class="p-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold ' + statusClass + '">' + item.status + '</span></td>' +
        '</tr>';
    }).join('');
}

window.selectRow = function(id) {
    selectedIssue = issuesData.find(i => i.id === id);
    renderTable();
    document.getElementById('btnPreview').disabled = false;
    document.getElementById('btnPublishBrowser').disabled = selectedIssue.status !== 'PENDING';
    document.getElementById('btnPublishMock').disabled = selectedIssue.status !== 'PENDING';
}

window.renderPreview = function() {
    if (!selectedIssue) return;
    document.getElementById('emptyPreview').classList.add('hidden');
    document.getElementById('activePreview').classList.remove('hidden');
    
    _injectPreviewData();
    _triggerAnimation();
}

function _injectPreviewData() {
    document.getElementById('previewCategory').innerText = selectedIssue.category;
    document.getElementById('previewA').innerText = selectedIssue.keyword_a;
    document.getElementById('previewB').innerText = selectedIssue.keyword_b;
    document.getElementById('previewTitle').innerText = selectedIssue.title;
    document.getElementById('barA').style.width = '0%';
    document.getElementById('barB').style.width = '0%';
    document.getElementById('valA').innerText = '0';
    document.getElementById('valB').innerText = '0';
}

function _triggerAnimation() {
    const tA = selectedIssue.metric_a_value, tB = selectedIssue.metric_b_value;
    const pctA = (tA + tB === 0) ? 50 : Math.round((tA / (tA+tB)) * 100);
    
    setTimeout(() => {
        document.getElementById('barA').style.width = pctA + '%';
        document.getElementById('barB').style.width = (100 - pctA) + '%';
        document.getElementById('valA').innerText = new Intl.NumberFormat().format(tA);
        document.getElementById('valB').innerText = new Intl.NumberFormat().format(tB);
    }, 100);
}

// --- 버튼 1: 기존 서버 렌더링(가상 모사) 로직 ---
window.publishYoutubeMock = async function() {
    if (!selectedIssue) return;
    const btn = document.getElementById('btnPublishMock');
    btn.disabled = true; btn.innerHTML = '대기중...';
    try {
        const res = await fetch(`${API_BASE_URL}/api/publish-youtube-mock`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issueId: selectedIssue.id })
        });
        const data = await res.json();
        if(res.ok) {
            alert("가상 모사 발행 파이프라인이 시작되었습니다! 백엔드에서 시뮬레이션 중입니다.");
            selectedIssue.status = 'PROCESSING'; renderTable();
            setTimeout(loadIssues, 6500);
        } else {
            alert("오류: " + (data.error || "알 수 없는 오류"));
            btn.disabled = false; btn.innerHTML = '서버 가상 모사';
        }
    } catch(e) { alert("요청 실패"); btn.disabled = false; btn.innerHTML = '서버 가상 모사'; }
}

// --- 버튼 2: 브라우저 DOM 녹화 로직 (방법 A) ---
async function recordCanvas() {
    return new Promise((resolve, reject) => {
        const previewEl = document.getElementById('previewCard');
        const canvas = document.createElement('canvas');
        canvas.width = previewEl.offsetWidth;
        canvas.height = previewEl.offsetHeight;
        const ctx = canvas.getContext('2d');
        
        const stream = canvas.captureStream(10); // 10 fps
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const chunks = [];
        
        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
            resolve(new Blob(chunks, { type: 'video/webm' }));
        };
        
        recorder.start();
        
        let isRecording = true;
        const drawLoop = async () => {
            if (!isRecording) return;
            try {
                const tempCanvas = await html2canvas(previewEl, { 
                    backgroundColor: '#000000', scale: 1, useCORS: true 
                });
                ctx.drawImage(tempCanvas, 0, 0);
            } catch(e) {}
            if (isRecording) setTimeout(drawLoop, 100);
        };
        
        drawLoop();
        
        setTimeout(() => {
            isRecording = false;
            recorder.stop();
        }, 5000);
    });
}

window.publishYoutubeBrowser = async function() {
    if (!selectedIssue) return;
    const btn = document.getElementById('btnPublishBrowser');
    btn.disabled = true; 
    btn.innerHTML = '브라우저 렌더링 중... (창 유지)';

    try {
        document.getElementById('emptyPreview').classList.add('hidden');
        document.getElementById('activePreview').classList.remove('hidden');
        _injectPreviewData();
        document.getElementById('recIndicator').classList.remove('hidden');

        _triggerAnimation();
        const videoBlob = await recordCanvas();
        
        document.getElementById('recIndicator').classList.add('hidden');
        btn.innerHTML = '실제 업로드 중...';

        const formData = new FormData();
        formData.append('issueId', selectedIssue.id);
        formData.append('title', selectedIssue.title);
        formData.append('videoFile', videoBlob, 'shorts.webm');

        const res = await fetch(`${API_BASE_URL}/api/publish-youtube`, {
            method: 'POST',
            body: formData 
        });
        const data = await res.json();
        
        if(res.ok) {
            alert("실제 유튜브 업로드 파이프라인이 성공적으로 완료되었습니다!");
            selectedIssue.status = 'COMPLETED'; 
            renderTable();
        } else {
            alert("업로드 오류: " + (data.error || "알 수 없는 오류"));
            btn.disabled = false; btn.innerHTML = '브라우저 녹화 (방법 A)';
        }
    } catch(e) { 
        alert("요청 실패: " + e.message); 
        btn.disabled = false; btn.innerHTML = '브라우저 녹화 (방법 A)'; 
        document.getElementById('recIndicator').classList.add('hidden');
    }
}
