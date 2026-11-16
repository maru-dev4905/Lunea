import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

// LUN-20 / docs/03 Today + Journal editor. The draft lives in memory only (ADR-0003).
//
// fireEvent is async in React Native Testing Library 14: always await it, otherwise act()
// calls overlap and navigation state leaks from one test into the next.
async function renderToday() {
  await renderRouter('./app', { initialUrl: '/' });
}

async function openEditor() {
  await renderToday();
  await fireEvent.press(await screen.findByRole('button', { name: '오늘 기록 시작' }));
  return screen.findByLabelText('일기 입력');
}

async function closeEditor() {
  await fireEvent.press(screen.getByRole('button', { name: '닫기' }));
  await screen.findByRole('header', { name: 'Today' });
}

describe('Today', () => {
  it('offers to start a record', async () => {
    await renderToday();
    expect(await screen.findByRole('button', { name: '오늘 기록 시작' })).toBeOnTheScreen();
  });

  it('has no streak, score or guilt copy (docs/03)', async () => {
    await renderToday();
    await screen.findByRole('button', { name: '오늘 기록 시작' });
    expect(screen.queryByText(/연속|스트릭|점수|끊겼/)).toBeNull();
  });
});

describe('Journal editor', () => {
  it('opens an empty editor with no emotion picker', async () => {
    const input = await openEditor();
    expect(screen).toHavePathname('/journal/new');
    expect(input).toHaveDisplayValue('');
    expect(screen.queryByText(/감정을 선택/)).toBeNull();
  });

  it('says the draft is temporary and not to write real entries yet', async () => {
    await openEditor();
    expect(screen.getByText(/임시 저장/)).toBeOnTheScreen();
  });

  it('keeps the save button disabled for empty and whitespace-only text', async () => {
    const input = await openEditor();
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
    await fireEvent.changeText(input, '  \n\t 　 ');
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('enables the save button once there is real text', async () => {
    const input = await openEditor();
    await fireEvent.changeText(input, '오늘은 발표가 끝나서 마음이 놓였다.');
    expect(screen.getByRole('button', { name: '저장' })).toBeEnabled();
  });

  it('keeps the draft when the user leaves and comes back', async () => {
    const input = await openEditor();
    await fireEvent.changeText(input, '쓰다 만 글');
    await closeEditor();

    const resume = await screen.findByRole('button', { name: '이어서 쓰기' });
    expect(screen.queryByRole('button', { name: '오늘 기록 시작' })).toBeNull();
    await fireEvent.press(resume);
    expect(await screen.findByLabelText('일기 입력')).toHaveDisplayValue('쓰다 만 글');
  });

  it('keeps the draft exactly as typed, without trimming it', async () => {
    const input = await openEditor();
    await fireEvent.changeText(input, '  첫 줄\n\n둘째 줄  ');
    await closeEditor();
    await fireEvent.press(await screen.findByRole('button', { name: '이어서 쓰기' }));
    expect(await screen.findByLabelText('일기 입력')).toHaveDisplayValue('  첫 줄\n\n둘째 줄  ');
  });

  it('does not offer to resume a draft that holds only whitespace', async () => {
    const input = await openEditor();
    await fireEvent.changeText(input, '   ');
    await closeEditor();
    expect(await screen.findByRole('button', { name: '오늘 기록 시작' })).toBeOnTheScreen();
  });
});
