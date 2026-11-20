import { act, renderHook } from '@testing-library/react-native';
import { cleanup, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import type { ReactNode } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { formatRecordDate, RecordsProvider, useRecords } from '@/journal';

// LUN-21 / docs/02 (save without AI, D-32). Records live in memory only (ADR-0003).
// fireEvent is async in React Native Testing Library 14: always await it.

const TEXT = '오늘은 발표가 끝나서 마음이 놓였다.';

// Starts from Today, as a person does, so Back from the detail returns to Today.
async function openEditor() {
  await renderRouter('./app', { initialUrl: '/' });
  await fireEvent.press(await screen.findByRole('button', { name: '오늘 기록 시작' }));
  return screen.findByLabelText('일기 입력');
}

async function writeAndSave(text: string) {
  await fireEvent.changeText(await openEditor(), text);
  await fireEvent.press(screen.getByRole('button', { name: '저장' }));
}

async function openCollection() {
  await fireEvent.press(await screen.findByLabelText('Collection, tab, 2 of 3'));
  return screen.findByRole('header', { name: 'Collection' });
}

describe('records store', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <RecordsProvider>{children}</RecordsProvider>
  );

  it('saves a record with no emotions', async () => {
    const { result } = await renderHook(() => useRecords(), { wrapper });
    await act(async () => {
      result.current.addRecord('감정 없이 쓴 글');
    });
    expect(result.current.records).toHaveLength(1);
    expect(result.current.records[0].emotions).toEqual([]);
  });

  it('stores the text exactly as typed, without trimming', async () => {
    const { result } = await renderHook(() => useRecords(), { wrapper });
    await act(async () => {
      result.current.addRecord('  첫 줄\n\n둘째 줄  ');
    });
    expect(result.current.records[0].text).toBe('  첫 줄\n\n둘째 줄  ');
  });

  it('keeps the newest record first and gives every record its own id and time', async () => {
    const { result } = await renderHook(() => useRecords(), { wrapper });
    await act(async () => {
      result.current.addRecord('먼저');
      result.current.addRecord('나중');
    });
    const [newest, oldest] = result.current.records;
    expect([newest.text, oldest.text]).toEqual(['나중', '먼저']);
    expect(newest.id).not.toBe(oldest.id);
    expect(newest.createdAt).toBeInstanceOf(Date);
  });

  it('refuses text that is empty or only whitespace', async () => {
    const { result } = await renderHook(() => useRecords(), { wrapper });
    await act(async () => {
      expect(result.current.addRecord('  \n ')).toBeNull();
    });
    expect(result.current.records).toEqual([]);
  });
});

describe('formatRecordDate', () => {
  it('writes a plain Korean date and 24-hour time in local time', () => {
    expect(formatRecordDate(new Date(2026, 10, 19, 21, 5))).toBe('2026년 11월 19일 21:05');
  });
});

describe('Collection', () => {
  it('shows a calm empty state with a way to start a record', async () => {
    await renderRouter('./app', { initialUrl: '/' });
    await openCollection();
    expect(await screen.findByText('저장한 기록이 여기에 모여요.')).toBeOnTheScreen();
    expect(screen.queryByText(/연속|스트릭|점수|끊겼|더 써/)).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: '기록 쓰기' }));
    expect(await screen.findByLabelText('일기 입력')).toBeOnTheScreen();
  });
});

describe('save flow', () => {
  // Each test starts clean: spies are removed with their call history and rendered screens are
  // unmounted, so no test depends on which one ran before it.
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    cleanup();
  });

  it('lands on the saved record and shows the exact original text', async () => {
    const text = '  첫 줄\n\n둘째 줄  ';
    await writeAndSave(text);
    expect(await screen.findByTestId('record-text')).toHaveTextContent(text, { exact: true });
  });

  // On iOS a plain announcement interrupts what VoiceOver is reading; the queued one waits.
  it('queues the announcement behind the current reading on iOS', async () => {
    const original = Platform.OS;
    Platform.OS = 'ios';
    const plain = jest
      .spyOn(AccessibilityInfo, 'announceForAccessibility')
      .mockImplementation(() => {});
    const queued = jest
      .spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions')
      .mockImplementation(() => {});
    // Only calls made after this point count, whatever an earlier test left behind.
    plain.mockClear();
    queued.mockClear();
    try {
      await writeAndSave(TEXT);
      await screen.findByText('저장했어요.');
      expect(queued).toHaveBeenCalledWith('저장했어요.', { queue: true });
      expect(plain).not.toHaveBeenCalled();
    } finally {
      Platform.OS = original;
    }
  });

  it('shows the record in Collection, newest first, with its date', async () => {
    await writeAndSave('첫 기록');
    await fireEvent.press(await screen.findByRole('button', { name: '뒤로' }));
    await fireEvent.press(await screen.findByRole('button', { name: '오늘 기록 시작' }));
    await fireEvent.changeText(await screen.findByLabelText('일기 입력'), '둘째 기록');
    await fireEvent.press(screen.getByRole('button', { name: '저장' }));
    await fireEvent.press(await screen.findByRole('button', { name: '뒤로' }));
    await openCollection();
    const items = await screen.findAllByRole('button', { name: /^\d{4}년/ });
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('둘째 기록', { exact: false });
    expect(items[1]).toHaveTextContent('첫 기록', { exact: false });
    expect(screen.getAllByText(/^\d{4}년 \d{1,2}월 \d{1,2}일 \d{2}:\d{2}$/)).toHaveLength(2);
  });

  it('opens the detail from Collection with the exact text', async () => {
    await writeAndSave(TEXT);
    await fireEvent.press(await screen.findByRole('button', { name: '뒤로' }));
    await openCollection();
    await fireEvent.press(await screen.findByRole('button', { name: /^\d{4}년/ }));
    expect(await screen.findByTestId('record-text')).toHaveTextContent(TEXT, { exact: true });
    // Re-reading a record does not say "saved" again.
    expect(screen.queryByText('저장했어요.')).toBeNull();
  });

  it('clears the draft after saving', async () => {
    await writeAndSave(TEXT);
    await fireEvent.press(await screen.findByRole('button', { name: '뒤로' }));
    expect(await screen.findByRole('button', { name: '오늘 기록 시작' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: '이어서 쓰기' })).toBeNull();
  });

  it('creates one record when Save is pressed twice in a row', async () => {
    await fireEvent.changeText(await openEditor(), TEXT);
    const save = screen.getByRole('button', { name: '저장' });
    // Both taps arrive before the screen can re-render, so they run in one act().
    await act(async () => {
      void fireEvent.press(save);
      void fireEvent.press(save);
    });
    await fireEvent.press(await screen.findByRole('button', { name: '뒤로' }));
    await openCollection();
    expect(await screen.findAllByRole('button', { name: /^\d{4}년/ })).toHaveLength(1);
  });

  it('keeps Save disabled for whitespace-only text, so nothing is saved', async () => {
    await fireEvent.changeText(await openEditor(), '   ');
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('has no emotion step on a plain save', async () => {
    await fireEvent.changeText(await openEditor(), TEXT);
    expect(screen.queryByText(/감정/)).toBeNull();
  });

  it('shows a calm message for a record that does not exist', async () => {
    await renderRouter('./app', { initialUrl: '/record/nope' });
    expect(await screen.findByText('이 기록을 찾을 수 없어요.')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Collection으로' }));
    expect(await screen.findByRole('header', { name: 'Collection' })).toBeOnTheScreen();
  });

  // The default platform in tests is iOS; this one checks the other platforms.
  it('says it saved once, calmly, and announces it for screen readers', async () => {
    const original = Platform.OS;
    Platform.OS = 'android';
    const announce = jest
      .spyOn(AccessibilityInfo, 'announceForAccessibility')
      .mockImplementation(() => {});
    announce.mockClear();
    try {
      await writeAndSave(TEXT);
      expect(await screen.findByText('저장했어요.')).toBeOnTheScreen();
      expect(announce).toHaveBeenCalledWith('저장했어요.');
      expect(screen.queryByText(/잘했어요|축하|연속|점수/)).toBeNull();
    } finally {
      Platform.OS = original;
    }
  });
});
