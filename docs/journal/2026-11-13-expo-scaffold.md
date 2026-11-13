# Expo 앱 뼈대(FND-02): 템플릿 산출물과 의존성 충돌 다루기
- 날짜 / 관련: 2026-11-13, LUN-10, ADR-0001/0004/0005/0007

## 배경
ADR에서 정한 스택(Expo + Router, StyleSheet 토큰, Jest + RNTL, npm)을 `apps/mobile`에 처음 구성했습니다. 기능 코드는 없고 탭 3개 placeholder와 테마 토큰, 실제 CI까지만 범위입니다.

## 고려한 선택지
| 선택지 | 장점 | 단점 | 비용 |
|---|---|---|---|
| `blank-typescript` 템플릿 + 필요한 것만 추가 | 예제 코드가 없어 지울 것이 적음 | Router 연결을 직접 해야 함 | 낮음 |
| 기본(탭) 템플릿 | Router 구성이 이미 있음 | 예제 화면·컴포넌트를 전부 걷어내야 하고 ADR-0004 토큰과 충돌 | 중간 |

## 결정과 이유
`blank-typescript`에서 시작했습니다. 템플릿이 만든 `LICENSE`(Expo MIT), `AGENTS.md`, `.claude/`, `.gitignore`는 삭제했습니다. 라이선스는 아직 TBD(`docs/LICENSE_DECISION.md`)이고, 에이전트 지침은 루트 `CLAUDE.md` 하나로 관리하며, `.gitignore`는 루트 파일이 이미 포함하기 때문입니다.

## 진행 중 생긴 문제와 대응
- `react-test-renderer`와 `react-dom` 최신판이 `react@^19.3.1`을 요구했지만 Expo SDK는 `react@19.3.0`으로 고정합니다. 두 패키지를 19.3.0에 맞춰 설치해 해결했습니다(`npm ls`·`expo install --check`·`expo-doctor` 통과).
- TypeScript 6에서는 `types` 기본값이 비어 `@types/jest`가 자동으로 잡히지 않아 `tsconfig`에 `"types": ["jest"]`를 명시했습니다.
- RNTL 14는 매처를 `@testing-library/react-native/matchers`로 가져와야 합니다.
- Stop 훅은 무한 반복을 막으려 `stop_hook_active`면 통과시킵니다.

## 결과
포맷·린트·타입·테스트·`expo export`가 통과합니다. 시뮬레이터 실행 확인은 제품 책임자 몫으로 남겼습니다.

## 리뷰 대응 (CodeRabbit, 1라운드)
- 유효: `userInterfaceStyle`을 Android에서 적용하려면 `expo-system-ui`가 필요 → `expo install`로 추가.
- 유효: README 명령 블록의 `cd` 이후 경로 오류 → 재배치 (교훈 L-006).

## 웹 지원 추가 (제품 책임자 결정, D-27)
검증 중 `npm start` 후 웹 접속이 `react-native-web`을 찾지 못해 실패했습니다. 템플릿의 웹 설정이 남아 있었지만 의존성이 없었던 것입니다. 제품 책임자가 "웹앱이므로 웹과 앱 둘 다 지원해야 한다"고 결정(D-27)해, `react-native-web`·`@expo/metro-runtime`을 추가하고 `npm run export`와 CI가 세 플랫폼 번들을 모두 빌드하도록 했습니다. ADR-0001에 변경 사항(Amendment)을, `docs/10`에 D-27을 기록했습니다. 웹에는 `expo-secure-store`가 없어 토큰 저장 방식은 인증 작업(D-16, FND-04)에서 결정하도록 남겼습니다.
