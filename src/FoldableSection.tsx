import { AriaRole, FC, PropsWithChildren, ReactElement, Suspense } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Styles, styles } from './styles';
import { Call } from './utils/Callback';
import { measure } from './utils/measure';
import { usePrevious } from './utils/use-previous';

export type FoldableProps = {
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
  id?: string;
  role?: AriaRole;
  tabIndex?: -1;
  'aria-labelledby'?: string;
  /**
   * overrides default className for animation control
   */
  animationClassName?: string;

  /**
   * control foldable section behaviour
   */
  open: boolean;
  /**
   * keep content inside closed Foldables
   * @default false
   */
  keepContent?: boolean;
  /**
   * configures property to control.
   * @default 'max-height'
   */
  controlProperty?: 'height' | 'maxHeight' | `--${string}`;
  transitionDuration?: number;

  onStateChange?(state: Phase): void;
};

export type Phase =
  // nothing is happening
  | 'idle'
  // preparing content for measure. it will be rendered
  | 'preparing'
  // content will be measured
  | 'measuring'
  // animating to opened or closed state
  | 'animating';

export type MeasurableProps = { display: boolean; state: Phase; prepare: boolean; onReady(): void };

export const SuspendedMeasurement: FC<PropsWithChildren<MeasurableProps>> = ({
  children,
  display,
  prepare,
  onReady,
}) => (
  <Suspense fallback="">
    {display && children}
    {prepare && <Call back={onReady} />}
  </Suspense>
);

export const MeasurableSection: FC<
  FoldableProps & {
    children(props: MeasurableProps): ReactElement;
  }
> = ({
  style,
  className,
  animationClassName = styles.base,
  controlProperty = 'maxHeight',
  open: openProp,
  keepContent,
  children,
  transitionDuration = 300,
  onStateChange,
  ...rest
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

      setState('animating');
    }

    if (['animating'].includes(state)) {
      setIsOpen(openProp);
    }
  }, [state, isChanging]);

  // use separate effect to handle enters to Animation state
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

  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state]);

  const idle = state === 'idle';
  const measuringCallback = () => setState('measuring');
  const display = Boolean(open || !idle || keepContent);
  const prepare = state === 'preparing';

  return (
    <>
      {display && <Styles />}
      <div
        className={[className, animationClassName, (!open || !idle) && styles.section].filter(Boolean).join(' ')}
        ref={blockRef}
        style={{
          ...style,
          [controlProperty]: open ? (idle ? undefined : maxHeight) : 0,
          // @ts-expect-error
          '--foldable-duration': `${transitionDuration}ms`,
        }}
        {...rest}
      >
        {children({ display, state, prepare, onReady: measuringCallback })}
      </div>
    </>
  );
};

/**
 * A collapsible panel
 * @example
 * ```tsx
 * <FoldableSection open={isOpen}>
 *     content
 * </FoldableSection>
 * ```
 */
export const FoldableSection: FC<PropsWithChildren<FoldableProps>> = ({ children, ...props }) => (
  <MeasurableSection {...props}>
    {(props) => <SuspendedMeasurement {...props}>{children}</SuspendedMeasurement>}
  </MeasurableSection>
);
