'use client';

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from 'recharts';
import styles from './SkillMatrix.module.scss';

export interface SkillData {
  category: string;
  score: number;
  fullMark: number;
}

interface SkillMatrixProps {
  data: SkillData[];
}

export const SkillMatrix = ({ data }: SkillMatrixProps) => {
  return (
    <div>
      <div className={styles.container}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} className="skill-matrix-radar">
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
            <Radar
              name="Skills"
              dataKey="score"
              stroke="#d946ef"
              fill="#d946ef"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with scores */}
      <div className={styles.legend}>
        {data.map((item) => (
          <div key={item.category} className={styles.legendItem}>
            <div className={styles.legendDot} />
            <span className={styles.legendLabel}>{item.category}</span>
            <span className={styles.legendValue}>{item.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
