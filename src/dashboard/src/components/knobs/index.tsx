import React from "react";

import styles from "./knobs.scss";

interface HeaderProps {}
export function Header(props: HeaderProps) {
  return <div className={styles.header}>airbnb </div>;
}

export interface KnobsProps {}
export default function Knobs(props: KnobsProps) {
  return (
    <div className={styles.container}>
      <Header />
    </div>
  );
}
