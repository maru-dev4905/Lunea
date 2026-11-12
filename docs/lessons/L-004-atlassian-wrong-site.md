# L-004 Atlassian 커넥터가 다른 Jira 사이트를 가리킴
- 날짜: 2026-11-12
- 키워드: jira, atlassian, cloudId, site, not granted, project not found, 프로젝트 안 보임
- 증상: Slack에는 `LUN` 프로젝트가 보이는데 Atlassian MCP로 조회하면 `KAN` 프로젝트만 보임. 사이트 지정 시 "Cloud id isn't explicitly granted by the user" 오류.
- 원인: 커넥터 OAuth 동의가 `seungyeol102.atlassian.net`에만 되어 있었고, `LUN`은 `iseung10e.atlassian.net`에 있었음.
- 해결: 사용자가 커넥터를 재연결하며 `iseung10e` 사이트를 허용.
- 재발 방지: Jira 작업 전 `getAccessibleAtlassianResources`로 사이트 확인 → `docs/STATUS.md`의 Environment facts에 사이트 기록(`iseung10e.atlassian.net`).
- 방어 수준: L1 (STATUS.md에 사이트 고정 기록)
- 재발 기록: —
