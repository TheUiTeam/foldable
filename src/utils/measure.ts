import { styles } from '../styles';

export const measure = (ref: HTMLDivElement) => {
  ref.classList.add(styles.noAnimation);
  ref.classList.add(styles.measureMaxHeight);

  const height = ref.offsetHeight || 0;
  ref.classList.remove(styles.measureMaxHeight);

  // toggle update to revert stytle update
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  ref.offsetHeight;
  ref.classList.remove(styles.noAnimation);

  return height;
};
