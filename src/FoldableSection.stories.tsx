import { lazy, useMemo, useState } from 'react';

import { FoldableSection } from './FoldableSection';

const TIMEOUT = 1000;

const content = (
  <>
    <span>content</span>
    {Array.from({ length: 100 }).map((_, index) => (
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

const after = (tm: number) => new Promise((resolve) => setTimeout(resolve, tm));

export const DelayedFoldable = () => {
  const [open, setOpen] = useState(false);

  const DynamicContent = useMemo(() => lazy(() => after(1000).then(() => ({ default: () => <>{content}</> }))), []);

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

export default {};
