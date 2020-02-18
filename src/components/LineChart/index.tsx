/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef } from "react";

import { toFixed2 } from "../../utils/toFixed2";
import styles from "./index.module.scss";

enum Stock {
  CLOSE = "4. close",
  LOW = "3. low",
  HIGH = "2. high"
}
interface IDailyData {
  [status: string]: string;
}
interface ICoordinates {
  x: number;
  y: number;
}
interface ILineChart {
  height: number;
  dailyData: {
    [date: string]: IDailyData;
  };
}

const LineChart: FC<ILineChart> = ({ dailyData, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartConRef = useRef<HTMLDivElement>(null);
  const canvasEventRef = useRef<HTMLCanvasElement>(null);
  // canvas 实际高度
  const HEIGHT = height - 100,
    OFFSET_X = 30,
    OFFSET_Y = 30,
    GROUP_X = 4,
    GROUP_Y = 4;
  let WIDTH: number,
    LOW_Y: number,
    HIGH_Y: number,
    DISTANCE_Y: number,
    days: number,
    dailyArr: IDailyData[],
    dateArr: string[],
    coordinatesArr: ICoordinates[],
    ctx1: CanvasRenderingContext2D,
    ctx2: CanvasRenderingContext2D;

  // 初始化
  const initChart = () => {
    WIDTH = chartConRef.current?.offsetWidth ?? 1024;
    const canvasEle = canvasRef.current;
    const canvasEventEle = canvasEventRef.current;

    if (canvasEle) {
      canvasEle.width = WIDTH;
      canvasEle.height = height;
      ctx1 = canvasEle.getContext("2d")!;
    }
    if (canvasEventEle) {
      canvasEventEle.width = WIDTH;
      canvasEventEle.height = height;
      ctx2 = canvasEventEle.getContext("2d")!;
    }
    dailyArr = Object.values(dailyData);
    dateArr = Object.keys(dailyData);
    days = dateArr.length;
  };

  // 计算纵坐标上下限值
  const calcY = () => {
    let lowStock = parseFloat(dailyArr[0][Stock.CLOSE]);
    let highStock = parseFloat(dailyArr[0][Stock.CLOSE]);
    for (let i = 1; i < days - 1; i++) {
      const dayClose = parseFloat(dailyArr[i][Stock.CLOSE]);
      if (dayClose < lowStock) {
        lowStock = dayClose;
      }
      if (dayClose > highStock) {
        highStock = dayClose;
      }
    }
    lowStock = Math.floor(lowStock);
    highStock = Math.ceil(highStock);
    for (let i = 0; i < 10; i++) {
      if ((lowStock - i) % 10 === 0) {
        LOW_Y = lowStock - i;
      }
      if ((highStock + i) % 10 === 0) {
        HIGH_Y = highStock + i;
      }
    }

    DISTANCE_Y = HIGH_Y - LOW_Y;
  };

  // 绘制横坐标
  const drawX = () => {
    for (let i = 1; i < GROUP_X; i++) {
      const x = OFFSET_X + (WIDTH / GROUP_X) * i,
        y = HEIGHT + OFFSET_Y;
      ctx1.beginPath();
      ctx1.strokeStyle = "#939393";
      ctx1.moveTo(x, y);
      ctx1.lineTo(x, y + 10);
      ctx1.stroke();
      ctx1.font = "12px JetBrainsMono";
      ctx1.fillStyle = "#939393";
      ctx1.fillText(`${dateArr[days - (i * days) / GROUP_X]}`, x - 35, y + 25);
    }
  };

  // 绘制纵坐标
  const drawY = () => {
    const step = DISTANCE_Y / GROUP_Y;
    for (let i = 0; i <= GROUP_Y; i++) {
      ctx1.beginPath();
      ctx1.strokeStyle = "rgba(164,164,164,.1)";
      ctx1.lineWidth = 1;
      if (i === GROUP_Y) {
        ctx1.strokeStyle = "#939393";
      }
      const y = OFFSET_Y + (HEIGHT / GROUP_Y) * i;
      ctx1.moveTo(OFFSET_X, y);
      ctx1.lineTo(WIDTH, y);
      ctx1.stroke();
      ctx1.fillStyle = "#939393";
      ctx1.fillText(`${HIGH_Y - step * i}`, 0, y + 5);
    }
  };

  // 绘制渐变背景色
  const drawLinearGradientBg = () => {
    ctx1.beginPath();
    const gradient = ctx1.createLinearGradient(
      OFFSET_X,
      OFFSET_X,
      OFFSET_X,
      HEIGHT
    );
    gradient.addColorStop(0, "rgba(236,77,61,.5)");
    gradient.addColorStop(1, "transparent");
    ctx1.fillStyle = gradient;
    ctx1.rect(OFFSET_X, OFFSET_Y, WIDTH, HEIGHT);
    ctx1.fill();
  };

  // 绘制蒙层
  const drawMask = (maskColor: string) => {
    ctx1.beginPath();
    ctx1.moveTo(WIDTH, OFFSET_Y);

    coordinatesArr = [];
    for (let i = 0; i < days; i++) {
      const x = WIDTH - ((WIDTH - OFFSET_X) / (days - 1)) * i,
        y =
          ((HIGH_Y - parseFloat(dailyArr[i][Stock.CLOSE])) / DISTANCE_Y) *
            HEIGHT +
          OFFSET_Y;
      // 收集坐标
      coordinatesArr.push({ x, y });
      ctx1.lineTo(x, y);
    }
    ctx1.lineTo(OFFSET_X, OFFSET_Y);
    ctx1.fillStyle = maskColor;
    ctx1.fill();
  };

  // 绘制折线
  const drawLine = () => {
    ctx1.beginPath();
    ctx1.strokeStyle = "#d23f31";
    ctx1.lineWidth = 2;
    ctx1.moveTo(coordinatesArr[0].x, coordinatesArr[0].y);
    for (let i = 1; i < days; i++) {
      ctx1.lineTo(coordinatesArr[i].x, coordinatesArr[i].y);
    }
    ctx1.stroke();
  };

  // 开始绘制图表
  const draw = () => {
    initChart();
    drawX();
    calcY();
    drawLinearGradientBg();
    drawMask("#1e1e1e");
    drawLine();
    drawY();
  };

  // 绘制圆角矩形
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    r: number,
    fill: boolean,
    stroke: boolean
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#d7d7d7";
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.arcTo(x, y, x + r, y, r);
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
    ctx.restore();
  };

  // 绘制 tooltip
  function handleChartMove(evt: MouseEvent) {
    const offset = evt.offsetX;
    if (coordinatesArr) {
      for (let i = 0; i < coordinatesArr.length; i++) {
        if (
          offset + 2 > Math.round(coordinatesArr[i].x) &&
          offset - 2 < Math.round(coordinatesArr[i].x)
        ) {
          // 清除canvas2
          ctx2.clearRect(0, 0, WIDTH, HEIGHT + OFFSET_Y);
          // 绘制虚线
          ctx2.beginPath();
          ctx2.strokeStyle = "#909090";
          ctx2.lineWidth = 1;
          ctx2.setLineDash([4]);
          ctx2.moveTo(coordinatesArr[i].x, HEIGHT + OFFSET_Y);
          ctx2.lineTo(coordinatesArr[i].x, 80);
          ctx2.stroke();
          // 绘制圆点
          ctx2.beginPath();
          ctx2.fillStyle = "rgba(236,77,61)";
          ctx2.arc(coordinatesArr[i].x, coordinatesArr[i].y, 3, 0, 2 * Math.PI);
          ctx2.fill();

          drawRoundedRect(
            ctx2,
            coordinatesArr[i].x - 60,
            50,
            120,
            30,
            5,
            true,
            false
          );

          // 绘制tooltip文字
          ctx2.fillStyle = "#333";
          ctx2.fillText(
            `${dateArr[i]}  ${toFixed2(dailyArr[i][Stock.CLOSE])}`,
            coordinatesArr[i].x - 50,
            70
          );
          return;
        }
      }
    }
  }

  // taskkill /f /t /im [端口号]
  // netstat -ano | findstr [端口号]
  // 每次更新时，函数组件内所有变量都是新的（包括函数），他们拥有当前的唯一快照，只有 useEffect 引用会上次的函数
  // 函数组件第一次渲染，draw内的data是{}，如果deps为[],则触发resize时，data依旧是{}，报错
  useEffect(() => {
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [dailyData]);

  useEffect(() => {
    canvasEventRef.current?.addEventListener("mousemove", handleChartMove);
    return () =>
      canvasEventRef.current?.removeEventListener("mousemove", handleChartMove);
  }, [dailyData]);

  useEffect(() => {
    Object.keys(dailyData).length && draw();
  }, [dailyData]);

  return (
    <div className={styles.container} ref={chartConRef}>
      <div className={styles.chart} style={{ height }}>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={canvasEventRef} id="canvasEvent"></canvas>
      </div>
    </div>
  );
};

export default LineChart;
