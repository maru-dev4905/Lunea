# L-003 CodeRabbit 테스트 자동 생성이 PR 브랜치에 직접 커밋
- 날짜: 2026-11-11
- 키워드: coderabbit, unit test generation, finishing touches, bot commit, 자동 커밋, python, pyyaml
- 증상: PR #2에서 "Generate unit tests" 체크박스가 실행되어 CodeRabbit 봇이 `tests/test_coderabbit_config.py`(Python + PyYAML)를 브랜치에 직접 커밋(`342ff19`). 승인되지 않은 스택·의존성이며 CI에 연결되지 않음.
- 원인: CodeRabbit의 finishing touches(단위 테스트 생성) 기능이 기본 활성화. 체크박스 클릭으로 즉시 실행되며 결과를 PR 브랜치에 push함.
- 해결: `git revert`로 되돌림(`82070fb`, 히스토리 재작성 없음). `.coderabbit.yaml`에 `reviews.finishing_touches.unit_tests.enabled: false`.
- 재발 방지: 봇이 브랜치에 커밋할 수 있다는 전제로 push 전 `git pull --ff-only`로 원격 변경 확인. 봇 커밋은 의존성·스택 규칙으로 검토 후 수용/되돌림 결정.
- 방어 수준: L3 (설정으로 기능 비활성화)
- 재발 기록: —
