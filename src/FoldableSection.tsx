import { FC, ReactNode, Suspense } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Styles, styles } from './styles';
import { Call } from './utils/Callback';
import { measure } from './utils/measure';
import { usePrevious } from './utils/use-previous';


type FoldableType = {
  children: ReactNode;
  className?: string;
  style?: CSSStyleDeclaration;

  /**
   * control foldable section behaviour
   */
  open: boolean;
  /**
   * configures property to control.
   * @default 'max-height'
   */
  controlProperty?: 'height' | 'maxHeight';
  transitionDuration?: number;
};

type Phase =
  // nothing is happening
  | 'idle'
  // preparing content for measure. it will be rendered
  | 'preparing'
  // content will be measured
  | 'measuring'
  // animating to opened or closed state
  | 'animating';

export const FoldableSection: FC<FoldableType> = ({
  className,
  controlProperty = 'maxHeight',
  open: openProp,
  children,
  transitionDuration = 300,
}) => {
  const [open, setIsOpen] = useState(openProp);
  const [state, setState] = useState<Phase>('idle');

  const [maxHeight, setMaxHeight] = useState(0);

  const blockRef = useRef<HTMLDivElement>(null);

  const wasOpen = usePrevious(openProp);

  const isChanging = openProp !== wasOpen || openProp !== open;

  useEffect(() => {
    const { current: ref } = blockRef;

    if (!isChanging || !ref) {
      return;
    }

    if (state === 'idle') {
      // if changes has to be applied, but component is in "Idle" mode
      // - first disable Idle mode, to prepare component to further transitions
      // and only then proceed
      setState('preparing');
      // will be later advanced to 'measuring'
    }

    if (['measuring'].includes(state)) {
      setMaxHeight(measure(ref));

      if (openProp) {
        setIsOpen(openProp);
      }

      setState('animating');
    }

    if (['animating'].includes(state)) {
      setIsOpen(openProp);
    }
  }, [state, isChanging]);

  useEffect(() => {
    if (state === 'animating') {
      // fallback to idle state at the end of any animation
      const tm = setTimeout(() => {
        setState('idle');
      }, transitionDuration);

      return () => {
        clearTimeout(tm);
      };
    }

    return () => null;
  }, [state, openProp]);

  const idle = state === 'idle';

  return (
    <>
      {(open || !idle) && <Styles />}
      <div
        className={[className, styles.base, (!open || !idle) && styles.section].filter(Boolean).join(' ')}
        ref={blockRef}
        style={{
          [controlProperty]: open ? (idle ? undefined : maxHeight) : 0,
          // @ts-expect-error
          '--duration': `${transitionDuration}ms`,
        }}
      >
        <Suspense fallback="">
          {(open || !idle) && children}
          {state === 'preparing' && <Call back={() => setState('measuring')} />}
        </Suspense>
      </div>
    </>
  );
};
