import React, { FC } from "react";
import styles from "./index.module.scss";

interface IHeader {
  name: string;
  close: string;
  price: string;
  change: string;
  changePer: string;
}

const Header: FC<IHeader> = ({ name, close, price, change, changePer }) => {
  return (
    <div className={styles.container}>
      <div className={styles.equity_name}>{name}</div>
      <div className={styles.equity_overview}>
        <div className={styles.equity_overview_item}>
          <div>
            <span>{close}</span>
            <span>{change}</span>
          </div>
          <span>At Close</span>
        </div>
        <i className={styles.divider} />
        <div className={styles.equity_overview_item}>
          <div>
            <span>{price}</span>
            <span>{changePer}</span>
          </div>
          <span>After Hours</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
