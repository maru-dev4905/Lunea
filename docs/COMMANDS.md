# Lunéa 명령어 모음집

Claude Code(Orca 작업자 포함)에서 쓰는 명령어를 모았습니다. `/lunea-*` 명령은 저장소의 `.claude/skills/`에 들어 있어서 **어느 worktree에서든 똑같이 동작**합니다.

> 모드 전환 명령(`/lunea-seq`, `/lunea-compare`, `/lunea-pick` 등)은 **사람만 실행**하도록 설정되어 있습니다. 에이전트가 스스로 모드를 바꾸지 않습니다.

---

## 1. 한눈에 보기

| 상황 | 명령어 |
|---|---|
| 지금 어디까지 왔지? | `/lunea-status` |
| 기반 작업 하나 시작 | `/lunea-seq LUN-12` |
| 인터랙션 시안 2개 비교 | `/lunea-compare LUN-15` |
| 1번 시안 선택 | `/lunea-pick LUN-15 1` |
| 둘 다 별로 → 다시 비교 | `/lunea-retry LUN-15 "더 조용하게, 움직임 최소"` |
| 1번이 거의 맞음 → 다듬기 | `/lunea-refine LUN-15 1 "속도만 더 느리게"` |
| 뭘 원하는지 아직 모르겠음 | `/lunea-back-to-design LUN-15` |
| 독립 작업 여러 개 동시에 | `/lunea-parallel LUN-20 LUN-21` |
| PR 독립 검증 | `/lunea-verify 12` 또는 `/lunea-verify 12 a1b2c3d` (새 세션에서. 순차형은 최종 push 후 사람이 실행, 조율형은 자동) |
| 작업 마무리 | `/lunea-finish` |
| 고민 과정 기록(포트폴리오) | `/lunea-log "주제"` |
| 실수·이슈 교훈 기록 | `/lunea-lesson "제목"` |

---

## 2. 작업 모드

| 모드 | 언제 | 시작 명령 | Jira 라벨 |
|---|---|---|---|
| **A. 순차형** | 기반 작업(FND-02, FND-04 등), 선택된 시안 다듬기 | `/lunea-seq` | `mode-seq` |
| **B. 비교형** | 인터랙션이 중요한 화면 | `/lunea-compare` | `mode-compare` |
| **C. 조율 + 구현 + 검증** | 방향이 정해진 뒤 병렬 구현 | `/lunea-parallel` | `mode-parallel` |
| D. 완전 자동 | **보류** (비용 검토 후 결정, D-23) | — | `auto-pr` |

### 비교형 이후 흐름

```
/lunea-compare LUN-15   (라운드 1: 시안 v1, v2 + 미리보기)
        │
        ├─ 하나가 맞음 ────────────▶ /lunea-pick LUN-15 1   → A 또는 C로 진행
        ├─ 하나가 거의 맞음 ────────▶ /lunea-refine LUN-15 1 "피드백"  → A로 다듬기
        ├─ 둘 다 방향이 틀림 ───────▶ /lunea-retry LUN-15 "피드백"    → 라운드 2
        └─ 원하는 걸 설명 못 하겠음 ─▶ /lunea-back-to-design LUN-15   → 디자인 작업으로
```

비교 라운드는 **최대 2회**입니다. 2라운드 뒤에도 정해지지 않으면 디자인 단계로 돌아가자고 제안합니다(비교형은 비용이 약 2배).

---

## 3. 명령어 상세

### `/lunea-status`
현재 단계, 진행 중인 Jira 작업과 모드, 열린 PR 상태, 사람 확인이 필요한 항목을 보여 줍니다. 읽기만 하고 아무것도 바꾸지 않습니다.

### `/lunea-seq LUN-번호`
순차형으로 작업을 시작합니다. 문서와 Jira를 읽고 → 라벨 `mode-seq`, 상태 `진행 중` → 브랜치 생성 → **계획을 보여 주고 승인을 기다림** → 테스트 먼저 작성 후 구현 → `/lunea-finish`.

### `/lunea-compare LUN-번호`
작업자 2명이 서로 **의도적으로 다른** 시안을 각자 worktree에서 만듭니다(`feat/LUN-번호-v1`, `-v2`, Draft PR). 두 시안 모두 모션 줄이기 설정과 접근성을 지킵니다. Jira에 비교 코멘트(차이점, 미리보기 링크)를 남깁니다.

### `/lunea-pick LUN-번호 1|2`
선택한 시안으로 진행하고, 나머지 Draft PR은 닫습니다. 선택 이유를 Jira에 남기고, 다음을 A(다듬기)로 할지 C(나눠서 병렬)로 할지 물어봅니다.

### `/lunea-retry LUN-번호 "피드백"`
두 시안을 모두 탈락시키고 피드백을 반영해 새 비교 라운드를 시작합니다. 이전 브랜치는 참고용으로 남겨 둡니다.

### `/lunea-refine LUN-번호 1|2 "피드백"`
한 시안을 골라 순차형으로 바꿔 피드백대로 다듬습니다.

### `/lunea-back-to-design LUN-번호`
구현을 멈추고, 시도한 것과 탈락 이유를 정리한 뒤 디자인 작업(참고 영상·스케치·인터랙션 명세)으로 되돌립니다.

### `/lunea-parallel LUN-a LUN-b ...`
서로 파일이 겹치지 않는 작업만 동시에 진행합니다. `package.json`·lockfile, Supabase 마이그레이션, 공통 토큰, `CLAUDE.md`·`.claude/`를 건드리는 작업은 거절하고 순서대로 하자고 알려 줍니다. 구현자가 최종 push의 head SHA를 보고하면 별도 검증자가 그 SHA로 `/lunea-verify PR번호 SHA`를 실행합니다. 이후 push가 있으면 새 head SHA에 대해 다시 실행합니다.

### `/lunea-verify PR번호 [SHA]`
구현하지 않은 새 세션이 PR을 검증합니다. SHA를 주면 그 커밋을, 생략하면 시작 시점의 PR head를 체크아웃하고, 준 SHA가 PR head와 다르면 멈추고 알립니다. 검증 내용: 검사 재실행, 수용 기준별 충족 여부와 근거, 인터랙션·접근성 체크, 제품 원칙(원문 보존, 사용자 확인 없는 AI 저장 금지, 로그에 일기 원문 금지). 결과는 PR 코멘트로 남기고 직접 수정하지는 않습니다.

### `/lunea-finish`
검사 실행 → 국문 PR → "결정이 있었나? 실수가 있었나?" 확인 후 저널·교훈 추가 → `docs/STATUS.md` 갱신. merge는 하지 않습니다.

### `/lunea-log "주제"`
지금까지의 논의를 바탕으로 `docs/journal/`에 포트폴리오용 기록 초안을 씁니다. 배경, 선택지 비교표, 결정 이유, 결과를 담고, PR·커밋 근거를 링크합니다. **커밋 전에 초안을 보여 주니 직접 다듬어 주세요.**

### `/lunea-lesson "제목"`
실수, 리뷰 지적, CI 실패, 도구 오류를 `docs/lessons/`에 기록합니다. 같은 교훈이 이미 있으면 그 해결법을 따르고 방어 수준(L0 → L3)을 한 단계 올립니다.

---

## 4. Git 브랜치 흐름 (D-26)

```
feat/LUN-10-…  ──(PR, 스쿼시)──▶  dev  ──(릴리스 PR, 머지 커밋 + 태그)──▶  main(배포)
fix/LUN-xx-…(긴급) ──(PR)──▶ main ──▶ dev에도 반영
```

| 브랜치 | 용도 | 누가 머지 |
|---|---|---|
| `main` | 배포된 코드만. 릴리스마다 `v0.1.0` 같은 태그 | 사람 |
| `dev` | 작업이 모이는 곳, GitHub 기본 브랜치 | 사람 |
| `feat/` `fix/` `docs/` `chore/` … | 작업 하나 = 브랜치 하나 = PR 하나 (`dev`에서 만들고 `dev`로 PR) | 사람 |

- Jira는 `dev`에 머지되면 `완료`입니다. 배포 여부는 태그·GitHub 릴리스로 확인합니다.
- 에이전트는 `dev`·`main`에 직접 push하지 않고, `main`으로 PR을 열지 않습니다(사람이 요청한 긴급 수정만 예외).
- 릴리스: 기능이 모이면 사람이 GitHub에서 `dev` → `main` PR을 열고, CI·CodeRabbit 확인 후 머지 커밋으로 머지, 태그를 붙입니다.

---

## 5. Orca 작업자 시작 프롬프트

`/lunea-*` 모드 명령은 **사람이 직접 입력**합니다(에이전트는 실행할 수 없음). 가장 간단한 방법은 새 작업자 창에서 바로 `/lunea-seq LUN-12`를 입력하는 것입니다.

명령 대신 문장으로 시작하고 싶다면(계획 확인용). **승인 후 구현을 시작하기 전에는 사람이 `/lunea-seq LUN-12`를 입력**해야 Jira 라벨·상태·브랜치 절차가 적용됩니다:

```
CLAUDE.md, docs/STATUS.md, docs/lessons/README.md를 먼저 읽어.
그다음 LUN-12 작업 계획과 변경 파일 목록을 보여 주고 내 승인을 기다려.
```

조율자(메인) 세션:

```
너는 Lunéa의 조율자야. docs/11_AGENT_WORKFLOW.md를 따르고,
docs/STATUS.md와 Jira LUN 보드를 읽어 현재 상태를 보고한 뒤 다음 작업을 제안해.
```

---

## 6. 자주 쓰는 Claude Code 기본 명령

| 명령 | 용도 |
|---|---|
| `/clear` | 대화 맥락 초기화 (작업 하나가 끝나면 권장) |
| `/compact` | 긴 대화를 요약해 맥락 확보 |
| `/plugin` | 플러그인 설치·관리 |
| `/mcp` | MCP 서버(Atlassian 등) 연결 상태 확인 |
| `/permissions` | 권한 규칙 확인 |

Superpowers 플러그인의 명령(계획 작성, 실행 등)은 설치 후 `/help`에서 확인할 수 있습니다.

---

## 7. PC 최초 1회 설정

Claude Code에서:
```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```
저장소를 신뢰(trust)하면 `.claude/settings.json`에 지정된 Superpowers 설치를 묻는 안내가 나올 수 있습니다. 그때 설치해도 됩니다.

터미널에서 Atlassian(Jira) MCP 연결(설치 시점에 공식 문서로 주소 재확인):
```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp
```

Orca:
- 데스크톱 앱 설치 → 에이전트로 Claude Code 선택 → GitHub 연결 → 모바일 앱 페어링(입력 요청 알림)
- CLI 명령은 버전마다 다를 수 있으니 `orca --help`로 확인

---

## 8. 자동으로 일어나는 일

| 언제 | 무엇 |
|---|---|
| 세션 시작 | 훅이 `docs/lessons/README.md` 색인을 맥락에 넣음 |
| PR 생성 | CodeRabbit 국문 리뷰, Jira `검토 중`(자동화 규칙 설정 후) |
| `dev`로 PR 머지 | Jira `완료`(자동화 규칙에 대상 브랜치 `dev` 조건 필요), Slack 알림. `main` 머지(릴리스·긴급 수정)는 Jira를 바꾸지 않음 |
| `.env` 파일 | 에이전트의 Read·Edit 도구 접근 금지 (대상: `.env`, `.env.local`, `.env.*.local`, `.env.development`, `.env.staging`, `.env.production`, `.env.test`; `.env.example`은 변수 이름만 있으므로 허용). 그 밖의 이름으로 비밀 파일을 만들지 말 것. **셸 명령(`cat` 등)은 이 규칙으로 막히지 않으므로** 셸 명령 승인 시 `.env`가 포함되면 거절 |
| 위험 명령 (`git push --force`, `rm -rf`, `npm install` 등) | 실행 전 사람에게 확인 |

---

## 개발 스크립트 (FND-02)

| 명령 | 설명 |
|---|---|
| `scripts/check.sh` | 포맷·린트·타입·테스트를 CI와 똑같이 실행 |
| `scripts/setup-worktree.sh` | 새 worktree에서 `npm ci` 후 주 체크아웃의 `apps/mobile/.env.local`을 복사 (값은 출력하지 않음) |
| `cd apps/mobile && npm start` | Expo 개발 서버 |
| `cd apps/mobile && npm run export` | CI와 같은 번들 빌드 |
| `scripts/check-supabase.sh [--integration]` | 로컬 Supabase(Docker)에서 RLS(pgTAP)·Edge Function 테스트 실행. 로컬 데이터를 지우지 않음(미적용 마이그레이션만 적용). 깨끗한 DB가 필요하면 `supabase db reset`을 직접 실행(**로컬 데이터 전부 삭제**). `--integration`은 함수를 띄워 실제 사용자로 호출 |

Claude Code `Stop` 훅(`scripts/stop-check.sh`)이 `apps/mobile`·`scripts` 변경이 있고 검사가 실패하면 작업 종료를 막고 실패 내용을 에이전트에게 돌려줍니다.
