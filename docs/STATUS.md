# 프로젝트 상태

**이 문서는 국문으로 씁니다.** 제품 책임자가 "AI가 지금 프로젝트를 어디까지 이해하고 있는지" 확인하는 문서이기 때문입니다. 에이전트는 세션 시작 시 이 문서를 읽고, 작업을 마칠 때(`/lunea-finish`) 갱신합니다. 짧고 최신으로 유지하고, 지난 기록은 `docs/journal/`에 남깁니다.

마지막 갱신: 2026-11-13

## 단계
Foundation(기반). 기획 문서, 기술 결정(ADR), 에이전트 작업 체계가 갖춰졌습니다. 애플리케이션 코드는 아직 없습니다.

## 완료
- LUN-8 FND-01 저장소 기본 구성 (PR #1)
- 리뷰 파이프라인: CodeRabbit 단독, 국문 리뷰 (PR #2)
- LUN-9 FND-03 기술 스택 ADR 0001~0008 (PR #3)
- LUN-34 FND-06 에이전트 작업 체계, 명령어 모음, 저널, 교훈 (PR #4)
- Jira 백로그: 에픽 LUN-1~7, 작업 LUN-8~34 (`iseung10e.atlassian.net`, 프로젝트 `LUN`)

## 검토 중
- 없음

## 다음 작업 (순서대로)
1. LUN-10 FND-02 Expo 앱 뼈대 — 순차형(A). 실제 CI 검사, worktree 설정 스크립트, Stop 훅 검사 추가.
2. LUN-11 FND-04 Supabase PoC — 순차형(A). 제품 책임자가 `lunea-dev` 프로젝트를 만든 뒤 진행. 통과 조건 6개는 ADR-0002.
3. LUN-12 FND-05 인터랙션 확인 체계 (PR마다 EAS Update 미리보기 QR, ADR-0008). Expo 계정 필요. 모드 라벨 미정(제품 책임자가 결정).
4. LUN-13 DOC-01 명세 불일치 정리 (상태 이름, 삭제 의미, 확인 질문 흐름).

## 제품 책임자 확인 필요
- Supabase `lunea-dev` 프로젝트 생성 (Project URL만 공유, 키는 붙여넣지 않음)
- Expo 계정 (미리보기 QR용)
- Jira 자동화 규칙(PR 생성 → 검토 중, 머지 → 완료)과 GitHub for Jira 앱
- `main` 브랜치 보호 (수동 설정, 비공개 저장소는 유료 플랜이 필요할 수 있음)
- GitHub 설정 "Automatically delete head branches" 켜기, 머지가 끝난 원격 브랜치 4개 삭제 (`chore/bootstrap-repository`, `chore/coderabbit-review-setup`, `docs/stack-adrs`, `chore/agent-workflow-and-journal`) — 클라우드 세션에서는 권한이 없음(L-001)

## 열린 결정 (docs/10 참고)
D-08 AI 제공자, D-11 Balance, D-12 Collection 메타포, D-13 감정 분류, D-14 하루 여러 기록, D-16 인증 방식, D-17 보관·삭제, D-18 위기 대응 정책, D-20 라이트/다크, D-22 일기 데이터 RAG, D-23 D 모드(자동 PR) 비용.

## 환경 정보
- 저장소: `maru-dev4905/Lunea` (비공개), 기본 브랜치 `main`.
- Jira: `iseung10e.atlassian.net`, 프로젝트 `LUN`. 상태: 해야 할 일 → 진행 중 → 검토 중 → 완료.
- Slack: Jira Cloud 앱이 `LUN`에 연결됨. GitHub 앱 구독은 제품 책임자가 관리.
- 언어: PR 제목·설명, 커밋 본문, `docs/STATUS.md`, `docs/COMMANDS.md`는 국문. 그 밖의 문서(ADR, skills, `CLAUDE.md`, 기획 문서)는 영어(에이전트가 매 세션 읽으므로 토큰·정확도 우선).
- Atlassian MCP(로컬): V1 주소(`/v1/mcp`) 사용 중, 정상 동작. 2027-03-01부터 기존 V1 연결은 V2 도구로 자동 전환됨(Atlassian 공식 업그레이드 안내). 전환 후 인증이 실패하면 캐시된 클라이언트 ID·`.well-known` 자격 증명을 지우고 재인증한 뒤 `/mcp`로 Jira 연결 확인. 수동 전환 주소는 `https://mcp.atlassian.com/v2/mcp`(현재 로컬 연결은 실패해 보류).
