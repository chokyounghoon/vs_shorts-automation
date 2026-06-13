const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VS Shorts Automation V3</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- html2canvas 추가 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
        .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .row-selected { background-color: rgba(99, 102, 241, 0.2) !important; border-left: 4px solid #6366f1; }
        .progress-bar { transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        @keyframes pulse-red {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        .rec-indicator { animation: pulse-red 1.5s infinite; }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8 flex flex-col gap-6">

    <header class="glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
        <div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
                VS Shorts Automation ⚡️
            </h1>
            <p class="text-slate-400 text-sm mt-1">Multi-method Video Pipeline</p>
        </div>
        <div>
            <button onclick="window.location.href='/api/auth/google'" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center gap-2">
                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                유튜브 계정 연동하기
            </button>
        </div>
    </header>

    <main class="flex flex-col xl:flex-row gap-6 h-full flex-1 min-h-[600px]">
        <!-- Left Column -->
        <div class="flex-1 glass rounded-2xl p-6 flex flex-col gap-4 overflow-hidden shadow-2xl relative">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/80 pb-4">
                <h2 class="text-xl font-semibold flex items-center gap-2">
                    <span class="w-2 h-6 bg-indigo-500 rounded-full inline-block shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                    Issue Repository
                </h2>
                <button id="btnFetch" onclick="fetchNewIssues()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center">
                    오늘의 핫이슈 VS 주제 가져오기
                </button>
            </div>

            <div class="overflow-y-auto flex-1 border border-slate-700/50 rounded-xl relative bg-slate-900/30">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="bg-slate-800/80 sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                            <th class="p-4 text-slate-300">Date</th>
                            <th class="p-4 text-slate-300">Category</th>
                            <th class="p-4 text-slate-300">Match-Up</th>
                            <th class="p-4 text-slate-300">Status</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody" class="divide-y divide-slate-700/50"></tbody>
                </table>
                <div id="loadingIndicator" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center hidden z-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-indigo-500"></div>
                </div>
            </div>
        </div>

        <!-- Right Column -->
        <div class="w-full xl:w-[420px] glass rounded-2xl p-6 flex flex-col gap-5 flex-shrink-0 shadow-2xl">
            <h2 class="text-xl font-semibold flex items-center gap-2 border-b border-slate-700/80 pb-3">
                <span class="w-2 h-6 bg-purple-500 rounded-full inline-block shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                Shorts Preview Panel
            </h2>

            <!-- 9:16 Preview Card -->
            <div class="relative w-full aspect-[9/16] bg-black rounded-[2rem] border-8 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between mx-auto max-w-[360px]" id="previewCard">
                <!-- REC Indicator -->
                <div id="recIndicator" class="absolute top-4 left-4 z-50 flex items-center gap-2 hidden">
                    <div class="w-3 h-3 bg-red-500 rounded-full rec-indicator shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
                    <span class="text-white text-xs font-bold tracking-widest drop-shadow-md">REC</span>
                </div>

                <div id="emptyPreview" class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900 z-20">
                    <p class="text-sm font-medium">리스트에서 항목을 선택하고<br><strong class="text-slate-300">결과물 보기</strong> 버튼을 누르세요.</p>
                </div>

                <div id="activePreview" class="absolute inset-0 flex flex-col hidden bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
                    <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
                    <div class="relative z-10 pt-16 px-4 text-center">
                        <h3 class="text-[2.5rem] font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] leading-tight tracking-tighter">
                            기적을<br>만들어보자
                        </h3>
                    </div>
                    <div class="relative z-10 flex-1 flex flex-col items-center justify-center px-4 w-full mt-4">
                        <p id="previewCategory" class="text-[0.65rem] font-black bg-white/10 border border-white/20 px-3 py-1.5 rounded-full mb-8 tracking-[0.2em] uppercase text-slate-300 backdrop-blur-md"></p>
                        <div class="w-full flex justify-between items-center px-2 mb-10">
                            <div class="w-[42%] text-center"><h4 id="previewA" class="text-xl md:text-2xl font-black text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)] break-keep leading-tight"></h4></div>
                            <div class="w-[16%] text-center"><span class="text-2xl font-black italic text-white opacity-90 drop-shadow-md">VS</span></div>
                            <div class="w-[42%] text-center"><h4 id="previewB" class="text-xl md:text-2xl font-black text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)] break-keep leading-tight"></h4></div>
                        </div>
                        <div class="w-full px-2 mb-4">
                            <div class="flex justify-between text-sm font-black mb-3">
                                <span id="valA" class="text-blue-400 text-lg">0</span><span id="valB" class="text-red-400 text-lg">0</span>
                            </div>
                            <div class="w-full h-5 bg-slate-900 rounded-full overflow-hidden flex shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-white/10">
                                <div id="barA" class="progress-bar h-full bg-gradient-to-r from-blue-700 to-blue-400" style="width: 0%"></div>
                                <div id="barB" class="progress-bar h-full bg-gradient-to-l from-red-700 to-red-400" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="mt-auto pb-10 w-full px-4">
                            <p id="previewTitle" class="text-center text-sm text-slate-200 font-medium leading-relaxed bg-black/50 p-3 rounded-xl border border-white/10 backdrop-blur-md"></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-3 mt-2">
                <button id="btnPreview" onclick="renderPreview()" disabled class="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg">
                    선택한 주제 VS 결과물 보기
                </button>
                <div class="flex gap-2 w-full">
                    <button id="btnPublishMock" onclick="publishYoutubeMock()" disabled class="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg text-[13px]">
                        서버 가상 모사
                    </button>
                    <button id="btnPublishBrowser" onclick="publishYoutubeBrowser()" disabled class="flex-[1.5] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-1.5 text-[13px]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        브라우저 녹화 (방법 A)
                    </button>
                </div>
            </div>
        </div>
    </main>

    <script>
        let issuesData = [];
        let selectedIssue = null;

        document.addEventListener("DOMContentLoaded", loadIssues);

        async function fetchNewIssues() {
            const btn = document.getElementById('btnFetch');
            const orig = btn.innerHTML;
            btn.disabled = true; btn.innerHTML = 'Fetching...';
            try {
                const res = await fetch('/api/fetch-issues', { method: 'POST' });
                if(!res.ok) throw new Error("Fetch failed");
                await loadIssues();
                alert("핫이슈를 생성했습니다!");
            } catch (e) { alert("데이터를 생성하는 데 실패했습니다. 원격 데이터베이스 스키마가 업데이트되었는지 확인해 주세요."); }
            btn.disabled = false; btn.innerHTML = orig;
        }

        async function loadIssues() {
            document.getElementById('loadingIndicator').classList.remove('hidden');
            try {
                const res = await fetch('/api/issues');
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

        // 애니메이션 렌더링 (단순 보기용)
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
                const res = await fetch('/api/publish-youtube-mock', {
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
                
                const stream = canvas.captureStream(10); // 10 fps (비용 최적화)
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
                
                // 5초간 녹화 후 종료
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
                // 1. 렌더링 셋업 및 REC 온
                document.getElementById('emptyPreview').classList.add('hidden');
                document.getElementById('activePreview').classList.remove('hidden');
                _injectPreviewData();
                document.getElementById('recIndicator').classList.remove('hidden');

                // 2. 애니메이션 시작과 동시에 녹화 시작
                _triggerAnimation();
                const videoBlob = await recordCanvas();
                
                document.getElementById('recIndicator').classList.add('hidden');
                btn.innerHTML = '실제 업로드 중...';

                // 3. FormData 구성 (Blob 전송)
                const formData = new FormData();
                formData.append('issueId', selectedIssue.id);
                formData.append('title', selectedIssue.title);
                formData.append('videoFile', videoBlob, 'shorts.webm');

                // 4. API 쏘기
                const res = await fetch('/api/publish-youtube', {
                    method: 'POST',
                    body: formData // multipart/form-data 자동 지정됨
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
    </script>
</body>
</html>
`;

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// 1. 단일 파일 HTML 프론트엔드 서빙
		if (request.method === "GET" && url.pathname === "/") {
			return new Response(HTML_CONTENT, {
				headers: { "Content-Type": "text/html;charset=UTF-8" },
			});
		}

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
		}
		const corsHeaders = { "Access-Control-Allow-Origin": "*" };

		// 2. OAuth 2.0 흐름
		const REDIRECT_URI = url.origin + '/api/auth/callback';

		if (request.method === "GET" && url.pathname === "/api/auth/google") {
			const clientId = env.YT_CLIENT_ID;
			if(!clientId) return new Response("YT_CLIENT_ID not set in environment variables.", { status: 500 });
			
			const scope = encodeURIComponent("https://www.googleapis.com/auth/youtube.upload");
			const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
			return Response.redirect(authUrl, 302);
		}

		if (request.method === "GET" && url.pathname === "/api/auth/callback") {
			const code = url.searchParams.get('code');
			if (!code) return new Response("Code not found", { status: 400 });

			const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					code: code,
					client_id: env.YT_CLIENT_ID,
					client_secret: env.YT_CLIENT_SECRET,
					redirect_uri: REDIRECT_URI,
					grant_type: "authorization_code"
				})
			});

			const tokenData = await tokenResponse.json();
			if (tokenData.refresh_token) {
				await env.DB.prepare(`
					INSERT INTO youtube_tokens (id, refresh_token, updated_at) VALUES (1, ?, datetime('now', 'localtime'))
					ON CONFLICT(id) DO UPDATE SET refresh_token = excluded.refresh_token, updated_at = excluded.updated_at
				`).bind(tokenData.refresh_token).run();
				return Response.redirect('https://vs-shorts-automation.pages.dev/?auth=success', 302);
			} else {
				return new Response("Failed to get refresh_token. Please ensure prompt=consent was used.", { status: 400 });
			}
		}

		// 3. 비즈니스 로직 API
		
		if (request.method === "POST" && url.pathname === "/api/fetch-issues") {
			const today = new Date().toISOString().split('T')[0];
			const mockDataList = [
				{
					analyze_date: today, category: "미국주식",
					keyword_a: "NVIDIA", keyword_b: "AMD",
					title: "끝나지 않은 AI 반도체 전쟁! 엔비디아 vs AMD 승자는?",
					controversy_score: 88, metric_a_value: 3450000, metric_b_value: 1250000
				},
				{
					analyze_date: today, category: "소비재",
					keyword_a: "코카콜라", keyword_b: "펩시",
					title: "세기의 라이벌, 코카콜라 vs 펩시 블라인드 테스트 진실은?",
					controversy_score: 95, metric_a_value: 65000, metric_b_value: 62000
				},
				{
					analyze_date: today, category: "글로벌 IT",
					keyword_a: "ChatGPT", keyword_b: "Gemini",
					title: "인공지능 왕좌의 게임! 챗GPT vs 제미나이 압도적 차이",
					controversy_score: 80, metric_a_value: 1050000, metric_b_value: 890000
				}
			];

			const insertQuery = `INSERT INTO hot_issues (analyze_date, category, keyword_a, keyword_b, title, controversy_score, metric_a_value, metric_b_value, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`;
			const stmts = mockDataList.map(d => env.DB.prepare(insertQuery).bind(d.analyze_date, d.category, d.keyword_a, d.keyword_b, d.title, d.controversy_score, d.metric_a_value, d.metric_b_value));
			
			await env.DB.batch(stmts);
			return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
		}

		if (request.method === "GET" && url.pathname === "/api/issues") {
			const { results } = await env.DB.prepare("SELECT * FROM hot_issues ORDER BY created_at DESC LIMIT 50").all();
			return new Response(JSON.stringify(results), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
		}

		// API 3A: 서버 렌더링 (가상 모사) API
		if (request.method === "POST" && url.pathname === "/api/publish-youtube-mock") {
			const { issueId } = await request.json();
			const tokenRecord = await env.DB.prepare("SELECT refresh_token FROM youtube_tokens WHERE id = 1").first();
			if (!tokenRecord) {
				return new Response(JSON.stringify({ error: "YouTube account not linked. Please link your account first." }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
			ctx.waitUntil(this.processPublishPipelineMock(issueId, tokenRecord.refresh_token, env));
			return new Response(JSON.stringify({ message: "Mock pipeline started" }), { status: 202, headers: { "Content-Type": "application/json", ...corsHeaders } });
		}

		// API 3B: 브라우저 녹화 -> 실제 유튜브 멀티파트 업로드 API
		if (request.method === "POST" && url.pathname === "/api/publish-youtube") {
			try {
				const formData = await request.formData();
				const issueId = formData.get('issueId');
				const title = formData.get('title');
				const videoFile = formData.get('videoFile'); // Blob (WebM)

				if (!videoFile) {
					return new Response(JSON.stringify({ error: "No video file received" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
				}

				const tokenRecord = await env.DB.prepare("SELECT refresh_token FROM youtube_tokens WHERE id = 1").first();
				if (!tokenRecord) {
					return new Response(JSON.stringify({ error: "YouTube account not linked. Please link your account first." }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
				}

				const accessToken = await this.getFreshAccessToken(tokenRecord.refresh_token, env);

				const ytFormData = new FormData();
				const metadata = {
					snippet: { title: title + " #shorts #vs", description: "Auto-generated Shorts by Browser Recording", categoryId: "24", tags: ["shorts", "vs"] },
					status: { privacyStatus: "private" }
				};
				ytFormData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
				ytFormData.append('file', videoFile, 'shorts.webm');

				const ytRes = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status", {
					method: "POST",
					headers: { "Authorization": `Bearer ${accessToken}` },
					body: ytFormData
				});

				const ytData = await ytRes.json();

				if (!ytRes.ok) {
					await env.DB.prepare("UPDATE hot_issues SET status = 'FAILED' WHERE id = ?").bind(issueId).run();
					return new Response(JSON.stringify({ error: ytData.error?.message || "YouTube API Error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
				}

				await env.DB.prepare("UPDATE hot_issues SET status = 'COMPLETED', updated_at = datetime('now', 'localtime') WHERE id = ?").bind(issueId).run();
				
				return new Response(JSON.stringify({ message: "Successfully uploaded", videoId: ytData.id }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
			} catch (error) {
				return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } });
	},

	async getFreshAccessToken(refresh_token, env) {
		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: env.YT_CLIENT_ID,
				client_secret: env.YT_CLIENT_SECRET,
				refresh_token: refresh_token,
				grant_type: "refresh_token"
			})
		});
		const data = await response.json();
		if (data.access_token) return data.access_token;
		throw new Error("Failed to refresh token: " + JSON.stringify(data));
	},

	// 가상 서버 렌더링 파이프라인 (Mock)
	async processPublishPipelineMock(issueId, refresh_token, env) {
		try {
			await env.DB.prepare("UPDATE hot_issues SET status = 'PROCESSING' WHERE id = ?").bind(issueId).run();
			const accessToken = await this.getFreshAccessToken(refresh_token, env);
			
			// 가상의 비디오 인코딩 대기 (Shotstack 등 모사)
			await new Promise(r => setTimeout(r, 4000));
			
			// 가상의 유튜브 REST API 전송 대기
			await new Promise(r => setTimeout(r, 2000));
			
			await env.DB.prepare("UPDATE hot_issues SET status = 'COMPLETED', updated_at = datetime('now', 'localtime') WHERE id = ?").bind(issueId).run();
		} catch (error) {
			await env.DB.prepare("UPDATE hot_issues SET status = 'FAILED', updated_at = datetime('now', 'localtime') WHERE id = ?").bind(issueId).run();
		}
	}
};
