import React, { PropsWithChildren } from 'react';
import { LayoutProvider } from '~/v4/social/providers/LayoutProvider';
import styles from './Main.module.css';

type MainLayoutProps = PropsWithChildren<{
  aside: React.ReactNode;
}>;

export const MainLayout = ({ aside, children }: MainLayoutProps) => {
  return (
    <LayoutProvider>
      <div className={styles.layout}>
        <aside className={styles.layout__aside}>{aside}</aside>
        <main className={styles.layout__main}>{children}</main>
      </div>
    </LayoutProvider>
  );
};
