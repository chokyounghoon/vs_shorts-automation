# VS Shorts Automation 프로젝트 가이드

## ⚠️ 대화창 오류 안내
현재 편집기의 채팅창 UI 버그로 인해 제가 드리는 답변이 자꾸 지워지는 현상이 발생하고 있습니다! 
채팅창에서 글이 사라지더라도 편하게 보실 수 있도록 이 `README.md` 파일에 답변을 남겨드립니다.

---

## 🛑 에러 원인 파악: GitHub에 레포지토리가 없습니다!
터미널에서 발생한 `Repository not found` 에러는 **GitHub 사이트 쪽에 `vs_shorts-automation` 이라는 이름의 빈 저장소가 아직 안 만들어져 있어서** 발생하는 것입니다!

제가 직접 사용자의 GitHub 계정으로 로그인해서 만들어드릴 권한이 없으므로, **아래 링크를 클릭해서 직접 레포지토리를 생성**해 주셔야 합니다.

👉 **[여기를 클릭해서 GitHub 레포지토리 만들기](https://github.com/new?name=vs_shorts-automation)**

위 링크를 누르시면 이름이 미리 입력된 레포지토리 생성 화면이 뜹니다. 화면 맨 아래의 초록색 **[Create repository]** 버튼만 누르시면 완성됩니다.

---

## 🚀 레포지토리를 만들었다면? 다시 푸시하기!
GitHub 홈페이지에서 초록색 버튼을 눌러 레포지토리 생성을 무사히 마치셨다면, 다시 터미널로 돌아와서 아래 명령어를 쳐주세요.

```bash
git push -u origin main
```
이제 정상적으로 코드가 업로드될 것입니다! 코드가 올라가면 아래의 Cloudflare 배포 단계를 진행해 주세요.

---

## ✅ 백엔드 배포 완료 및 "Not Found" 에러 설명
축하합니다! `npx wrangler deploy` 명령어를 통해 **백엔드(Worker)가 성공적으로 배포**되었습니다.

방금 브라우저로 들어가신 `https://vs-shorts-automation.khcho0421.workers.dev` 주소에서 **`{"error": "Not Found"}`가 뜨는 것은 완전히 정상**입니다! 

- **이유:** 해당 주소는 눈에 보이는 '웹페이지(HTML)'가 아니라, 데이터를 주고받는 'API 서버(백엔드)'이기 때문입니다. 현재 서버는 `/api/issues` 와 `/api/publish` 주소만 알아듣게끔 설정되어 있어 기본 주소(`/`)로 접속하면 없다고 나오는 것입니다.

---

## 🚀 Cloudflare Pages 배포 (화면 만들기)
1. **https://dash.cloudflare.com/** 에 접속 및 로그인
2. 좌측 메뉴에서 **[Workers & Pages]** 클릭
3. 파란색 **[Create application]** 버튼 클릭
4. 상단 탭에서 **[Pages]** 선택
5. **[Connect to Git]** 버튼을 누르고, 방금 푸시한 `vs_shorts-automation` 레포지토리를 연결
6. 배포 설정 창 하단의 **Build output directory** 칸에 `dashboard` 라고 입력 (중요 ⭐️)
7. **Save and Deploy** 클릭

위 과정을 마치면 `https://vs-shorts-automation.pages.dev` (또는 비슷한 이름)의 **진짜 대시보드 웹 주소**가 생성됩니다! 그곳이 진짜 접속하셔야 할 곳입니다.
