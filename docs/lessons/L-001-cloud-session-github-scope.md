# L-001 클라우드 세션에서 저장소 생성·설정 API가 막힘
- 날짜: 2026-11-08
- 키워드: github api, 403, create repo, branch protection, vulnerability alerts, cloud session, 권한
- 증상: `POST /user/repos`(저장소 생성), `PUT .../branches/main/protection`(브랜치 보호), Dependabot 알림 설정이 HTTP 403으로 거부됨.
- 원인: Claude Code 클라우드 세션은 세션에 연결된 저장소 범위의 API만 허용하고, 계정 단위 생성·보안 설정 쓰기는 프록시가 차단함.
- 해결: 사람이 빈 저장소를 직접 생성 → 세션에 저장소 연결(add_repo) → push와 PR은 정상 동작. 보호 규칙·보안 설정은 사람이 GitHub 설정 화면에서 진행.
- 재발 방지: 계정·보안 설정이 필요한 작업은 시작 전에 "사람이 할 단계"로 분리해 안내. 성공을 주장하기 전에 API 응답을 확인.
- 방어 수준: L1 (CLAUDE.md: 검증되지 않은 성공을 주장하지 않음, 사람 단계 분리)
- 재발 기록: —
