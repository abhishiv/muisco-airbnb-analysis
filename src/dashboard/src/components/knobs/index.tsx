import React from "react";

import styles from "./knobs.scss";
import { Dashboard } from "../../../specs/index";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";

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

export default function Knobs(props: KnobsProps) {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.body}>
        <div className={styles.list} key={"city"}>
          {props.dashboard.meta.cities.map((city: any, i) => {
            return (
              <Link
                key={i}
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
        <div className={styles.list} key={"roomtype"}>
          {props.dashboard.meta.roomType.map((roomType: any) => {
            return <div className={styles.item}>{roomType}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
