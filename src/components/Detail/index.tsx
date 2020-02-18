import React, { FC } from "react";
import styles from "./index.module.scss";

interface IDetail {
  vol: string;
  open: string;
  high: string;
  low: string;
}

const Detail: FC<IDetail> = ({ open, vol, high, low }) => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <span>今开</span>
        <span>{open}</span>
      </div>
      <i className={styles.divider} />
      <div className={styles.item}>
        <span>最高</span>
        <span>{high}</span>
      </div>
      <i className={styles.divider} />
      <div className={styles.item}>
        <span>最低</span>
        <span>{low}</span>
      </div>
      <i className={styles.divider} />
      <div className={styles.item}>
        <span>成交量</span>
        <span>{vol}</span>
      </div>
    </div>
  );
};

export default Detail;
