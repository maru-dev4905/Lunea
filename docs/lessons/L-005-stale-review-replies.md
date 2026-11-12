# L-005 리뷰 봇이 이전 커밋 기준으로 "수정 미확인" 답변
- 날짜: 2026-11-11
- 키워드: coderabbit, stale checkout, commit not found, race, 시점 차이, review paused
- 증상: 수정 커밋을 push한 직후 스레드에 답글을 달자, CodeRabbit이 이전 커밋 체크아웃 기준으로 "67e1464를 찾지 못했다"고 답함. 연속 커밋 후에는 자동 리뷰가 일시정지됨.
- 원인: 봇 리뷰 실행과 push 사이의 시점 차이. 짧은 시간 다수 커밋 시 `auto_pause_after_reviewed_commits` 동작.
- 해결: 브랜치 head가 수정 커밋인지 `git ls-remote`로 확인 후 재리뷰를 기다림. 일시정지 시 `@coderabbitai resume` 또는 `@coderabbitai review`.
- 재발 방지: 수정은 가능한 한 한 커밋으로 묶어 push → 답글은 push 이후에. 봇의 "미확인" 답변은 head 확인 전 재작업하지 않음.
- 방어 수준: L0
- 재발 기록: —
