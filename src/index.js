export default {
	// 진입점 A (Cron Trigger): 매분 작동하며 DB 설정 시간에 맞춰 실행
	async scheduled(event, env, ctx) {
		console.log(`[Cron Trigger] Scheduled event triggered at ${event.cron}`);
		
		const setting = await env.DB.prepare("SELECT value FROM app_settings WHERE key = 'schedule_time'").first();
		const targetTime = setting ? setting.value : "09:00"; 

		const now = new Date();
		const kstOffset = 9 * 60 * 60 * 1000;
		const kstDate = new Date(now.getTime() + kstOffset);
		const currentHour = kstDate.getUTCHours().toString().padStart(2, '0');
		const currentMinute = kstDate.getUTCMinutes().toString().padStart(2, '0');
		const currentTime = `${currentHour}:${currentMinute}`;

		if (currentTime === targetTime) {
			console.log("Time matched! Executing daily scraping...");
			ctx.waitUntil(this.generateMockIssues(env));
		}
	},

	// 진입점 B (HTTP API)
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// CORS Preflight 처리
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				}
			});
		}

		// 공통 응답 헤더
		const corsHeaders = { 
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		};

		// 1. [가져오기 버튼] - 새로운 VS 주제 생성 (POST /api/fetch-issues)
		if (request.method === "POST" && url.pathname === "/api/fetch-issues") {
			try {
				await this.generateMockIssues(env);
				// 생성 후 최신 리스트 반환
				const { results } = await env.DB.prepare("SELECT * FROM hot_issues ORDER BY created_at DESC LIMIT 50").all();
				return new Response(JSON.stringify({ success: true, data: results }), { status: 200, headers: corsHeaders });
			} catch (error) {
				return new Response(JSON.stringify({ error: "Failed to fetch and generate issues" }), { status: 500, headers: corsHeaders });
			}
		}

		// 2. [조회 API] - 대시보드 리스트 로드용 (GET /api/issues)
		if (request.method === "GET" && url.pathname === "/api/issues") {
			try {
				const { results } = await env.DB.prepare("SELECT * FROM hot_issues ORDER BY created_at DESC LIMIT 50").all();
				return new Response(JSON.stringify(results), { status: 200, headers: corsHeaders });
			} catch (error) {
				return new Response(JSON.stringify({ error: "Failed to fetch issues" }), { status: 500, headers: corsHeaders });
			}
		}

		// 3. [유튜브 발행 버튼] - 비디오 렌더링 & 유튜브 업로드 모방 (POST /api/publish-youtube)
		if (request.method === "POST" && url.pathname === "/api/publish-youtube") {
			try {
				const body = await request.json();
				const { issueId } = body;

				if (!issueId) {
					return new Response(JSON.stringify({ error: "issueId is required" }), { status: 400, headers: corsHeaders });
				}

				// 발행 작업 비동기 처리
				ctx.waitUntil(this.processPublishing(issueId, env));

				return new Response(JSON.stringify({ message: "Publishing job triggered successfully", issueId }), {
					status: 202, headers: corsHeaders
				});
			} catch (error) {
				return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: corsHeaders });
			}
		}

		// (부가 기능) 스케줄 조회/저장 유지
		if (request.method === "GET" && url.pathname === "/api/settings") {
			const setting = await env.DB.prepare("SELECT value FROM app_settings WHERE key = 'schedule_time'").first();
			return new Response(JSON.stringify({ schedule_time: setting ? setting.value : "09:00" }), { status: 200, headers: corsHeaders });
		}
		if (request.method === "POST" && url.pathname === "/api/settings") {
			const { schedule_time } = await request.json();
			if (!schedule_time) return new Response("Error", { status: 400, headers: corsHeaders });
			await env.DB.prepare(`
				INSERT INTO app_settings (key, value, updated_at) VALUES ('schedule_time', ?, datetime('now', 'localtime'))
				ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
			`).bind(schedule_time).run();
			return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
		}

		return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
	},

	// 내부 메서드: Gemini API 호출 모방하여 Mock 데이터 3개 생성
	async generateMockIssues(env) {
		const today = new Date().toISOString().split('T')[0];
		
		const mockDataList = [
			{
				analyze_date: today, category: "주식/경제",
				keyword_a: "삼성전자", keyword_b: "SK하이닉스",
				title: "[HBM 패권전쟁] 삼성전자 vs SK하이닉스, 과연 승자는?",
				controversy_score: 85, metric_a_value: 5800000, metric_b_value: 4200000
			},
			{
				analyze_date: today, category: "IT/테크",
				keyword_a: "아이폰16 Pro", keyword_b: "갤럭시 S24 Ultra",
				title: "세기의 대결! 아이폰16 vs 갤럭시S24, 당신의 선택은?",
				controversy_score: 92, metric_a_value: 850000, metric_b_value: 790000
			},
			{
				analyze_date: today, category: "스포츠",
				keyword_a: "손흥민", keyword_b: "이강인",
				title: "한국 축구의 에이스 논쟁, 손흥민 vs 이강인 기록 전격 비교!",
				controversy_score: 75, metric_a_value: 125000, metric_b_value: 112000
			}
		];

		const insertQuery = `
			INSERT INTO hot_issues (analyze_date, category, keyword_a, keyword_b, title, controversy_score, metric_a_value, metric_b_value, status) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
		`;

		const stmts = mockDataList.map(data => 
			env.DB.prepare(insertQuery).bind(
				data.analyze_date, data.category, data.keyword_a, data.keyword_b, 
				data.title, data.controversy_score, data.metric_a_value, data.metric_b_value
			)
		);
		
		await env.DB.batch(stmts);
		console.log("3 Mock issues generated successfully.");
	},

	// 내부 메서드: 유튜브 발행 시뮬레이션
	async processPublishing(issueId, env) {
		try {
			// 1. 상태를 PROCESSING으로 변경
			await env.DB.prepare("UPDATE hot_issues SET status = 'PROCESSING' WHERE id = ?").bind(issueId).run();
			console.log(`[Issue ${issueId}] Status -> PROCESSING. Generating video...`);

			// 2. 비디오 인코딩 대기 (Shotstack API 모방, 4초 대기)
			await new Promise(resolve => setTimeout(resolve, 4000));
			const dummyVideoUrl = `https://vs-shorts-bucket.example.com/video_${issueId}.mp4`;
			console.log(`[Issue ${issueId}] Video generated at ${dummyVideoUrl}`);

			// 3. 유튜브 API 업로드 모방 (2초 대기)
			await new Promise(resolve => setTimeout(resolve, 2000));
			console.log(`[Issue ${issueId}] Uploaded to YouTube via API.`);

			// 4. 상태를 COMPLETED로 변경
			await env.DB.prepare("UPDATE hot_issues SET status = 'COMPLETED', updated_at = datetime('now', 'localtime') WHERE id = ?").bind(issueId).run();
			console.log(`[Issue ${issueId}] Status -> COMPLETED. Process finished.`);

		} catch (error) {
			console.error(`Error in processPublishing for issue ${issueId}:`, error);
			await env.DB.prepare("UPDATE hot_issues SET status = 'FAILED', updated_at = datetime('now', 'localtime') WHERE id = ?").bind(issueId).run();
		}
	}
};
