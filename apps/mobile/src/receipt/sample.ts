import type { ReceiptData } from './types';

// Synthetic data only. No real journal text, ever (the repository is public).
// Several feelings sit side by side and none is ranked or scored.
export const SAMPLE_RECEIPT: ReceiptData = {
  dateLabel: '11월 16일',
  event: '프로젝트 발표를 마쳤다.',
  items: [
    { label: '안도감', quote: '발표가 끝나서 마음이 놓였어.' },
    { label: '자부심', quote: '준비한 만큼 잘 끝낸 것 같아.' },
    { label: '조금 지침', quote: '집에 오니 몸이 무거웠어.' },
  ],
  note: '연습용 예시예요. 실제 기록이 아니에요.',
};
