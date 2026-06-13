# VS Shorts Automation 프로젝트 가이드

## ⚠️ 대화창 오류 안내
현재 편집기의 채팅창 UI 버그로 인해 제가 드리는 답변이 자꾸 지워지는 현상이 발생하고 있습니다! 
채팅창에서 글이 사라지더라도 편하게 보실 수 있도록 이 `README.md` 파일에 답변을 남겨드립니다.

---

## 1. Cloudflare 관리자 웹 주소
클라우드플레어 대시보드 주소는 아래와 같습니다. 브라우저에서 열어주세요.
👉 **https://dash.cloudflare.com/**

## 2. Cloudflare Pages 배포 방법 (대시보드 화면)
1. 위 주소로 로그인 후, 좌측 메뉴에서 **[Workers & Pages]** 클릭
2. 파란색 **[Create application]** 버튼 클릭
3. 상단 탭에서 **[Pages]** 선택
4. **[Connect to Git]** 버튼을 누르고, 앞서 코드를 올려둔 `vs_shorts-automation` 레포지토리를 선택
5. 배포 설정 창 하단의 **Build output directory** 칸에 `dashboard` 라고 입력 (다른 칸은 모두 비워둠)
6. **Save and Deploy** 클릭

위 과정을 마치면 `https://vs-shorts-automation.pages.dev` 와 같은 본인만의 대시보드 웹 주소가 생깁니다!

---

## ❓ "싸이트에 연결할 수 없음" 오류가 뜰 경우
`https://vs-shorts-automation.pages.dev/` 는 **예시 주소**입니다! 

1. **아직 배포를 안 하셨다면:** Cloudflare 홈페이지(https://dash.cloudflare.com/)에 들어가서 **위 2번의 배포 과정**을 직접 완료해 주셔야 주소가 생성됩니다.
2. **배포를 완료하셨다면:** Cloudflare에서 생성해 준 **진짜 주소**가 다를 수 있습니다. (예: `vs-shorts-automation-abc.pages.dev`) Cloudflare Pages 대시보드 완료 화면에 나오는 실제 파란색 링크 주소를 클릭해서 들어가셔야 합니다!
