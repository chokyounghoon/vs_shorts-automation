export default {
	// 진입점 A (Cron Trigger): 매일 새벽 지정된 시간에 작동
	async scheduled(event, env, ctx) {
		console.log(`[Cron Trigger] Scheduled event triggered at ${event.cron}`);
		// 비동기 처리: 이벤트 수명 주기를 연장하여 작업이 완료될 때까지 기다림
		ctx.waitUntil(this.fetchAndProcessDailyIssues(env));
	},

	// 진입점 B (HTTP POST API): 프론트엔드 대시보드의 '발행하기' 호출 처리
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// CORS Preflight 요청 처리
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

		if (request.method === "POST" && url.pathname === "/api/publish") {
			try {
				const body = await request.json();
				const { issueId } = body;

				if (!issueId) {
					return new Response(JSON.stringify({ error: "issueId is required" }), {
						status: 400,
						headers: { "Content-Type": "application/json" }
					});
				}

				// 비동기 작업(영상 렌더링, R2 업로드, YouTube 발행)을 즉시 큐(Queue)와 유사하게 백그라운드로 넘김
				ctx.waitUntil(this.processPublishing(issueId, env));

				// 클라이언트(프론트엔드)에는 즉각적으로 202 Accepted를 반환
				return new Response(JSON.stringify({ 
					message: "Publishing job has been triggered successfully.", 
					issueId 
				}), {
					status: 202,
					headers: { 
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					}
				});

			} catch (error) {
				return new Response(JSON.stringify({ error: "Invalid request payload." }), {
					status: 400,
					headers: { 
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					}
				});
			}
		}

		// /api/issues 엔드포인트: 대시보드에서 목록 조회
		if (request.method === "GET" && url.pathname === "/api/issues") {
			try {
				const { results } = await env.DB.prepare("SELECT * FROM hot_issues ORDER BY created_at DESC LIMIT 50").all();
				return new Response(JSON.stringify(results), {
					status: 200,
					headers: { 
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*" // 개발 및 테스트를 위한 CORS 허용
					}
				});
			} catch (error) {
				return new Response(JSON.stringify({ error: "Failed to fetch issues" }), {
					status: 500,
					headers: { "Content-Type": "application/json" }
				});
			}
		}

		return new Response(JSON.stringify({ error: "Not Found" }), { 
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
	},

	// 진입점 A에서 호출하는 실제 스크래핑 및 DB 적재 로직
	async fetchAndProcessDailyIssues(env) {
		try {
			console.log("Fetching external stock/news data...");
			// TODO: 실제 API 연동 (예: 주식/뉴스 API)
			// const res = await fetch("https://api.example.com/finance/news");
			// const data = await res.json();
			
			// 테스트용 모의 데이터
			const dummyIssue = {
				analyze_date: new Date().toISOString().split('T')[0],
				category: "IT/테크",
				keyword_a: "삼성전자",
				keyword_b: "SK하이닉스",
				title: "[HBM 패권전쟁] 삼성전자 vs SK하이닉스, 과연 승자는?",
				controversy_score: 85
			};

			console.log("Data analyzed. Saving to DB...");
			
			// DB (D1)에 PENDING 상태로 데이터 적재
			const insertQuery = `
				INSERT INTO hot_issues (analyze_date, category, keyword_a, keyword_b, title, controversy_score, status) 
				VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
			`;
			
			await env.DB.prepare(insertQuery)
				.bind(
					dummyIssue.analyze_date, 
					dummyIssue.category, 
					dummyIssue.keyword_a, 
					dummyIssue.keyword_b, 
					dummyIssue.title, 
					dummyIssue.controversy_score
				)
				.run();
				
			console.log("Successfully saved to DB with PENDING status.");
		} catch (error) {
			console.error("Failed to fetch and process daily issues:", error);
		}
	},

	// 진입점 B에서 호출하는 렌더링, 업로드 및 발행 로직
	async processPublishing(issueId, env) {
		try {
			console.log(`Starting publishing process for issue ${issueId}...`);

			// 1. DB에서 발행할 이슈 정보 가져오기
			const issue = await env.DB.prepare("SELECT * FROM hot_issues WHERE id = ?")
				.bind(issueId)
				.first();

			if (!issue) {
				throw new Error(`Issue ${issueId} not found in DB.`);
			}

			// 2. HTML 템플릿 기반 렌더링 (비디오 생성)
			console.log("Rendering HTML template and generating video...");
			// 실제 구현 시 외부 렌더링 서버(Puppeteer/Remotion) 또는 브라우저 렌더링 호출
			await new Promise(resolve => setTimeout(resolve, 2000)); // 렌더링 딜레이 시뮬레이션
			const dummyVideoContent = "binary_video_data_mock"; 
			const fileName = `shorts_${issueId}_${Date.now()}.mp4`;

			// 3. 완성된 영상을 R2 BUCKET에 업로드
			console.log(`Uploading ${fileName} to R2 Bucket...`);
			await env.BUCKET.put(fileName, dummyVideoContent, {
				httpMetadata: { contentType: 'video/mp4' }
			});

			// 4. 유튜브 API로 발행 요청 전송
			console.log("Sending publish request to YouTube API...");
			// TODO: YouTube Data API 호출
			// await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet,status", {
			//     method: "POST",
			//     headers: { Authorization: `Bearer ${YOUTUBE_TOKEN}`, ... },
			//     body: ...
			// });

			// 5. 완료 후 DB 상태 업데이트 (PUBLISHED)
			await env.DB.prepare("UPDATE hot_issues SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
				.bind(issueId)
				.run();

			console.log(`Publishing process for issue ${issueId} completed successfully.`);
		} catch (error) {
			console.error(`Publishing process failed for issue ${issueId}:`, error);
			
			// 실패 시 DB 상태 업데이트 (FAILED)
			try {
				await env.DB.prepare("UPDATE hot_issues SET status = 'FAILED', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
					.bind(issueId)
					.run();
			} catch (dbError) {
				console.error("Failed to update status to FAILED:", dbError);
			}
		}
	}
};
