# 스킬·도구 정리: 겹치는 오케스트레이션 제거
- 날짜: 2026-11-12 / 관련: docs/11, docs/08

## 배경
기획에는 pstack, Superpowers, OMC, Orca, CodeRabbit, Codex, n8n, LangChain이 언급되어 있었고 "서로 다른 지시를 내리는 스킬 팩을 겹쳐 쓰지 말라"는 원칙이 있었다.

## 고려한 선택지
| 도구 | 역할 | 겹침 |
|---|---|---|
| pstack | 계획→구현→PR 단계 스킬 | Superpowers에 의존, CLAUDE.md 절차와 중복, 출처 확인 어려움 |
| Superpowers | 요구사항 정리, 계획, TDD, 검증 | — |
| OMC | Claude 내부 멀티 에이전트 조율 | Orca와 같은 역할 |
| Orca | worktree 단위 병렬 에이전트 조율 | — |

## 결정과 이유
**Orca(바깥 조율) + Superpowers(작업 방법) + CLAUDE.md(프로젝트 규칙)** 세 겹으로 정리했다. pstack은 명세에서 제거, OMC는 사용하지 않음. CodeRabbit만 외부 리뷰어로 두고 Codex는 서비스가 어느 정도 구축된 뒤 연결하며 파이프라인을 재구성한다. n8n·LangChain은 서비스 개발 단계에서 검토하며, RAG를 쓸 경우 일기 데이터가 외부 AI로 가는 구조라 개인정보 결정(D-22)을 먼저 한다.

## 결과
`docs/11_AGENT_WORKFLOW.md`, `.claude/settings.json`(Superpowers 지정), `docs/08` 갱신.

## 회고
(작성 예정)
