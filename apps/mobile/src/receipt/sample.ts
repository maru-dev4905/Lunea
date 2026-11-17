import type { ReceiptData } from './types';

// Synthetic data only. No real journal text, ever (the repository is public). The prices,
// balance and streak are made-up numbers. Several feelings sit side by side and none is ranked.
export const SAMPLE_RECEIPT: ReceiptData = {
  receiptNo: 'No. 20261116-0001',
  dateTime: '2026.11.16  21:40',
  event: '프로젝트 발표를 마쳤다.',
  items: [
    { label: '안도감', price: 3200, quote: '발표가 끝나서 마음이 놓였어.' },
    { label: '자부심', price: 4500, quote: '준비한 만큼 잘 끝낸 것 같아.' },
    { label: '조금 지침', price: 1800, quote: '집에 오니 몸이 무거웠어.' },
  ],
  balance: 128400,
  streakDays: 3,
  thanks: '오늘 하루도 수고했어요.',
  note: '연습용 예시예요. 실제 기록이 아니고 금액도 임의의 값이에요.',
};
