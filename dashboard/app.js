const API_BASE_URL = (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') || window.location.protocol === 'file:') 
    ? "https://vs-shorts-automation.khcho0421.workers.dev" // 로컬에서 테스트할 때도 워커(원격) API를 찌르도록 변경 (개발 편의성)
    : "https://vs-shorts-automation.khcho0421.workers.dev"; // Pages 배포 시 워커(백엔드) 주소

let issuesData = [];
let selectedIssue = null;

document.addEventListener("DOMContentLoaded", () => { loadIssues(); loadSystemPrompts(); });


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


let systemPrompts = [];

async function loadSystemPrompts() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/system-prompts`);
        const data = await res.json();
        const select = document.getElementById('promptTemplateSelect');
        
        if (data.success && data.prompts) {
            systemPrompts = data.prompts;
            select.innerHTML = '<option value="">템플릿 선택 (직접 입력 가능)</option>';
            systemPrompts.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
            });
            // 초기값 세팅 (첫번째 템플릿)
            if (systemPrompts.length > 0) {
                select.value = systemPrompts[0].id;
                document.getElementById('imageSystemPrompt').value = systemPrompts[0].prompt;
            }
        } else {
            select.innerHTML = '<option value="">템플릿을 불러오지 못했습니다</option>';
        }
    } catch (e) {
        console.error(e);
        document.getElementById('promptTemplateSelect').innerHTML = '<option value="">템플릿 로딩 실패</option>';
    }
}

window.handlePromptSelectChange = function() {
    const select = document.getElementById('promptTemplateSelect');
    const selectedId = parseInt(select.value);
    const prompt = systemPrompts.find(p => p.id === selectedId);
    if (prompt) {
        document.getElementById('imageSystemPrompt').value = prompt.prompt;
    }
};

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
        const isSelected = selectedIssue?.id === item.id ? 'bg-slate-700 border-l-4 border-indigo-500' : '';
        const statusClass = item.status === 'COMPLETED' ? 'text-green-500 bg-green-500/10' : (item.status === 'FAILED' ? 'text-red-500 bg-red-500/10' : 'text-yellow-500 bg-yellow-500/10');
        
        let matchUpText = '';
        if (item.layout_type === 'LIST') {
            matchUpText = `<span class="text-indigo-400 font-bold">[리스트]</span> <span class="text-xs text-slate-300 ml-1">${item.title}</span>`;
        } else {
            matchUpText = `<span class="text-blue-400">${item.keyword_a || ''}</span><span class="mx-1 text-xs">vs</span><span class="text-red-400">${item.keyword_b || ''}</span>`;
        }

        return '<tr class="cursor-pointer hover:bg-slate-800/80 transition-colors ' + isSelected + '" onclick="selectRow(' + item.id + ')">' +
            '<td class="p-4 text-slate-400">' + item.analyze_date + '</td>' +
            '<td class="p-4"><span class="bg-white/10 px-2.5 py-1 rounded-md text-xs border border-white/5">' + item.category + '</span></td>' +
            '<td class="p-4 font-medium max-w-[200px] truncate" title="'+item.title+'">' + matchUpText + '</td>' +
            '<td class="p-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold ' + statusClass + '">' + item.status + '</span></td>' +
        '</tr>';
    }).join('');
}

window.selectRow = function(id) {
    selectedIssue = issuesData.find(i => i.id === id);
    renderTable();
    const btnPreview = document.getElementById('btnPreview');
    btnPreview.disabled = false;
    btnPreview.classList.remove('bg-slate-700', 'hover:bg-slate-600');
    btnPreview.classList.add('bg-indigo-600', 'hover:bg-indigo-500', 'animate-pulse');
    
    document.getElementById('btnPublishBrowser').disabled = selectedIssue.status !== 'PENDING';
    document.getElementById('btnPublishPublic').disabled = selectedIssue.status !== 'PENDING';
    document.getElementById('btnPublishMock').disabled = selectedIssue.status !== 'PENDING';
}


window.renderPreview = async function() {
    if (!selectedIssue) return;
    
    // On mobile, scroll to the persistent preview panel
    if (window.innerWidth < 1280) { // xl breakpoint in Tailwind
        document.getElementById('persistentPreviewPanel')?.scrollIntoView({ behavior: 'smooth' });
    }

    document.getElementById('emptyPreview').classList.add('hidden');
    
    // Show mobile hardware/UI overlay and set title
    const mobileUI = document.getElementById('mobileOverlayUI');
    if (mobileUI) mobileUI.classList.remove('hidden');
    const overlayTitle = document.getElementById('uiOverlayTitle');
    if (overlayTitle) overlayTitle.innerText = selectedIssue.title;
    
    if (selectedIssue.layout_type === 'LIST') {
        document.getElementById('vsPreview').classList.add('hidden');
        document.getElementById('listPreview').classList.remove('hidden');
        _injectListData();
    } else {
        document.getElementById('listPreview').classList.add('hidden');
        document.getElementById('vsPreview').classList.remove('hidden');
        _injectPreviewData();
        _triggerAnimation();
    }
    
    document.getElementById('btnPreview').innerText = "✅ 프리뷰 렌더링 완료";
    document.getElementById('btnPreview').classList.add('bg-green-600', 'text-white');
    document.getElementById('btnPreview').classList.remove('bg-slate-700', 'hover:bg-slate-600', 'bg-indigo-600', 'hover:bg-indigo-500', 'animate-pulse');
    
    // 2. 시스템 프롬프트가 있으면 AI 이미지 생성 호출
    const systemPrompt = document.getElementById('imageSystemPrompt').value.trim();
    if (systemPrompt) {
        const btn = document.getElementById('btnPreview');
        btn.disabled = true;
        btn.innerText = 'AI 이미지 렌더링 중... ⏳';
        
        try {
            const reqBody = {
                title: selectedIssue.title,
                items_json: selectedIssue.items_json,
                systemPrompt: systemPrompt
            };
            
            const res = await fetch(`${API_BASE_URL}/api/generate-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            });
            
            const data = await res.json();
            if (data.success && data.imageUrl) {
                const targetImgId = selectedIssue.layout_type === 'LIST' ? 'aiBgList' : 'aiBgVS';
                const imgEl = document.getElementById(targetImgId);
                imgEl.src = data.imageUrl;
                imgEl.onload = () => {
                    imgEl.classList.remove('hidden');
                };
            } else {
                console.warn('Image generation failed:', data.error);
            }
        } catch (e) {
            console.error('Failed to generate image:', e);
        }
        btn.innerText = "✅ 프리뷰 & 이미지 생성 완료";
    }


    document.getElementById('btnPublishMock').disabled = false;
    document.getElementById('btnPublishBrowser').disabled = false;
    document.getElementById('btnPublishPublic').disabled = false;
    document.getElementById('btnPublishInstagram').disabled = false;
    document.getElementById('btnPublishAll').disabled = false;

}

function _formatDate(dateStr) {
    if (!dateStr) return "오늘";
    const parts = dateStr.split('-');
    if (parts.length >= 3) {
        return `${parseInt(parts[1])}월 ${parseInt(parts[2])}일`;
    }
    return dateStr;
}

function _injectPreviewData() {
    document.getElementById('previewDate').innerText = _formatDate(selectedIssue.analyze_date);
    document.getElementById('previewA').innerText = selectedIssue.keyword_a || '';
    document.getElementById('previewB').innerText = selectedIssue.keyword_b || '';
    document.getElementById('previewTitle').innerText = selectedIssue.title;
    document.getElementById('barA').style.width = '0%';
    document.getElementById('barB').style.width = '0%';
    document.getElementById('valA').innerText = '0';
    document.getElementById('valB').innerText = '0';
    document.getElementById('pctA').innerText = '0%';
    document.getElementById('pctB').innerText = '0%';
}

function _injectListData() {
    document.getElementById('listTitle').innerText = selectedIssue.title;
    
    // 리스트 프리뷰 내의 헤더 타이틀을 동적으로 템플릿 제목으로 교체
    const previewTitleEl = document.getElementById('listPreviewTitle');
    if (previewTitleEl) {
        previewTitleEl.innerText = selectedIssue.title;
    }

    const container = document.getElementById('listItemsContainer');
    container.innerHTML = '';

    let items = [];
    try {
        if (selectedIssue.items_json) {
            items = JSON.parse(selectedIssue.items_json);
        }
    } catch(e) { console.error(e); }

    const colors = ['text-blue-600', 'text-green-600', 'text-yellow-600', 'text-purple-600', 'text-red-600', 'text-orange-600', 'text-teal-600', 'text-pink-600'];

    let html = '';
    items.forEach((item, idx) => {
        const color = colors[idx % colors.length];
        html += `
        <div class="w-full bg-white/90 rounded-xl p-2 shadow-[0_2px_5px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center relative gap-2 shrink-0">
            <span class="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-800 text-sm font-bold shrink-0 ${color}">
                ${item.rank || (idx + 1)}
            </span>
            <div class="flex-1 min-w-0">
                <div class="flex items-baseline gap-1">
                    <h4 class="text-base text-slate-800 tracking-tight leading-tight truncate">${item.title}</h4>
                    <span class="text-xs text-slate-500 font-['Nanum_Pen_Script'] text-base ml-1">→</span>
                    <span class="text-xs text-slate-700 truncate">${item.detail}</span>
                </div>
                ${item.subDetail ? `<p class="text-[0.65rem] text-slate-500 font-['Nanum_Pen_Script'] text-sm tracking-wide mt-0.5">• ${item.subDetail}</p>` : ''}
            </div>
            <div class="text-2xl drop-shadow-sm ml-1 shrink-0">${item.icon || '✨'}</div>
        </div>
        `;
    });
    container.innerHTML = html;
}

function _triggerAnimation() {
    if (selectedIssue.layout_type === 'LIST') return; // 리스트는 별도 애니메이션 없음 (또는 css로 처리)

    const tA = selectedIssue.metric_a_value || 0, tB = selectedIssue.metric_b_value || 0;
    const pctA = (tA + tB === 0) ? 50 : Math.round((tA / (tA+tB)) * 100);
    
    setTimeout(() => {
        document.getElementById('barA').style.width = pctA + '%';
        document.getElementById('barB').style.width = (100 - pctA) + '%';
        document.getElementById('valA').innerText = new Intl.NumberFormat().format(tA);
        document.getElementById('valB').innerText = new Intl.NumberFormat().format(tB);
        document.getElementById('pctA').innerText = pctA + '%';
        document.getElementById('pctB').innerText = (100 - pctA) + '%';
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


window.publishInstagramBrowser = async function() {
    if (!selectedIssue) return;
    const btn = document.getElementById('btnPublishInstagram');
    const originalText = btn.innerHTML;
    btn.disabled = true; 
    btn.innerHTML = '브라우저 렌더링 중... (창 유지)';

    try {
        // 1. 렌더링 셋업
        document.getElementById('emptyPreview').classList.add('hidden');
        if (selectedIssue.layout_type === 'LIST') {
            document.getElementById('vsPreview').classList.add('hidden');
            document.getElementById('listPreview').classList.remove('hidden');
            _injectListData();
        } else {
            document.getElementById('listPreview').classList.add('hidden');
            document.getElementById('vsPreview').classList.remove('hidden');
            _injectPreviewData();
            _triggerAnimation();
        }

        const recIndicator = document.getElementById('recIndicator');
        if(recIndicator) recIndicator.classList.remove('hidden');
        const mobileUI = document.getElementById('mobileOverlayUI');
        if(mobileUI) mobileUI.classList.add('hidden'); 

        // 2. 녹화 시작
        const videoBlob = await recordCanvas();
        if(recIndicator) recIndicator.classList.add('hidden');
        if(mobileUI) mobileUI.classList.remove('hidden');
        
        btn.innerHTML = '인스타그램 업로드 중...';
        
        // 3. 업로드
        const formData = new FormData();
        formData.append('video', videoBlob, 'shorts.webm');
        formData.append('title', selectedIssue.title);
        formData.append('id', selectedIssue.id);

        const uploadRes = await fetch('/api/publish/instagram', {
            method: 'POST',
            body: formData
        });
        
        const result = await uploadRes.json();
        
        if (result.success) {
            alert('인스타그램 릴스 게시 완료!\\n컨테이너 ID: ' + result.igContainerId);
            selectedIssue.status = 'COMPLETED';
            renderTable();
        } else {
            alert('인스타그램 게시 실패: ' + (result.error || result.message));
        }

    } catch (error) {
        console.error(error);
        alert('에러 발생: ' + error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

window.publishYoutubeBrowser = async function(privacyStatus = 'private') {
    if (!selectedIssue) return;
    const btn = document.getElementById(privacyStatus === 'public' ? 'btnPublishPublic' : 'btnPublishBrowser');
    const originalText = btn.innerHTML;
    btn.disabled = true; 
    btn.innerHTML = '브라우저 렌더링 중... (창 유지)';

    try {
        // 1. 렌더링 셋업 및 REC 온
        document.getElementById('emptyPreview').classList.add('hidden');
        if (selectedIssue.layout_type === 'LIST') {
            document.getElementById('vsPreview').classList.add('hidden');
            document.getElementById('listPreview').classList.remove('hidden');
            _injectListData();
        } else {
            document.getElementById('listPreview').classList.add('hidden');
            document.getElementById('vsPreview').classList.remove('hidden');
            _injectPreviewData();
            _triggerAnimation();
        }
        document.getElementById('recIndicator').classList.remove('hidden');

        // 2. 애니메이션 시작과 동시에 녹화 시작
        const videoBlob = await recordCanvas();
        
        document.getElementById('recIndicator').classList.add('hidden');
        btn.innerHTML = '실제 업로드 중...';

        const formData = new FormData();
        formData.append('issueId', selectedIssue.id);
        formData.append('title', selectedIssue.title);
        formData.append('videoFile', videoBlob, 'shorts.webm');
        formData.append('privacyStatus', privacyStatus);

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
            btn.disabled = false; btn.innerHTML = originalText;
        }
    } catch(e) { 
        alert("요청 실패: " + e.message); 
        btn.disabled = false; btn.innerHTML = originalText; 
        document.getElementById('recIndicator').classList.add('hidden');
    }
}

window.publishAll = async function() {
    const targetBtn = document.getElementById('btnPublishAll');
    const originalText = targetBtn.innerHTML;
    targetBtn.disabled = true;
    targetBtn.innerHTML = '<span class="animate-pulse">녹화 & 전송 중...</span>';
    
    try {
        if(!selectedIssue) throw new Error("주제를 선택해주세요.");
        
        document.getElementById('recIndicator').classList.remove('hidden');
        const videoBlob = await recordCanvas();
        document.getElementById('recIndicator').classList.add('hidden');
        
        targetBtn.innerHTML = '<span class="animate-pulse">멀티 채널 업로드 중...</span>';

        const formData = new FormData();
        formData.append('issueId', selectedIssue.id);
        formData.append('title', selectedIssue.title);
        // Instagram은 mp4, mov 확장자를 권장하므로 확장자를 명시적으로 지정
        formData.append('videoFile', videoBlob, 'shorts.mp4'); 
        formData.append('privacyStatus', 'public'); // 동시 발행은 기본 공개로 설정

        const res = await fetch('/api/publish-all', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if(res.ok) {
            alert("동시 발행 성공!\n유튜브 ID: " + (data.youtubeId || '성공') + "\n인스타 ID: " + (data.instagramId || '성공'));
            selectedIssue.status = 'COMPLETED'; 
            renderTable();
        } else {
            alert("업로드 오류: " + (data.error || JSON.stringify(data)));
        }
    } catch(e) {
        alert("요청 실패: " + e.message); 
        document.getElementById('recIndicator').classList.add('hidden');
    } finally {
        targetBtn.disabled = false;
        targetBtn.innerHTML = originalText;
    }
}

// --- 네비게이션 탭 전환 로직 ---
window.switchTab = function(targetId, btnElement) {
    // 1. 모든 페이지 섹션 숨기기
    document.querySelectorAll('.page-section').forEach(el => {
        el.classList.add('hidden');
    });
    
    // 2. 선택된 타겟 보이기
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
        targetEl.classList.remove('hidden');
    }

    // 3. 버튼 활성화 상태 업데이트
    if (btnElement) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('bg-white/10', 'text-indigo-400');
            btn.classList.add('text-slate-400');
        });
        btnElement.classList.add('bg-white/10', 'text-indigo-400');
        btnElement.classList.remove('text-slate-400');
    }
}

window.onload = function() {
    const today = new Date();
    today.setDate(today.getDate() - 1); // 전일
    const stockDate = document.getElementById('stockDate');
    if (stockDate) {
        stockDate.value = today.toISOString().split('T')[0];
    }
}

// --- LLM Studio API 연동 ---
window.generateLLMContent = async function() {
    const rawData = document.getElementById('llmRawData').value;
    const prompt = document.getElementById('llmPrompt').value;
    const loading = document.getElementById('llmLoading');
    const outputJSON = document.getElementById('llmOutputJSON');
    const btnApply = document.getElementById('btnApplyLLM');

    if (!rawData || !prompt) {
        alert("원본 데이터와 시스템 프롬프트를 모두 입력해주세요.");
        return;
    }

    loading.classList.remove('hidden');
    outputJSON.value = "";
    btnApply.disabled = true;

    try {
        const res = await fetch(`${API_BASE_URL}/api/generate-content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawData, prompt })
        });
        const data = await res.json();
        
        if (res.ok) {
            let cleanStr = typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2);
            cleanStr = cleanStr.replace(/```json/g, '').replace(/```/g, '').trim();
            outputJSON.value = cleanStr;
            btnApply.disabled = false;
        } else {
            alert("LLM 생성 오류: " + (data.error || "알 수 없는 오류"));
        }
    } catch(e) {
        alert("요청 실패: " + e.message);
    } finally {
        loading.classList.add('hidden');
    }
}

window.applyLLMToTemplate = async function() {
    try {
        const jsonStr = document.getElementById('llmOutputJSON').value;
        const parsedData = JSON.parse(jsonStr);
        const items = Array.isArray(parsedData) ? parsedData : [parsedData];
        
        const res = await fetch(`${API_BASE_URL}/api/fetch-issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ generatedItems: items })
        });

        if (res.ok) {
            alert("데이터가 이슈 팩토리에 성공적으로 등록되었습니다!");
            switchTab('page-shorts', document.querySelector('.nav-btn[data-target="page-shorts"]'));
            loadIssues();
        } else {
            const err = await res.json();
            alert("적용 실패: " + err.error);
        }
    } catch(e) {
        alert("JSON 형식이 올바르지 않습니다: " + e.message);
    }
}

// --- 주식 시황 API 호출 ---
window.fetchStockNews = async function() {
    const btn = document.getElementById('btnFetchStock');
    const dateInput = document.getElementById('stockDate');
    const selectedDate = dateInput ? dateInput.value : '';

    btn.disabled = true;
    document.getElementById('stockEmpty').classList.add('hidden');
    document.getElementById('stockContent').classList.remove('hidden');
    document.getElementById('stockLoading').classList.remove('hidden');
    
    try {
        const query = selectedDate ? `?date=${selectedDate}` : '';
        const res = await fetch(`${API_BASE_URL}/api/stock-news${query}`);
        const data = await res.json();
        
        window.selectedStockNews = []; // 초기화

        const updateStockPreviewButton = () => {
            const btn = document.getElementById('btnPreview');
            if (window.selectedStockNews.length > 0) {
                // 선택된 뉴스들을 이용해 가상의 selectedIssue 생성
                const itemsJson = window.selectedStockNews.map((text, i) => ({
                    rank: i + 1,
                    title: text.length > 30 ? text.substring(0, 30) + '...' : text,
                    detail: text
                }));
                selectedIssue = {
                    id: 'stock-news-custom',
                    title: "선택된 주요 시황 뉴스",
                    layout_type: "LIST",
                    items_json: JSON.stringify(itemsJson)
                };
                
                btn.disabled = false;
                btn.classList.remove('bg-slate-700', 'hover:bg-slate-600', 'opacity-40');
                btn.classList.add('bg-indigo-600', 'hover:bg-indigo-500', 'shadow-[0_0_15px_rgba(79,70,229,0.5)]');
                btn.innerText = "선택한 주제 VS 결과물 보기";
            } else {
                selectedIssue = null;
                btn.disabled = true;
                btn.classList.add('bg-slate-700', 'hover:bg-slate-600', 'opacity-40');
                btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-500', 'shadow-[0_0_15px_rgba(79,70,229,0.5)]');
            }
        };

        const renderList = (elementId, items, emptyMsg) => {
            const listEl = document.getElementById(elementId);
            listEl.innerHTML = '';
            
            if (items && items.length > 0) {
                items.forEach((item, idx) => {
                    const li = document.createElement('li');
                    li.className = "bg-white/10 p-4 rounded-xl border border-slate-600/50 hover:bg-white/20 transition-all flex items-center gap-3 cursor-pointer";
                    li.innerHTML = `<span class="text-emerald-400 font-bold w-6 h-6 flex items-center justify-center bg-emerald-400/20 rounded-full shrink-0">${idx+1}</span>
                                    <span class="text-slate-200 text-sm md:text-base pointer-events-none">${item}</span>`;
                    
                    li.onclick = () => {
                        const index = window.selectedStockNews.indexOf(item);
                        if (index > -1) {
                            window.selectedStockNews.splice(index, 1);
                            li.classList.remove('bg-emerald-500/20', 'border-emerald-400', 'shadow-[0_0_10px_rgba(52,211,153,0.3)]');
                            li.classList.add('bg-white/10', 'border-slate-600/50');
                        } else {
                            window.selectedStockNews.push(item);
                            li.classList.remove('bg-white/10', 'border-slate-600/50');
                            li.classList.add('bg-emerald-500/20', 'border-emerald-400', 'shadow-[0_0_10px_rgba(52,211,153,0.3)]');
                        }
                        updateStockPreviewButton();
                    };
                    listEl.appendChild(li);
                });
            } else {
                listEl.innerHTML = `<li class="text-slate-400 text-center py-8">${emptyMsg}</li>`;
            }
        };

        renderList('stockListUS', data.us, "해당 날짜의 미국 증시 뉴스를 불러올 수 없습니다.");
        renderList('stockListKR', data.kr, "해당 날짜의 한국 증시 뉴스를 불러올 수 없습니다.");
    } catch(e) {
        alert("시황 불러오기 실패: " + e.message);
    } finally {
        btn.disabled = false;
        document.getElementById('stockLoading').classList.add('hidden');
    }
}
