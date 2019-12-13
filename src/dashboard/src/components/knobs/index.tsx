import React from "react";

import styles from "./knobs.scss";
import { Dashboard } from "../../../specs/index";
//import { useLocation } from "react-router";
import { useSpring, animated, config } from "react-spring";
import { Link } from "react-router-dom";

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

// Your component own properties
type KnobsProps = {
  dashboard: Dashboard;
};

function Knobs(props: KnobsProps) {
  return (
    <React.Fragment>
      <Header />
      <div className={styles.body}>
        <div className={styles.listContainer}>
          <div>City</div>
          <div className={styles.list} key={"city"}>
            {props.dashboard.meta.cities.map((city, i) => {
              return (
                <Link
                  key={i}
                  title={city.name}
                  to={"/works/airbnb-analysis/" + city.id}
                  className={styles.item}
                >
                  <span
                    className={styles.icon}
                    dangerouslySetInnerHTML={{ __html: city.icon }}
                  ></span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className={styles.listContainer}></div>
      </div>
    </React.Fragment>
  );
}

export default function KnobsAnimated(props: KnobsProps) {
  const { ...rest } = useSpring({
    config: config.stiff,
    from: { transform: "translateY(-10px)", opacity: 0 },
    to: { transform: " translateY(0px)", opacity: 1 }
  });
  return (
    <animated.div className={styles.container} style={{ ...rest }}>
      <Knobs {...props} />
    </animated.div>
  );
}
