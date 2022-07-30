/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react/pure';

import { DynamicFoldable, StaticFoldable } from '../FoldableSection.stories';

const toggler = () => screen.getByText('toggle');
const content = () => screen.queryByText('content');

describe('Static foldable section', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    render(<StaticFoldable />);
  });

  afterAll(() => {
    cleanup();
  });

  it('initial state', () => {
    // initially not visible
    expect(content()).not.toBeInTheDocument();
  });

  it('content is available right after opening', () => {
    // open
    fireEvent.click(toggler());
    expect(content()).toBeInTheDocument();
  });

  it('content is available for a certain period of time after close', async () => {
    // close
    fireEvent.click(toggler());
    // still visible / not idle
    expect(content()).toBeInTheDocument();
    // will be removed in 1s
    jest.advanceTimersByTime(1000);
    await waitFor(() => expect(content()).not.toBeInTheDocument());
  });
});

describe('dynamic foldable', () => {
  it('content is not available right after opening, but will be there next tick', async () => {
    render(<DynamicFoldable />);
    // open
    fireEvent.click(toggler());
    expect(content()).not.toBeInTheDocument();
    await Promise.resolve();
    expect(content()).not.toBeInTheDocument();

    cleanup();
  });
});
