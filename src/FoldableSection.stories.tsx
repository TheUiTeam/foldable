import { lazy, useMemo, useState } from 'react';

import { FoldableSection } from './FoldableSection';

const TIMEOUT = 1000;

const content = (
  <>
    <span>content</span>
    {Array.from({ length: 30 }).map((_, index) => (
      <span key={index}>
        line {index}
        <br />
      </span>
    ))}
  </>
);

export const StaticFoldable = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)} type="button">
        toggle
      </button>
      <FoldableSection open={open} transitionDuration={TIMEOUT}>
        {content}
      </FoldableSection>
    </>
  );
};

export const DynamicFoldable = () => {
  const [open, setOpen] = useState(false);

  const DynamicContent = useMemo(() => lazy(() => Promise.resolve({ default: () => <>{content}</> })), []);

  return (
    <>
      <button onClick={() => setOpen(!open)} type="button">
        toggle
      </button>
      <FoldableSection open={open} transitionDuration={TIMEOUT}>
        <DynamicContent />
      </FoldableSection>
    </>
  );
};

export const OpenedFoldable = () => {
  return (
    <>
      <FoldableSection open={true} transitionDuration={TIMEOUT}>
        {content}
      </FoldableSection>
    </>
  );
};

const after = (tm: number) => new Promise((resolve) => setTimeout(resolve, tm));

export const DelayedFoldable = () => {
  const [open, setOpen] = useState(false);

  const DynamicContent = useMemo(() => lazy(() => after(1000).then(() => ({ default: () => <>{content}</> }))), []);

  return (
    <>
      <button onClick={() => setOpen(!open)} type="button">
        toggle, will be displayed with delay
      </button>
      <FoldableSection open={open} transitionDuration={TIMEOUT}>
        <DynamicContent />
      </FoldableSection>
    </>
  );
};

export const SummaryFoldable = () => {
  const [open, setOpen] = useState(false);

  return (
    <details>
      <summary onClick={() => setOpen(!open)}>toggle</summary>
      <FoldableSection open={open} transitionDuration={TIMEOUT}>
        {content}
      </FoldableSection>
    </details>
  );
};

export const PersistentFoldable = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)} type="button">
        toggle
      </button>
      <FoldableSection open={open} transitionDuration={TIMEOUT} keepContent>
        {content}
      </FoldableSection>
    </>
  );
};

export const TransitionControlledFoldable = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)} type="button">
        toggle
      </button>
      <FoldableSection
        open={open}
        transitionDuration={TIMEOUT}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {content}
      </FoldableSection>
    </>
  );
};

export default {};
