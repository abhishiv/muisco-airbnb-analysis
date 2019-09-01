import React from "react";

import styles from "./knobs.scss";

interface HeaderProps {}
export function Header(props: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src="https://www.grati.co/_static/server/assets/images/origami.png" />
        airbnb{" "}
      </div>
    </div>
  );
}

export interface KnobsProps {}
export default function Knobs(props: KnobsProps) {
  return (
    <div className={styles.container}>
      <Header />
    </div>
  );
}
