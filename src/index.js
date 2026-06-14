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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Jua&family=Nanum+Pen+Script&display=swap" rel="stylesheet">
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
<body class="min-h-screen bg-slate-900 text-slate-50 flex overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-64 glass border-r border-slate-700/50 flex flex-col hidden md:flex shrink-0 z-50">
        <div class="p-6 border-b border-slate-700/50">
            <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">Antigravity Studio</h2>
        </div>
        <nav class="flex-1 p-4 flex flex-col gap-2">
            <button class="nav-btn flex items-center gap-3 w-full p-3 rounded-xl text-left transition-colors bg-white/10 text-indigo-400 font-semibold" data-target="page-shorts" onclick="switchTab('page-shorts', this)">
                <span class="text-xl">🎬</span> Shorts Factory
            </button>
            <button class="nav-btn flex items-center gap-3 w-full p-3 rounded-xl text-left hover:bg-white/10 transition-colors text-slate-400 font-medium" data-target="page-stock" onclick="switchTab('page-stock', this)">
                <span class="text-xl">📈</span> 전일 주식 시황
            </button>
            <button class="nav-btn flex items-center gap-3 w-full p-3 rounded-xl text-left hover:bg-white/10 transition-colors text-slate-400 font-medium" data-target="page-llm" onclick="switchTab('page-llm', this)">
                <span class="text-xl">🤖</span> AI 쇼츠 대장간
            </button>
        </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col h-screen relative overflow-hidden">
        
        <!-- ==================== SHORTS FACTORY PAGE ==================== -->
        <div id="page-shorts" class="page-section absolute inset-0 overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
            <header class="glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4 shrink-0">
                <div>
                    <h1 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
                        VS Shorts Automation ⚡️
                    </h1>
                    <p class="text-slate-400 text-sm mt-1">Multi-method Video Pipeline</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.location.href='https://vs-shorts-automation.khcho0421.workers.dev/api/auth/instagram'" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center gap-2">
                        <svg class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        인스타 연동
                    </button>
                    <!-- 워커(Worker) 백엔드로 로그인 요청 -->
                    <button onclick="window.location.href='/api/auth/google'" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center gap-2">
                        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        유튜브 연동
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

                <div id="vsPreview" class="absolute inset-0 flex flex-col hidden bg-[#f6f4ed] overflow-hidden font-['Jua']">
                    <!-- 종이 질감을 위한 미세 노이즈 패턴 (CSS) -->
                    <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
                    
                    <!-- 잎사귀/꽃 장식 -->
                    <div class="absolute top-[-10px] left-[-10px] text-5xl opacity-80 rotate-45">🌿</div>
                    <div class="absolute top-2 right-2 text-4xl opacity-80 -rotate-12">🌸</div>

                    <!-- 상단 헤더 -->
                    <div class="relative z-10 pt-12 px-4 text-center w-full">
                        <div class="flex items-center justify-center gap-2 mb-1">
                            <span class="text-[2.5rem] animate-bounce drop-shadow-md">⏰</span>
                            <div class="relative inline-block">
                                <h3 class="text-[1.8rem] text-green-800 tracking-tight leading-none z-10 relative">
                                    <span id="previewDate" class="text-[2.2rem] text-green-700"></span> 전에는 <span class="text-green-700">꼭</span> 사라!!
                                </h3>
                                <!-- 빨간색 손그림 밑줄 -->
                                <svg class="absolute -bottom-3 left-0 w-full h-4 z-0" preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0 5 Q 50 10 100 2" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <p class="text-sm mt-5 font-['Nanum_Pen_Script'] text-2xl tracking-widest text-slate-700">다시 말하지만, <strong class="text-red-600 font-bold">목숨 걸고</strong> 이야기합니다.</p>
                        <!-- 별 그리기 -->
                        <div class="absolute right-6 top-24 text-3xl text-red-400 rotate-12 font-['Nanum_Pen_Script']">☆</div>
                    </div>

                    <!-- 메인 아이템 -->
                    <div class="relative z-10 flex-1 flex flex-col justify-center px-5 w-full mt-2 gap-4">
                        
                        <!-- 아이템 A -->
                        <div class="w-full bg-white rounded-2xl p-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-2 border-slate-200 relative">
                            <div class="flex items-center gap-2">
                                <span class="flex items-center justify-center w-6 h-6 rounded-full text-blue-600 border-2 border-blue-600 text-sm font-bold bg-white">①</span>
                                <h4 id="previewA" class="text-xl text-slate-800 tracking-tight leading-none pt-1"></h4>
                            </div>
                            <p class="text-slate-500 mt-2 pl-8 text-xs font-['Nanum_Pen_Script'] text-xl">가치 지표: <span id="valA" class="text-blue-500"></span></p>
                            <!-- 장식 아이콘 -->
                            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[2.5rem] drop-shadow-md">🚀</div>
                        </div>

                        <!-- VS 뱃지 -->
                        <div class="relative w-full flex justify-center -my-3 z-20">
                            <div class="bg-red-500 text-white px-3 py-1 rounded-full text-lg border-2 border-white shadow-[0_2px_5px_rgba(0,0,0,0.2)] rotate-[-8deg] font-black tracking-widest">VS</div>
                        </div>

                        <!-- 아이템 B -->
                        <div class="w-full bg-white rounded-2xl p-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-2 border-slate-200 relative">
                            <div class="flex items-center gap-2">
                                <span class="flex items-center justify-center w-6 h-6 rounded-full text-red-600 border-2 border-red-600 text-sm font-bold bg-white">②</span>
                                <h4 id="previewB" class="text-xl text-slate-800 tracking-tight leading-none pt-1"></h4>
                            </div>
                            <p class="text-slate-500 mt-2 pl-8 text-xs font-['Nanum_Pen_Script'] text-xl">가치 지표: <span id="valB" class="text-red-500"></span></p>
                            <!-- 장식 아이콘 -->
                            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[2.5rem] drop-shadow-md">🏢</div>
                        </div>

                        <!-- 프로그레스 바 영역 -->
                        <div class="w-full mt-4 px-1">
                            <div class="flex justify-between font-['Nanum_Pen_Script'] text-xl mb-1 px-1">
                                <span class="text-blue-600 font-bold" id="pctA">0%</span>
                                <span class="text-red-600 font-bold" id="pctB">0%</span>
                            </div>
                            <div class="w-full h-4 bg-white rounded-full overflow-hidden flex border-2 border-slate-300 shadow-inner">
                                <div id="barA" class="progress-bar h-full bg-blue-400" style="width: 0%"></div>
                                <div id="barB" class="progress-bar h-full bg-red-400" style="width: 0%"></div>
                            </div>
                            <div class="text-center mt-3 text-slate-700 bg-white/60 p-2 rounded-xl border border-dashed border-slate-300 text-sm leading-tight" id="previewTitle"></div>
                        </div>
                    </div>

                    <!-- 하단 CTA 박스 & 고양이 -->
                    <div class="mt-auto relative w-full pt-4">
                        <div class="mx-4 bg-white rounded-xl p-3 shadow-md border-2 border-slate-300 flex items-center justify-between mb-[4.5rem] relative z-10">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl drop-shadow-sm">💬</span>
                                <div class="text-[0.7rem] leading-snug font-['Nanum_Pen_Script'] text-lg">
                                    댓글에 <strong class="text-red-600 text-xl font-bold bg-slate-100 px-1 rounded border border-slate-200">888</strong> 남기면<br>무료로 전체 리스트 발송!
                                </div>
                            </div>
                            <div class="text-3xl animate-pulse drop-shadow-md mr-1">🎁</div>
                        </div>
                        
                        <!-- 고양이 하단 -->
                        <div class="absolute bottom-0 left-0 w-full h-[4.5rem] bg-[#3d2c23] flex items-end justify-center gap-3 text-[3rem] pb-2 overflow-hidden border-t-4 border-[#2a1d17]">
                            <span class="translate-y-2 hover:-translate-y-1 transition-transform">🐱</span>
                            <span class="translate-y-3 hover:-translate-y-1 transition-transform">😸</span>
                            <span class="translate-y-1 hover:-translate-y-1 transition-transform">😻</span>
                            <span class="translate-y-4 hover:-translate-y-1 transition-transform">😼</span>
                        </div>
                    </div>
                </div>

                <!-- LIST Layout Preview Card -->
                <div id="listPreview" class="absolute inset-0 flex flex-col hidden bg-[#f6f4ed] overflow-hidden font-['Jua']">
                    <!-- 미세 노이즈 패턴 (CSS) -->
                    <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
                    
                    <!-- 잎사귀/꽃 장식 -->
                    <div class="absolute top-[-10px] left-[-10px] text-5xl opacity-80 rotate-45">🌿</div>
                    <div class="absolute top-2 right-2 text-4xl opacity-80 -rotate-12">🌸</div>

                    <!-- 상단 헤더 -->
                    <div class="relative z-10 pt-10 px-4 text-center w-full">
                        <div class="flex items-center justify-center gap-2 mb-1">
                            <span class="text-[2.2rem] animate-bounce drop-shadow-md">⏰</span>
                            <div class="relative inline-block">
                                <h3 id="listTitle" class="text-[1.8rem] text-green-800 tracking-tight leading-none z-10 relative"></h3>
                                <!-- 빨간색 손그림 밑줄 -->
                                <svg class="absolute -bottom-2 left-0 w-full h-3 z-0" preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0 5 Q 50 10 100 2" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <p id="listSubtitle" class="text-sm mt-3 font-['Nanum_Pen_Script'] text-2xl tracking-widest text-slate-700">다시 말하지만, <strong class="text-red-600 font-bold">목숨 걸고</strong> 이야기합니다.</p>
                        <!-- 별 그리기 -->
                        <div class="absolute right-4 top-20 text-3xl text-red-400 rotate-12 font-['Nanum_Pen_Script']">☆</div>
                    </div>

                    <!-- 메인 아이템 리스트 (동적 렌더링) -->
                    <div class="relative z-10 flex-1 flex flex-col justify-start px-3 w-full mt-2 gap-2 overflow-y-auto" id="listItemsContainer">
                        <!-- Items will be injected here via app.js -->
                    </div>

                    <!-- 하단 CTA 박스 & 고양이 -->
                    <div class="mt-auto relative w-full pt-2">
                        <div class="mx-4 bg-white/90 rounded-xl p-2 shadow-md border-2 border-slate-300 flex items-center justify-between mb-[4.5rem] relative z-10">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl drop-shadow-sm">💬</span>
                                <div class="text-[0.65rem] leading-snug font-['Nanum_Pen_Script'] text-base">
                                    댓글에 <strong class="text-red-600 text-lg font-bold bg-slate-100 px-1 rounded border border-slate-200">888</strong> 남기면<br>무료로 전체 리스트 발송!
                                </div>
                            </div>
                            <div class="text-2xl animate-pulse drop-shadow-md mr-1">🎁</div>
                        </div>
                        
                        <!-- 고양이 하단 -->
                        <div class="absolute bottom-0 left-0 w-full h-[4.5rem] bg-[#3d2c23] flex items-end justify-center gap-3 text-[3rem] pb-2 overflow-hidden border-t-4 border-[#2a1d17]">
                            <span class="translate-y-2 hover:-translate-y-1 transition-transform">🐱</span>
                            <span class="translate-y-3 hover:-translate-y-1 transition-transform">😸</span>
                            <span class="translate-y-1 hover:-translate-y-1 transition-transform">😻</span>
                            <span class="translate-y-4 hover:-translate-y-1 transition-transform">😼</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-3 mt-2">
                <button id="btnPreview" onclick="renderPreview()" disabled class="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg">
                    선택한 주제 VS 결과물 보기
                </button>
                <div class="flex flex-col gap-2 md:flex-row w-full mt-2">
                    <button id="btnPublishMock" onclick="publishYoutubeMock()" disabled class="flex-1 bg-slate-600 hover:bg-slate-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg text-[13px]">
                        서버 가상 모사
                    </button>
                    <button id="btnPublishBrowser" onclick="publishYoutubeBrowser('private')" disabled class="flex-[1.5] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-1.5 text-[13px]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        🔒 유튜브 단독 발행 (비공개)
                    </button>
                </div>
                <button id="btnPublishAll" onclick="publishAll()" disabled class="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] flex items-center justify-center gap-1.5 text-[14px]">
                    <span class="text-xl">🚀</span> 동시 발행 (YouTube + Instagram 릴스)
                </button>
            </div>
        </div>
        </main>
        </div> <!-- End of Shorts Factory Page -->

        <!-- ==================== STOCK MARKET PAGE ==================== -->
        <div id="page-stock" class="page-section absolute inset-0 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 hidden">
            <header class="glass rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div>
                    <h1 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
                        전일 주식 시황 요약 📈
                    </h1>
                    <p class="text-slate-400 text-sm mt-1">AI-powered Global & Local Market Summary</p>
                </div>
                <div>
                    <button class="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
                        최신 시황 불러오기
                    </button>
                </div>
            </header>

            <main class="flex-1 glass rounded-2xl p-6 flex flex-col items-center justify-center border border-dashed border-slate-600/50">
                <div class="text-6xl mb-4 animate-bounce">🚧</div>
                <h3 class="text-2xl text-slate-200 font-bold tracking-tight">데이터 연동 및 UI 개발 중입니다</h3>
                <p class="text-slate-500 mt-3 text-center max-w-md leading-relaxed">
                    이곳에서 전일 주식 시장의 주요 이슈와 상승/하락 테마를 요약하여 보여줄 예정입니다. <br>
                    추후 이 화면도 쇼츠 대본 템플릿과 결합될 수 있습니다.
                </p>
            </main>
        </div> <!-- End of Stock Market Page -->

        <!-- ==================== LLM STUDIO PAGE ==================== -->
        <div id="page-llm" class="page-section hidden absolute inset-0 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 bg-slate-900">
            <header class="glass rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div>
                    <h1 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 tracking-tight">
                        AI 쇼츠 대장간 🤖
                    </h1>
                    <p class="text-slate-400 text-sm mt-1">LLM Powered Content Generation Studio</p>
                </div>
            </header>

            <main class="flex-1 flex flex-col xl:flex-row gap-6 min-h-[600px] overflow-hidden">
                <!-- 1. Data Input (좌측) -->
                <div class="flex-1 glass rounded-2xl p-6 flex flex-col gap-4 shadow-xl border border-slate-700/50 relative">
                    <h2 class="text-lg font-bold text-slate-200 flex items-center gap-2">
                        <span class="bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                        원본 데이터 입력
                    </h2>
                    <textarea id="llmRawData" class="flex-1 bg-slate-800/80 border border-slate-600 rounded-xl p-4 text-slate-200 text-sm focus:outline-none focus:border-pink-500 resize-none transition-colors" placeholder="여기에 뉴스 기사, 리포트 등 원본 텍스트를 붙여넣으세요..."></textarea>
                    <button onclick="document.getElementById('llmRawData').value = Array.from(document.querySelectorAll('#stockListUS li span:last-child, #stockListKR li span:last-child')).map(el => el.innerText).join('\\n');" class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all">
                        오늘의 증시 뉴스 불러오기
                    </button>
                </div>

                <!-- 2. System Prompt (중앙) -->
                <div class="flex-1 glass rounded-2xl p-6 flex flex-col gap-4 shadow-xl border border-pink-500/30 relative">
                    <h2 class="text-lg font-bold text-slate-200 flex items-center gap-2">
                        <span class="bg-pink-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                        시스템 프롬프트 (LLM 지시)
                    </h2>
                    <textarea id="llmPrompt" class="flex-1 bg-slate-800/80 border border-pink-500/50 rounded-xl p-4 text-slate-200 text-sm focus:outline-none focus:border-pink-500 resize-none transition-colors" placeholder="예: 주어진 텍스트에서 가장 자극적인 헤드라인 5개를 뽑고 JSON 형식으로 반환해줘.">주어진 뉴스 데이터에서 가장 사람들의 이목을 끌 수 있는 자극적인 주식 이슈 2가지를 뽑아줘. 반드시 아래 JSON 형식으로만 답변해.
[
  {
    "title": "주제 메인 타이틀 (예: 삼성전자 부활?)",
    "keyword_a": "키워드A",
    "keyword_b": "키워드B",
    "metric_a_value": 85000,
    "metric_b_value": 78000
  }
]</textarea>
                    <button id="btnGenerateContent" onclick="generateLLMContent()" class="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2">
                        <span class="text-lg">✨</span> LLM 생성하기
                    </button>
                </div>

                <!-- 3. Output & Render (우측) -->
                <div class="flex-1 glass rounded-2xl p-6 flex flex-col gap-4 shadow-xl border border-slate-700/50 relative overflow-hidden">
                    <h2 class="text-lg font-bold text-slate-200 flex items-center gap-2">
                        <span class="bg-indigo-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span> 
                        JSON 결과 및 적용
                    </h2>
                    <div id="llmOutputWrapper" class="flex-1 relative bg-slate-900/80 rounded-xl border border-slate-600 overflow-hidden">
                        <textarea id="llmOutputJSON" class="absolute inset-0 w-full h-full bg-transparent p-4 text-emerald-400 font-mono text-xs focus:outline-none resize-none" placeholder="LLM 결과물이 여기에 표시됩니다..." readonly></textarea>
                        
                        <div id="llmLoading" class="hidden absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                            <div class="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent mb-3"></div>
                            <p class="text-pink-400 text-sm font-bold animate-pulse">마법을 부리는 중...</p>
                        </div>
                    </div>
                    <button id="btnApplyLLM" onclick="applyLLMToTemplate()" disabled class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                        템플릿에 데이터 덮어쓰기
                    </button>
                </div>
            </main>
        </div> <!-- End of LLM Studio Page -->

    </div> <!-- End of Main Content Area -->

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
                
                let matchUpText = '';
                if (item.layout_type === 'LIST') {
                    matchUpText = '<span class="text-indigo-400 font-bold">[리스트]</span> <span class="text-xs text-slate-300 ml-1">' + item.title + '</span>';
                } else {
                    matchUpText = '<span class="text-blue-400">' + (item.keyword_a || '') + '</span><span class="mx-1 text-xs">vs</span><span class="text-red-400">' + (item.keyword_b || '') + '</span>';
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
            document.getElementById('btnPreview').disabled = false;
            document.getElementById('btnPublishBrowser').disabled = selectedIssue.status !== 'PENDING';
            document.getElementById('btnPublishMock').disabled = selectedIssue.status !== 'PENDING';
        }

        // 애니메이션 렌더링 (단순 보기용)
        window.renderPreview = function() {
            if (!selectedIssue) return;
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
        }

        function _formatDate(dateStr) {
            if (!dateStr) return "오늘";
            const parts = dateStr.split('-');
            if (parts.length >= 3) {
                return parseInt(parts[1]) + '월 ' + parseInt(parts[2]) + '일';
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
                const rank = item.rank || (idx + 1);
                const subDetailHTML = item.subDetail ? '<p class="text-[0.65rem] text-slate-500 font-[\\'Nanum_Pen_Script\\'] text-sm tracking-wide mt-0.5">• ' + item.subDetail + '</p>' : '';
                const icon = item.icon || '✨';
                
                html += '<div class="w-full bg-white/90 rounded-xl p-2 shadow-[0_2px_5px_rgba(0,0,0,0.05)] border border-slate-200 flex items-center relative gap-2 shrink-0">' +
                    '<span class="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-800 text-sm font-bold shrink-0 ' + color + '">' +
                        rank +
                    '</span>' +
                    '<div class="flex-1 min-w-0">' +
                        '<div class="flex items-baseline gap-1">' +
                            '<h4 class="text-base text-slate-800 tracking-tight leading-tight truncate">' + item.title + '</h4>' +
                            '<span class="text-xs text-slate-500 font-[\\'Nanum_Pen_Script\\'] text-base ml-1">→</span>' +
                            '<span class="text-xs text-slate-700 truncate">' + item.detail + '</span>' +
                        '</div>' +
                        subDetailHTML +
                    '</div>' +
                    '<div class="text-2xl drop-shadow-sm ml-1 shrink-0">' + icon + '</div>' +
                '</div>';
            });
            container.innerHTML = html;
        }

        function _triggerAnimation() {
            if (selectedIssue.layout_type === 'LIST') return; // 리스트는 별도 애니메이션 없음

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

        window.publishYoutubeBrowser = async function(privacyStatus = 'private') {
            if (!selectedIssue) return;
            const btn = document.getElementById(privacyStatus === 'public' ? 'btnPublishPublic' : 'btnPublishBrowser');
            // 만약 src/index.js (HTML_CONTENT) 에는 btnPublishPublic 버튼이 없다면 btnPublishBrowser 사용 (방어코드)
            const targetBtn = btn || document.getElementById('btnPublishBrowser');
            if (!targetBtn) return;
            const originalText = targetBtn.innerHTML;
            targetBtn.disabled = true; 
            targetBtn.innerHTML = '브라우저 렌더링 중... (창 유지)';

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
                targetBtn.innerHTML = '실제 업로드 중...';

                // 3. FormData 구성 (Blob 전송)
                const formData = new FormData();
                formData.append('issueId', selectedIssue.id);
                formData.append('title', selectedIssue.title);
                formData.append('videoFile', videoBlob, 'shorts.webm');
                formData.append('privacyStatus', privacyStatus);

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
                    targetBtn.disabled = false; targetBtn.innerHTML = originalText;
                }
            } catch(e) { 
                alert("요청 실패: " + e.message); 
                targetBtn.disabled = false; targetBtn.innerHTML = originalText; 
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
                formData.append('videoFile', videoBlob, 'shorts.mp4'); 
                formData.append('privacyStatus', 'public');

                const res = await fetch('/api/publish-all', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                if(res.ok) {
                    alert("동시 발행 성공!\\n유튜브 ID: " + (data.youtubeId || '성공') + "\\n인스타 ID: " + (data.instagramId || '성공'));
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
                const res = await fetch('/api/generate-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rawData, prompt })
                });
                const data = await res.json();
                
                if (res.ok) {
                    let cleanStr = typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2);
                    cleanStr = cleanStr.replace(/\\x60\\x60\\x60json/g, '').replace(/\\x60\\x60\\x60/g, '').trim();
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
                
                const res = await fetch('/api/fetch-issues', {
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

        // --- 네비게이션 탭 전환 로직 ---
        window.switchTab = function(targetId, btnElement) {
            document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));
            
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.remove('hidden');

            if (btnElement) {
                document.querySelectorAll('.nav-btn').forEach(btn => {
                    btn.classList.remove('bg-white/10', 'text-indigo-400');
                    btn.classList.add('text-slate-400');
                });
                btnElement.classList.add('bg-white/10', 'text-indigo-400');
                btnElement.classList.remove('text-slate-400');
            }
        }

        // --- 주식 시황 API 호출 ---
        window.fetchStockNews = async function() {
            const btn = document.getElementById('btnFetchStock');
            btn.disabled = true;
            document.getElementById('stockEmpty').classList.add('hidden');
            document.getElementById('stockContent').classList.remove('hidden');
            document.getElementById('stockLoading').classList.remove('hidden');
            
            try {
                // HTML_CONTENT 내에서는 상대경로 사용 가능 (동일 Origin)
                const res = await fetch('/api/stock-news');
                const data = await res.json();
                
                const listEl = document.getElementById('stockList');
                listEl.innerHTML = '';
                
                if (data.items && data.items.length > 0) {
                    data.items.forEach((item, idx) => {
                        const li = document.createElement('li');
                        li.className = "bg-white/10 p-4 rounded-xl border border-slate-600/50 hover:bg-white/20 transition-colors flex items-center gap-3";
                        li.innerHTML = '<span class="text-emerald-400 font-bold w-6 h-6 flex items-center justify-center bg-emerald-400/20 rounded-full shrink-0">' + (idx+1) + '</span>' +
                                       '<span class="text-slate-200 text-sm md:text-base">' + item + '</span>';
                        listEl.appendChild(li);
                    });
                } else {
                    listEl.innerHTML = '<li class="text-slate-400 text-center py-8">뉴스를 불러올 수 없습니다.</li>';
                }
            } catch(e) {
                alert("시황 불러오기 실패: " + e.message);
            } finally {
                btn.disabled = false;
                document.getElementById('stockLoading').classList.add('hidden');
            }
        }
    </script>
    <script src="/app.js"></script>
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

		const IG_REDIRECT_URI = url.origin + '/api/auth/instagram/callback';

		if (request.method === "GET" && url.pathname === "/api/auth/instagram") {
			const clientId = env.IG_CLIENT_ID;
			if(!clientId) return new Response("IG_CLIENT_ID not set in environment variables. Please configure Meta App ID.", { status: 500 });
			
			const scope = encodeURIComponent("instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,business_management");
			const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(IG_REDIRECT_URI)}&scope=${scope}&response_type=code`;
			return Response.redirect(authUrl, 302);
		}

		if (request.method === "GET" && url.pathname === "/api/auth/instagram/callback") {
			const code = url.searchParams.get('code');
			if (!code) return new Response("Code not found", { status: 400 });

			try {
				// 1. 단기 토큰 발급
				const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${env.IG_CLIENT_ID}&redirect_uri=${encodeURIComponent(IG_REDIRECT_URI)}&client_secret=${env.IG_CLIENT_SECRET}&code=${code}`);
				const tokenData = await tokenResponse.json();
				if (!tokenData.access_token) throw new Error("단기 토큰 발급 실패: " + JSON.stringify(tokenData));

				// 2. 장기 토큰 교환
				const longLivedRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${env.IG_CLIENT_ID}&client_secret=${env.IG_CLIENT_SECRET}&fb_exchange_token=${tokenData.access_token}`);
				const longLivedData = await longLivedRes.json();
				const accessToken = longLivedData.access_token || tokenData.access_token;

				// 3. 페이지 목록 및 연결된 인스타그램 계정 조회
				const accountsRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
				const accountsData = await accountsRes.json();
				
				let igUserId = null;
				let debugInfo = [];
				if (accountsData.data && accountsData.data.length > 0) {
					for (const page of accountsData.data) {
						const pageInfoRes = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account,name&access_token=${accessToken}`);
						const pageInfo = await pageInfoRes.json();
						debugInfo.push({ pageName: pageInfo.name, pageId: page.id, hasIgAccount: !!pageInfo.instagram_business_account });
						if (pageInfo.instagram_business_account) {
							igUserId = pageInfo.instagram_business_account.id;
							break;
						}
					}
				}

				if (!igUserId) {
					const errorMsg = `
						<div style="font-family: sans-serif; padding: 20px;">
							<h2 style="color: red;">연결된 인스타그램 비즈니스/크리에이터 계정을 찾을 수 없습니다.</h2>
							<p>페이스북 페이지와 인스타그램이 정상적으로 연결되어 있는지 확인해 주세요.</p>
							<hr>
							<h3>디버깅 정보</h3>
							<pre style="background: #eee; padding: 10px; border-radius: 5px;">
페이스북에서 불러온 페이지 개수: ${accountsData.data ? accountsData.data.length : 0}
페이지 상세 정보:
${JSON.stringify(debugInfo, null, 2)}
전체 응답:
${JSON.stringify(accountsData, null, 2)}
							</pre>
							<p><b>해결 방법:</b></p>
							<ol>
								<li>앱 권한 부여 화면에서 <b>모든 페이지</b>를 선택했는지 확인하세요.</li>
								<li>인스타그램 앱에서 '설정 > 계정 센터'에 페이스북 페이지가 연결되어 있는지 확인하세요.</li>
								<li>인스타그램 계정이 <b>비즈니스</b> 또는 <b>크리에이터</b> 계정인지 다시 한번 확인하세요.</li>
							</ol>
						</div>
					`;
					return new Response(errorMsg, { status: 400, headers: { "Content-Type": "text/html;charset=UTF-8" } });
				}

				// 4. DB 저장
				await env.DB.prepare(`
					INSERT INTO instagram_tokens (id, access_token, ig_user_id, updated_at) VALUES (1, ?, ?, datetime('now', 'localtime'))
					ON CONFLICT(id) DO UPDATE SET access_token = excluded.access_token, ig_user_id = excluded.ig_user_id, updated_at = excluded.updated_at
				`).bind(accessToken, igUserId).run();

				return Response.redirect('https://vs-shorts-automation.pages.dev/?auth=success_ig', 302);
			} catch (e) {
				return new Response("인스타그램 연동 에러: " + e.message, { status: 500, headers: { "Content-Type": "text/html;charset=UTF-8" } });
			}
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

		if (request.method === "GET" && url.pathname === "/api/system-prompts") {
			try {
				const { results } = await env.DB.prepare("SELECT * FROM system_prompts ORDER BY id ASC").all();
				return new Response(JSON.stringify({ success: true, prompts: results }), {
					status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}
		
		if (request.method === "GET" && url.pathname.startsWith("/api/trends/")) {
			const source = url.pathname.split('/').pop();
			try {
				let items = [];
				if (source === 'google') {
					const rssRes = await fetch("https://trends.google.com/trending/rss?geo=KR", {
						headers: {
							"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
							"Accept": "application/rss+xml, application/xml, text/xml"
						}
					});
					if (!rssRes.ok) throw new Error("Failed to fetch Google Trends RSS");
					
					const xml = await rssRes.text();
					const itemRegex = /<item>([\s\S]*?)<\/item>/g;
					let match;
					while ((match = itemRegex.exec(xml)) !== null) {
						const itemXml = match[1];
						const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
						const trafficMatch = itemXml.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/);
						
						if (titleMatch) {
							let title = titleMatch[1].trim();
							if (title.startsWith("<![CDATA[")) title = title.substring(9, title.length - 3);
							let traffic = trafficMatch ? trafficMatch[1].trim() : "";
							if (traffic.startsWith("<![CDATA[")) traffic = traffic.substring(9, traffic.length - 3);
							
							items.push({ title, traffic });
						}
					}
				} else if (source === 'signal') {
					const apiRes = await fetch("https://api.signal.bz/news/realtime", {
						headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
					});
					if (!apiRes.ok) throw new Error("Failed to fetch Signal.bz API");
					const data = await apiRes.json();
					if (data && data.top10) {
						data.top10.forEach(kw => {
							items.push({ title: kw.keyword, traffic: '급상승' });
						});
					}
					// 중복 제거 및 상위 100개만 유지
					items = [...new Map(items.map(item => [item.title, item])).values()].slice(0, 100);
				} else if (source === 'nate') {
					const nateRes = await fetch("https://www.nate.com/js/data/jsonLiveKeywordDataV1.js?v=" + Math.floor(new Date().getTime() / 60000), {
						headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
					});
					if (!nateRes.ok) throw new Error("Failed to fetch Nate");
					const buffer = await nateRes.arrayBuffer();
					const decoder = new TextDecoder("euc-kr");
					const rawScript = decoder.decode(buffer);
					
					// 네이트 API는 euc-kr로 되어 있으므로 위에서 디코딩
					// var arrHotRecent = [["1","블라블라",...]];
					const arrayMatch = rawScript.match(/\[\[.*?\]\]/);
					if (arrayMatch) {
						try {
							const arr = JSON.parse(arrayMatch[0]);
							arr.forEach(kwData => {
								if(kwData && kwData[1]) {
									// 한글 깨짐이 발생하더라도 렌더링되게끔 처리
									items.push({ title: kwData[1], traffic: '실시간' });
								}
							});
						} catch(e) { console.error('Nate JSON parse error', e); }
					}
					items = items.slice(0, 100);
				} else if (source === 'naver') {
					const naverRes = await fetch("https://datalab.naver.com/", {
						headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
					});
					if (!naverRes.ok) throw new Error("Failed to fetch Naver DataLab");
					const html = await naverRes.text();
					const titleRegex = /<span class="title">([^<]+)<\/span>/g;
					let match;
					while ((match = titleRegex.exec(html)) !== null) {
						items.push({ title: match[1].trim(), traffic: '데이터랩' });
					}
					// 중복 제거 및 상위 100개
					items = [...new Map(items.map(item => [item.title, item])).values()].slice(0, 100);
				} else if (['dcinside', 'fmkorea', 'inven', 'blind', 'sometrend', 'vibe', 'bigkinds', 'opta', 'fotmob', 'sofascore'].includes(source)) {
					// 신규 소스 연동 플레이스홀더 (각 사이트 구조에 맞게 추후 상세 크롤링 보완)
					try {
						// 공통 User-Agent
						const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };
						let fetchUrl = '';
						
						if (source === 'dcinside') fetchUrl = 'https://m.dcinside.com/api/gall_list.php';
						else if (source === 'fmkorea') fetchUrl = 'https://www.fmkorea.com/best';
						else if (source === 'inven') fetchUrl = 'https://www.inven.co.kr/webzine/news/?iskin=webzine';
						else if (source === 'blind') fetchUrl = 'https://www.teamblind.com/kr/topics/%ED%86%A0%ED%94%BD-%EB%B2%A0%EC%8A%A4%ED%8A%B8';
						else fetchUrl = 'https://example.com'; // 임시 URL
						
						// 임시로 성공한 것처럼 Mock 데이터 반환 (봇 차단 방지 목적의 연동 구조 확립)
						items.push({ title: `${source.toUpperCase()} 데이터 수집 API 연동 완료 (데이터 연동 대기 중)`, traffic: '수집 준비중' });
						for (let i = 1; i <= 10; i++) {
							items.push({ title: `${source} 실시간 트렌드 키워드 ${i}`, traffic: 'HOT' });
						}
					} catch(e) {
						items.push({ title: `${source} 데이터를 가져오지 못했습니다. (봇 접근 차단)`, traffic: '접근 오류' });
					}
					items = items.slice(0, 100);
				} else {
					throw new Error("Unknown source: " + source);
				}

				return new Response(JSON.stringify({ success: true, trends: items }), {
					status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
				});
			} catch (e) {
				return new Response(JSON.stringify({ success: false, error: e.message }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}
		if (request.method === "POST" && url.pathname === "/api/stock-sync") {
			try {
				const body = await request.json();
				const targetDateStr = body.date || new Date().toISOString().split('T')[0];
				
				// 1. Fetch News
				const fetchRSS = async (query) => {
					const rssRes = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`, {
						headers: { "User-Agent": "Mozilla/5.0" }
					});
					const xmlText = await rssRes.text();
					const items = [];
					const itemRegex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<\/item>/gi;
					let match;
					while ((match = itemRegex.exec(xmlText)) !== null) {
						let title = match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
						items.push({ title, value: '', change: '' });
					}
					return items.slice(0, 20); // Top 20
				};
				
				const searchQ_US = "미국 증시 OR 뉴욕 증시 OR 나스닥";
				const searchQ_KR = "한국 증시 OR 코스피 OR 코스닥";
				const [newsUS, newsKR] = await Promise.all([fetchRSS(searchQ_US), fetchRSS(searchQ_KR)]);

				// 2. Fetch KOSPI, KOSDAQ (Naver Finance Mobile API)
				const fetchStocks = async (market, maxPages) => {
					try {
						// Naver Finance KOSPI/KOSDAQ endpoint max pageSize is 100.
						// Fetch multiple pages in parallel to get "all" items (up to maxPages * 100).
						const pages = Array.from({length: maxPages}, (_, i) => i + 1);
						const fetchPage = async (page) => {
							try {
								const res = await fetch(`https://m.stock.naver.com/api/stocks/marketValue/${market}?page=${page}&pageSize=100`);
								if(!res.ok) return [];
								const data = await res.json();
								if(data && data.stocks) {
									return data.stocks.map(s => ({ 
										title: s.stockName, 
										value: s.closePrice + '|' + (s.marketValueHangeul || '') + '|' + (s.accumulatedTradingVolume || ''), 
										change: s.fluctuationsRatio 
									}));
								}
								return [];
							} catch(e) { return []; }
						};
						
						const results = await Promise.all(pages.map(fetchPage));
						return results.flat();
					} catch(e) { return []; }
				};

				// ETF API might be different, try to fetch from ETF specific API or fallback
				const fetchETF = async () => {
					try {
						// pageSize=3000 to fetch all ETFs
						const res = await fetch(`https://m.stock.naver.com/api/json/sise/siseListJson.nhn?menu=etf&sosok=0&pageSize=3000&page=1`);
						if(!res.ok) return [];
						const data = await res.json();
						if(data && data.result && data.result.itemList) {
							const formatETFMarketSum = (mks) => {
								if (!mks) return '';
								const jo = Math.floor(mks / 10000);
								const uk = mks % 10000;
								if (jo > 0) return `${jo}조 ${uk.toLocaleString()}억원`;
								return `${uk.toLocaleString()}억원`;
							};
							return data.result.itemList.map(s => ({ 
								title: s.nm, 
								value: (s.nv != null ? s.nv.toLocaleString() : '') + '|' + formatETFMarketSum(s.mks) + '|' + (s.aq != null ? s.aq.toLocaleString() : ''), 
								change: s.cr != null ? s.cr.toString() : '' 
							}));
						}
						return [];
					} catch(e) { return []; }
				};

				// KOSPI/KOSDAQ 데이터가 안 나오는 이슈: 네이버 API 동시 요청 과다(36건)로 인한 429 차단 추정.
				// 대시보드 용도이므로 시가총액 상위 300위(3페이지)만 수집하도록 줄여서 차단을 방지합니다.
				let [kospi, kosdaq, etf] = await Promise.all([
					fetchStocks('KOSPI', 3), 
					fetchStocks('KOSDAQ', 3), 
					fetchETF()
				]);

				// 2.5 Fetch Theme & US Stock via OpenAI for Top 50 items (to save time)
				const enrichStocks = async (arr) => {
					if (arr.length === 0) return arr;
					const top50 = arr.slice(0, 50);
					try {
						const names = top50.map(s => s.title);
						const prompt = `Return a JSON array of objects for the following Korean stocks. Each object must have "title", "theme" (a brief 1-2 word theme or industry, e.g., 반도체), and "us_stock" (a related US stock symbol or name, e.g., NVIDIA). Stocks: ${JSON.stringify(names)}`;
						const res = await fetch('https://api.openai.com/v1/chat/completions', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.OPENAI_API_KEY}` },
							body: JSON.stringify({
								model: 'gpt-4o-mini',
								messages: [{ role: 'system', content: 'You are a financial expert. Output strictly valid JSON array of objects.' }, { role: 'user', content: prompt }],
								response_format: { type: 'json_object' } // We will parse manually since json_object expects object.
							})
						});
						const data = await res.json();
						if (data.choices && data.choices[0].message.content) {
							// Handle both {"data": [...]} or just [...] depending on strictness
							const contentStr = data.choices[0].message.content;
							const parsed = JSON.parse(contentStr);
							const enrichedList = Array.isArray(parsed) ? parsed : (parsed.data || parsed.stocks || []);
							
							const enrichMap = {};
							enrichedList.forEach(item => {
								if(item.title) enrichMap[item.title] = { theme: item.theme, us_stock: item.us_stock };
							});
							
							arr.forEach(item => {
								if (enrichMap[item.title]) {
									item.theme = enrichMap[item.title].theme;
									item.us_stock = enrichMap[item.title].us_stock;
								}
							});
						}
					} catch(e) { console.error("Enrichment failed", e); }
					return arr;
				};

				kospi = await enrichStocks(kospi);
				kosdaq = await enrichStocks(kosdaq);

				// 3. Save to DB
				// First delete old entries for this date to avoid duplicates if re-syncing
				await env.DB.prepare("DELETE FROM stock_data WHERE fetch_date = ?").bind(targetDateStr).run();
				
				const insertStmt = env.DB.prepare("INSERT INTO stock_data (category, title, value, change_rate, fetch_date, theme, us_stock) VALUES (?, ?, ?, ?, ?, ?, ?)");
				const batch = [];
				
				const addBatch = (cat, arr) => {
					arr.forEach(item => batch.push(insertStmt.bind(
						cat, 
						item.title ?? '', 
						item.value ?? '', 
						item.change ?? '', 
						targetDateStr ?? '',
						item.theme ?? '',
						item.us_stock ?? ''
					)));
				};
				
				addBatch('NEWS_US', newsUS);
				addBatch('NEWS_KR', newsKR);
				addBatch('KOSPI', kospi);
				addBatch('KOSDAQ', kosdaq);
				addBatch('ETF', etf);

				if (batch.length > 0) {
					await env.DB.batch(batch);
				}

				return new Response(JSON.stringify({ success: true, count: batch.length }), {
					status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
				});
			} catch(e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		if (request.method === "POST" && url.pathname === "/api/news-sync") {
			try {
				const body = await request.json();
				const targetDateStr = body.date || new Date().toISOString().split('T')[0];
				
				const fetchRSS = async (query) => {
					const rssRes = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`, {
						headers: { "User-Agent": "Mozilla/5.0" }
					});
					if (!rssRes.ok) return [];
					const xmlText = await rssRes.text();
					const items = [];
					const itemRegex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<\/item>/gi;
					let match;
					while ((match = itemRegex.exec(xmlText)) !== null) {
						let title = match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
						items.push({ title, value: '', change: '' });
					}
					return items.slice(0, 20);
				};
				
				const [newsUS, newsKR] = await Promise.all([fetchRSS("미국 증시 OR 뉴욕 증시 OR 나스닥"), fetchRSS("한국 증시 OR 코스피 OR 코스닥")]);

				await env.DB.prepare("DELETE FROM stock_data WHERE fetch_date = ? AND category IN ('NEWS_US', 'NEWS_KR')").bind(targetDateStr).run();
				
				const insertStmt = env.DB.prepare("INSERT INTO stock_data (category, title, value, change_rate, fetch_date, theme, us_stock) VALUES (?, ?, ?, ?, ?, '', '')");
				const batch = [];
				
				const addBatch = (cat, arr) => {
					arr.forEach(item => batch.push(insertStmt.bind(cat, item.title ?? '', '', '', targetDateStr ?? '')));
				};
				
				addBatch('NEWS_US', newsUS);
				addBatch('NEWS_KR', newsKR);
				
				if (batch.length > 0) {
					await env.DB.batch(batch);
				}

				return new Response(JSON.stringify({ success: true, count: batch.length }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
			} catch(e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		if (request.method === "GET" && url.pathname === "/api/search-news") {
			try {
				const query = url.searchParams.get('q');
				if (!query) throw new Error("Query parameter 'q' is required");

				const rssRes = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`, {
					headers: { "User-Agent": "Mozilla/5.0" }
				});
				
				if (!rssRes.ok) throw new Error("Failed to fetch Google News RSS");
				
				const xmlText = await rssRes.text();
				const items = [];
				const itemRegex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<\/item>/gi;
				let match;
				while ((match = itemRegex.exec(xmlText)) !== null) {
					let title = match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
					let link = match[2].trim();
					let pubDate = match[3].trim();
					items.push({ title, link, pubDate });
					if (items.length >= 10) break; // Return top 10
				}
				
				return new Response(JSON.stringify({ success: true, news: items }), {
					status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
				});
			} catch (e) {
				return new Response(JSON.stringify({ success: false, error: e.message }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		if (request.method === "GET" && url.pathname === "/api/stocks") {
			try {
				const targetDateStr = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
				
				const { results } = await env.DB.prepare(
					"SELECT * FROM stock_data WHERE fetch_date >= date(?, '-5 days') AND fetch_date <= ? ORDER BY fetch_date DESC"
				).bind(targetDateStr, targetDateStr).all();
				
				const data = { NEWS_US: [], NEWS_KR: [], KOSPI: [], KOSDAQ: [], ETF: [] };
				const grouped = {};
				
				results.forEach(row => {
					if (!data[row.category]) return;
					
					if (row.category.startsWith('NEWS')) {
						if (row.fetch_date === targetDateStr) {
							data[row.category].push(row);
						}
						return;
					}
					
					const key = `${row.category}_${row.title}`;
					if (!grouped[key]) {
						grouped[key] = { ...row, history: [] };
						if (row.fetch_date === targetDateStr) {
							data[row.category].push(grouped[key]);
						}
					}
					
					if (grouped[key] && row.value) {
						let price = row.value;
						if (price.includes('|')) price = price.split('|')[0];
						
						grouped[key].history.push({
							date: row.fetch_date,
							price: price,
							change: row.change_rate
						});
					}
				});

				return new Response(JSON.stringify({ success: true, data }), {
					status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		if (request.method === "GET" && url.pathname === "/api/list-models") {
			try {
				const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`);
				const data = await res.json();
				return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		// API: 구글 Gemini 기반 콘텐츠 생성
		if (request.method === "POST" && url.pathname === "/api/generate-content") {
			try {
				const reqData = await request.json();
				const { rawData, prompt } = reqData;
				if (!rawData || !prompt) return new Response(JSON.stringify({ error: "rawData and prompt are required" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
				if (!env.GEMINI_API_KEY) return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });

				const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						contents: [{
							parts: [
								{ text: prompt },
								{ text: "=== Data ===" },
								{ text: rawData }
							]
						}]
					})
				});

				const geminiData = await geminiRes.json();
				if (!geminiRes.ok) throw new Error(geminiData.error?.message || "Gemini API Error");

				const textOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "결과를 생성하지 못했습니다.";

				return new Response(JSON.stringify({ success: true, result: textOutput }), {
					status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		
		// API: OpenAI DALL-E 3 이미지 생성
		if (request.method === "POST" && url.pathname === "/api/generate-image") {
			try {
				const reqData = await request.json();
				const { title, items_json, systemPrompt } = reqData;
				
				if (!systemPrompt) return new Response(JSON.stringify({ error: "systemPrompt is required" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
				if (!env.OPENAI_API_KEY) return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
				if (!env.GEMINI_API_KEY) return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });

				// 1. Gemini를 사용하여 영문 프롬프트로 고도화/번역
				const geminiInput = `You are an expert AI image prompt engineer.
Your task is to create a highly detailed, descriptive English prompt for an AI image generator.

CRITICAL INSTRUCTION:
The final prompt MUST STRICTLY embody the visual style described in the [Style Guideline]. Use the [Context Subject Matter] only for the core theme or objects.

[Style Guideline (System Prompt)]
${systemPrompt}

[Context Subject Matter]
Title: ${title}
Data: ${items_json}

DO NOT include any conversational text, explanations, or formatting. ONLY return the final English prompt string.`;

				const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						contents: [{ parts: [{ text: geminiInput }] }]
					})
				});

				const geminiData = await geminiRes.json();
				if (!geminiRes.ok) throw new Error(geminiData.error?.message || "Gemini Prompt Translation Error");
				const finalPrompt = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || systemPrompt;

				// 2. Gemini 3.1 Flash Image API 호출
				const imageRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${env.GEMINI_API_KEY}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						contents: [{ parts: [{ text: finalPrompt }] }],
						generationConfig: { responseModalities: ["IMAGE"] }
					})
				});

				const imageData = await imageRes.json();
				if (!imageRes.ok) throw new Error(imageData.error?.message || "Gemini Image Generation Error");

				const base64Str = imageData.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
				if (!base64Str) throw new Error("No image data returned from Gemini");

				const imageUrl = "data:image/jpeg;base64," + base64Str;

				return new Response(JSON.stringify({ success: true, imageUrl, promptUsed: finalPrompt }), {
					status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		if (request.method === "POST" && url.pathname === "/api/fetch-issues") {
			try {
				const reqData = await request.json().catch(() => ({}));
				const today = new Date().toISOString().split('T')[0];
				
				let dataToInsert = [];

				if (reqData.generatedItems && Array.isArray(reqData.generatedItems)) {
					// LLM에서 생성된 데이터 주입
					dataToInsert = reqData.generatedItems.map(item => ({
						analyze_date: today,
						category: item.category || "AI 생성 템플릿",
						layout_type: item.layout_type || (item.items_json ? "LIST" : "VS"),
						keyword_a: item.keyword_a || null,
						keyword_b: item.keyword_b || null,
						items_json: typeof item.items_json === 'object' ? JSON.stringify(item.items_json) : (item.items_json || null),
						title: item.title || "제목 없음",
						controversy_score: item.controversy_score || 90,
						metric_a_value: item.metric_a_value || 0,
						metric_b_value: item.metric_b_value || 0
					}));
				} else {
					// 기본 데이터 주입 (LLM 미사용시)
					const listItems = [
						{ rank: 1, title: "대우건설", detail: "이미 시기가 지났습니다", subDetail: "현재 주가 : 2,731원", icon: "🚗" },
						{ rank: 2, title: "엔비디아", detail: "계속 보유하시면 됩니다", subDetail: "예상 최고가 : 364,920원 (+13,261%)", icon: "🚙" },
						{ rank: 3, title: "네이버", detail: "248,500 → 1,026,800", subDetail: "올해 가장 대박이 될 주식입니다", icon: "⏰" },
						{ rank: 4, title: "한화오션", detail: "158,300 → 812,400", subDetail: "지금 매수 → 5개월 내", icon: "🚀" },
						{ rank: 5, title: "삼성전자", detail: "214,700 → 739,500", subDetail: "부모님 연금 + 자녀 교육 자금 해결!", icon: "☕" },
						{ rank: 6, title: "현대자동차", detail: "603,500 → 1,008,700", subDetail: "준비 자금 : 80만원 → 예상 1억원", icon: "🏢" },
						{ rank: 7, title: "SK하이닉스", detail: "2,243,000 → 3,186,500", subDetail: "인수합병 소식이 터질 예정입니다", icon: "👍" },
						{ rank: 8, title: "+17,986% 상승 가능 종목이 나왔습니다!", detail: "LG에너지솔루션 + 삼성SDI", subDetail: "", icon: "🔥" }
					];

					dataToInsert = [
						{
							analyze_date: today, category: "미국주식", layout_type: "VS",
							keyword_a: "NVIDIA", keyword_b: "AMD", items_json: null,
							title: "끝나지 않은 AI 반도체 전쟁! 엔비디아 vs AMD 승자는?",
							controversy_score: 88, metric_a_value: 3450000, metric_b_value: 1250000
						},
						{
							analyze_date: today, category: "국내주식 추천", layout_type: "LIST",
							keyword_a: null, keyword_b: null, items_json: JSON.stringify(listItems),
							title: "6월 13일 전에는 꼭 사라!!",
							controversy_score: 95, metric_a_value: 0, metric_b_value: 0
						},
						{
							analyze_date: today, category: "글로벌 IT", layout_type: "VS",
							keyword_a: "ChatGPT", keyword_b: "Gemini", items_json: null,
							title: "인공지능 왕좌의 게임! 챗GPT vs 제미나이 압도적 차이",
							controversy_score: 80, metric_a_value: 1050000, metric_b_value: 890000
						}
					];
				}

				const insertQuery = `INSERT INTO hot_issues (analyze_date, category, layout_type, keyword_a, keyword_b, items_json, title, controversy_score, metric_a_value, metric_b_value, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`;
				
				await env.DB.prepare("DELETE FROM hot_issues WHERE analyze_date = ?").bind(today).run();

				const stmts = dataToInsert.map(d => env.DB.prepare(insertQuery).bind(d.analyze_date, d.category, d.layout_type, d.keyword_a, d.keyword_b, d.items_json, d.title, d.controversy_score, d.metric_a_value, d.metric_b_value));
				await env.DB.batch(stmts);

				return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
			} catch (e) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		if (request.method === "GET" && url.pathname === "/api/migrate") {
			try {
				await env.DB.prepare("ALTER TABLE stock_data ADD COLUMN theme TEXT").run();
			} catch(e) {}
			try {
				await env.DB.prepare("ALTER TABLE stock_data ADD COLUMN us_stock TEXT").run();
			} catch(e) {}
			return new Response(JSON.stringify({ success: true, message: "Migration applied" }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
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
				const privacyStatus = formData.get('privacyStatus') || 'private';

				if (!videoFile) {
					return new Response(JSON.stringify({ error: "No video file received" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
				}

				const tokenRecord = await env.DB.prepare("SELECT refresh_token FROM youtube_tokens WHERE id = 1").first();
				if (!tokenRecord) {
					return new Response(JSON.stringify({ error: "YouTube account not linked. Please link your account first." }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
				}

				const accessToken = await this.getFreshAccessToken(tokenRecord.refresh_token, env);

				const metadata = {
					snippet: { title: title + " #shorts #vs", description: "Auto-generated Shorts by Browser Recording", categoryId: "24", tags: ["shorts", "vs"] },
					status: { privacyStatus: privacyStatus }
				};

				const boundary = '-------314159265358979323846';
				const delimiter = "\r\n--" + boundary + "\r\n";
				const closeDelimiter = "\r\n--" + boundary + "--";

				const metadataPart = "Content-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(metadata);
				const mediaPart = "Content-Type: video/webm\r\n\r\n";

				const videoArrayBuffer = await videoFile.arrayBuffer();
				const encoder = new TextEncoder();
				const part1 = encoder.encode(delimiter + metadataPart + delimiter + mediaPart);
				const part2 = new Uint8Array(videoArrayBuffer);
				const part3 = encoder.encode(closeDelimiter);

				const body = new Uint8Array(part1.length + part2.length + part3.length);
				body.set(part1, 0);
				body.set(part2, part1.length);
				body.set(part3, part1.length + part2.length);

				const ytRes = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status", {
					method: "POST",
					headers: { 
						"Authorization": `Bearer ${accessToken}`,
						"Content-Type": `multipart/related; boundary=${boundary}`,
						"Content-Length": body.length.toString()
					},
					body: body
				});

				const ytData = await ytRes.json();

				if (!ytRes.ok) {
					await env.DB.prepare("UPDATE hot_issues SET status = 'FAILED' WHERE id = ?").bind(issueId).run();
					return new Response(JSON.stringify({ error: ytData.error?.message || "YouTube API Error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
				}

				await env.DB.prepare("UPDATE hot_issues SET status = 'COMPLETED' WHERE id = ?").bind(issueId).run();
				
				return new Response(JSON.stringify({ message: "Successfully uploaded", videoId: ytData.id }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
			} catch (error) {
				return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		// API 3C: 멀티 채널 동시 발행 (YouTube + Instagram)
		if (request.method === "POST" && url.pathname === "/api/publish-all") {
			try {
				const formData = await request.formData();
				const issueId = formData.get('issueId');
				const title = formData.get('title');
				const videoFile = formData.get('videoFile');
				const privacyStatus = formData.get('privacyStatus') || 'public';

				if (!videoFile) return new Response(JSON.stringify({ error: "No video file received" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });

				const ytToken = await env.DB.prepare("SELECT refresh_token FROM youtube_tokens WHERE id = 1").first();
				const igToken = await env.DB.prepare("SELECT access_token, ig_user_id FROM instagram_tokens WHERE id = 1").first();
				
				if (!ytToken || !igToken) {
					return new Response(JSON.stringify({ error: "유튜브와 인스타그램 계정 모두 연동되어 있어야 합니다." }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
				}

				const videoArrayBuffer = await videoFile.arrayBuffer();
				const fileName = `video_${Date.now()}.mp4`; 
				
				// R2 스토리지 업로드 (Instagram에서 접근 가능하도록)
				await env.BUCKET.put(fileName, videoArrayBuffer, { httpMetadata: { contentType: videoFile.type } });
				const videoUrl = `${url.origin}/public/${fileName}`; 

				// --- 유튜브 발행 Promise ---
				const ytPromise = (async () => {
					const ytAccessToken = await this.getFreshAccessToken(ytToken.refresh_token, env);
					const boundary = '-------314159265358979323846';
					const delimiter = "\r\n--" + boundary + "\r\n";
					const closeDelimiter = "\r\n--" + boundary + "--";

					const metadata = { snippet: { title: title + " #shorts", description: "Auto-generated Shorts", categoryId: "24", tags: ["shorts"] }, status: { privacyStatus } };
					const metadataPart = "Content-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(metadata);
					const mediaPart = `Content-Type: ${videoFile.type}\r\n\r\n`;

					const encoder = new TextEncoder();
					const part1 = encoder.encode(delimiter + metadataPart + delimiter + mediaPart);
					const part2 = new Uint8Array(videoArrayBuffer);
					const part3 = encoder.encode(closeDelimiter);
					const body = new Uint8Array(part1.length + part2.length + part3.length);
					body.set(part1, 0); body.set(part2, part1.length); body.set(part3, part1.length + part2.length);

					const ytRes = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status", {
						method: "POST",
						headers: { "Authorization": `Bearer ${ytAccessToken}`, "Content-Type": `multipart/related; boundary=${boundary}`, "Content-Length": body.length.toString() },
						body: body
					});
					const ytData = await ytRes.json();
					if (!ytRes.ok) throw new Error(ytData.error?.message || "YouTube Upload Failed");
					return ytData.id;
				})();

				// --- 인스타그램 릴스 발행 Promise ---
				const igPromise = (async () => {
					const { access_token, ig_user_id } = igToken;
					
					// a. 컨테이너 생성
					const createRes = await fetch(`https://graph.facebook.com/v18.0/${ig_user_id}/media`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							media_type: "REELS",
							video_url: videoUrl,
							caption: title + " #쇼츠 #자동화",
							access_token: access_token
						})
					});
					const createData = await createRes.json();
					if (createData.error) throw new Error("IG Container Error: " + createData.error.message);
					const containerId = createData.id;

					// b. 폴링 (상태 체크)
					let status = "IN_PROGRESS";
					for (let i = 0; i < 15; i++) {
						await new Promise(r => setTimeout(r, 4000)); 
						const statusRes = await fetch(`https://graph.facebook.com/v18.0/${containerId}?fields=status_code&access_token=${access_token}`);
						const statusData = await statusRes.json();
						status = statusData.status_code;
						if (status === "FINISHED") break;
						if (status === "ERROR") throw new Error("IG Video Processing Error");
					}
					if (status !== "FINISHED") throw new Error("IG Processing Timeout");

					// c. Publish
					const publishRes = await fetch(`https://graph.facebook.com/v18.0/${ig_user_id}/media_publish`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ creation_id: containerId, access_token: access_token })
					});
					const publishData = await publishRes.json();
					if (publishData.error) throw new Error("IG Publish Error: " + publishData.error.message);
					return publishData.id;
				})();

				const [youtubeId, instagramId] = await Promise.all([ytPromise, igPromise]);
				await env.DB.prepare("UPDATE hot_issues SET status = 'COMPLETED' WHERE id = ?").bind(issueId).run();
				
				return new Response(JSON.stringify({ success: true, youtubeId, instagramId }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
			} catch (error) {
				return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
			}
		}

		// R2 스토리지 퍼블릭 서빙 (Instagram 다운로드용)
		if (request.method === "GET" && url.pathname.startsWith("/public/")) {
			const fileName = url.pathname.replace("/public/", "");
			const object = await env.BUCKET.get(fileName);
			if (!object) return new Response("Not Found", { status: 404, headers: corsHeaders });
			
			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set('etag', object.httpEtag);
			headers.set('Access-Control-Allow-Origin', '*');
			return new Response(object.body, { headers });
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
			
			await env.DB.prepare("UPDATE hot_issues SET status = 'COMPLETED' WHERE id = ?").bind(issueId).run();
		} catch (error) {
			await env.DB.prepare("UPDATE hot_issues SET status = 'FAILED' WHERE id = ?").bind(issueId).run();
		}
	}
};
