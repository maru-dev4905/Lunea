# L-006 문서의 명령 예시가 작업 디렉터리 이동 뒤 경로를 잘못 가리킴
- 날짜: 2026-11-13
- 키워드: readme, command, cwd, working directory, relative path, 문서 명령, 경로, coderabbit
- 증상: README의 명령 블록에서 `cd apps/mobile` 다음 줄에 저장소 루트 기준 `scripts/check.sh`를 적어, 순서대로 따라 하면 실패함 (CodeRabbit 지적, PR #7).
- 원인: 명령을 작성할 때 `cd` 이후의 작업 디렉터리를 추적하지 않았고, 문서의 명령을 실제로 순서대로 실행해 보지 않음.
- 해결: 루트 기준 명령을 먼저, `cd apps/mobile` 이후 명령을 나중에 두도록 재배치 (PR #7).
- 재발 방지: 문서에 명령 블록을 쓰면 블록을 위에서부터 그대로 실행해 확인한다. `cd`가 있으면 이후 경로를 다시 점검한다.
- 방어 수준: 현재 L0 → 재발하면 `/lunea-finish`에 "문서 명령 블록 실행 확인" 단계 추가(L2)
- 재발 기록: —
