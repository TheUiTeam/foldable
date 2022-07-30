import { styleSingleton } from 'react-style-singleton';

const Style = styleSingleton();

export const styles = {
  base: 'foldable_base',
  section: 'foldable_section',
  measureMaxHeight: 'foldable_measureMaxHeight',
  noAnimation: 'foldable_noAnimation',
};

export const Styles = () => (
  <Style
    styles={`
.${styles.base} {
	transition-property: height, max-height;
	transition-duration: var(--duration);
	overflow-anchor: none;
}

.${styles.section} {
	overflow: hidden;
}

.${styles.measureMaxHeight} {
	height: 100% !important;
	max-height: 100% !important;
}

.${styles.noAnimation} {
	transition-property: none !important;
	transition-duration: 0ms !important;
}
`}
  />
);
