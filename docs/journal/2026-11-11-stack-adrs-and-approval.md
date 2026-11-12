# 기술 스택 ADR과 승인 과정
- 날짜: 2026-11-11 / 관련: PR #3, ADR-0001~0007, L-002

## 배경
FND-02(Expo 초기 구성) 전에 스택 결정 근거가 필요했다. 핸드오프는 Jotai·Emotion·Orca·OMC·LangChain을 "논의되었다는 이유만으로" 설치하지 말라고 명시했다.

## 고려한 선택지 (요약)
| 주제 | 후보 | 결정 |
|---|---|---|
| 모바일 | Expo+RN, Bare RN, Flutter, 네이티브 2벌 | Expo + RN + TS strict + Expo Router |
| 백엔드 | Supabase, Node API + 관리형 DB | Supabase (PoC 5개 조건 통과 시 확정) |
| 상태 | 없음, Zustand, Jotai | 없음으로 시작, 필요 시 Zustand 하나 |
| 스타일 | StyleSheet, Emotion, NativeWind | StyleSheet + 토큰 |
| 테스트 | Jest+RNTL, Vitest / Maestro, Detox | Jest+RNTL, E2E는 Maestro |
| AI | 어댑터 + mock, LangChain | 어댑터 + mock만 (제공자 TBD) |
| 구조 | 모노레포 워크스페이스, 단일 앱 | `apps/mobile` 단일로 시작 |

## 결정과 이유
1인 소유자 + AI 에이전트 팀이라 운영 부담이 작은 선택을 우선했다. Supabase는 RLS로 소유권을 DB에서 강제할 수 있다는 점이 결정적이었지만, RLS 실수는 조용히 일어나므로 교차 사용자 생성/읽기/수정/삭제 차단을 자동 테스트로 증명하는 PoC를 조건으로 걸었다. 생성(insert) 조건은 CodeRabbit 보안 지적으로 추가되었다.

제품 책임자가 전체를 승인했고(ADR-0002 조건부, ADR-0006은 제공자 제외), 기기 내 초안 임시 저장은 보류했다.

## 진행 중 생긴 문제와 대응
상태 줄만 Accepted로 바꾸고 본문과 PR 설명을 갱신하지 않아 리뷰 지적이 연쇄로 발생했다(L-002). 본문 문구 수정, PR 설명에 승인 기록 추가로 해결했다.

## 결과
ADR 7건 Accepted. 리뷰 스레드 전부 해결, merge 위험도 Minimal.

## 회고
(작성 예정)
