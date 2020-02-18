import React, { useEffect, useState } from 'react';

import styles from './App.module.scss';
import Detail from './components/Detail';
import Header from './components/Header';
import LineChart from './components/LineChart';
import SideBar from './components/SideBar';
import { toFixed2 } from './utils/toFixed2';

const App = () => {
  const [name] = useState("AAPL");
  const [dailyData, setDailyData] = useState({});
  const [open, setOpen] = useState();
  const [price, setPrice] = useState();
  const [close, setClose] = useState();
  const [high, setHigh] = useState();
  const [low, setLow] = useState();
  const [change, setChange] = useState();
  const [changePer, setChangePer] = useState();
  const [vol, setVol] = useState();

  useEffect(() => {
    fetch("https://my-json-server.typicode.com/b2d1/stocks/db")
      .then(stream => stream.json())
      .then(res => {
        const quoteData = res["Global Quote"];
        // 父组件的 SetXXX 会引发子组件的更新
        setDailyData(res["Time Series (Daily)"]);
        setOpen(toFixed2(quoteData["02. open"]));
        setLow(toFixed2(quoteData["04. low"]));
        setHigh(toFixed2(quoteData["03. high"]));
        setVol(toFixed2(quoteData["03. high"]));
        setClose(toFixed2(quoteData["08. previous close"]));
        setPrice(toFixed2(quoteData["05. price"]));
        setChange(toFixed2(quoteData["09. change"]));
        setChangePer(toFixed2(quoteData["10. change percent"]));
      });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.sideBar}>
        <SideBar />
      </div>
      <div className={styles.main}>
        <div className={styles.main_container}>
          <Header {...{ name, price, close, change, changePer }} />
          <Detail {...{ open, high, low, vol }} />
          <LineChart {...{ dailyData }} height={400} />
        </div>
      </div>
    </div>
  );
};

export default App;
