'use client';

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
} from 'recharts';
import styles from './ActivityChart.module.scss';

export interface ActivityData {
  day: string;
  score: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{payload[0].payload.day}</div>
        <div className={styles.tooltipValue}>{payload[0].value}% Score</div>
      </div>
    );
  }
  return null;
};

export const ActivityChart = ({ data }: ActivityChartProps) => {
  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          className="activity-chart"
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} tick={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(217, 70, 239, 0.1)' }} />
          <Bar
            dataKey="score"
            fill="rgba(217, 70, 239, 0.3)"
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: 'rgba(217, 70, 239, 0.6)' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
