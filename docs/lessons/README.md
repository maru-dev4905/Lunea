# Lessons (교훈)

AI 에이전트와 사람이 겪은 실수·리뷰 지적·CI 실패·하네스 오류를 기록하고, 같은 실수를 반복하지 않도록 방어 수준을 올립니다.

**에이전트 규칙:** 오류, 리뷰 지적, CI 실패, 도구 오류가 생기면 행동하기 전에 아래 색인에서 키워드를 찾습니다. 일치하는 교훈이 있으면 그 해결법을 따르고 방어 수준을 한 단계 올립니다(`/lunea-lesson`).

## 방어 수준
| 수준 | 형태 |
|---|---|
| L0 | 교훈 문서만 |
| L1 | `CLAUDE.md` 규칙 한 줄 |
| L2 | 스킬·체크리스트 단계 |
| L3 | 자동 검사 (테스트, 린트, 훅, CI) |

## 템플릿
```md
# L-NNN 제목
- 날짜:
- 키워드: (영문, 국문)
- 증상:
- 원인:
- 해결: (PR, 커밋)
- 재발 방지:
- 방어 수준: 현재 Lx → 목표 Ly
- 재발 기록:
```

## Index
| ID | 제목 | 키워드 | 방어 수준 |
|---|---|---|---|
| [L-001](L-001-cloud-session-github-scope.md) | 클라우드 세션에서 저장소 생성·설정 API가 막힘 | github api, 403, create repo, branch protection, delete branch, cloud session, 권한, 브랜치 삭제 | L2 |
| [L-002](L-002-adr-status-body-mismatch.md) | ADR 상태만 바꾸고 본문·PR 설명을 갱신하지 않음 | adr, status, accepted, proposed, pr description, 문서 불일치, 스택 표 | L3 |
| [L-003](L-003-coderabbit-bot-commit.md) | CodeRabbit 테스트 자동 생성이 PR 브랜치에 직접 커밋 | coderabbit, unit test generation, bot commit, finishing_touches, 자동 커밋 | L3 |
| [L-004](L-004-atlassian-wrong-site.md) | Atlassian 커넥터가 다른 Jira 사이트를 가리킴 | jira, atlassian, cloudId, site, not granted, 프로젝트 안 보임 | L1 |
| [L-005](L-005-stale-review-replies.md) | 리뷰 봇이 이전 커밋 기준으로 "수정 미확인" 답변 | coderabbit, stale checkout, commit not found, race, 시점 차이 | L0 |
