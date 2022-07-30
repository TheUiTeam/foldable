import { FC, useEffect } from 'react';

export const Call: FC<{ back(): void }> = ({ back }) => {
  useEffect(() => {
    back();
  }, []);

  return null;
};
