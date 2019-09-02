import React, { useRef } from "react";

import styles from "./knobs.scss";
import { Dashboard } from "../../../specs/index";
import { RouteComponentProps } from "react-router";
import { useSpring, useChain, animated, config } from "react-spring";
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

type PathParamsType = {
  cityName: string;
};

// Your component own properties
type KnobsProps = RouteComponentProps<PathParamsType> & {
  dashboard: Dashboard;
};
import { Link } from "react-router-dom";

function Knobs(props: KnobsProps) {
  return (
    <React.Fragment>
      <Header />
      <div className={styles.body}>
        <div className={styles.listContainer}>
          <div>City</div>
          <div className={styles.list} key={"city"}>
            {props.dashboard.meta.cities.map((city: any, i) => {
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
        <div className={styles.listContainer}>
          <div>Room Type</div>
          <div className={styles.list} key={"roomtype"}>
            {props.dashboard.meta.roomType.map((roomType: any, i: number) => {
              return (
                <div key={i} className={styles.item}>
                  {roomType}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default function KnobsAnimated(props: KnobsProps) {
  const springRef = useRef();
  const { size, opacity, ...rest } = useSpring({
    ref: springRef as any,
    config: config.stiff,
    from: { transform: "translateY(-100%)", opacity: 0 },
    to: { transform: " translateY(0%)", opacity: 1 }
  });
  useChain([springRef]);
  return (
    <animated.div className={styles.container} style={{ ...rest }}>
      <Knobs {...props} />
    </animated.div>
  );
}
