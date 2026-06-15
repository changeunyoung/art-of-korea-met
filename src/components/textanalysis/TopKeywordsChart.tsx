"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WordFrequency } from "@/lib/types";

interface TopKeywordsChartProps {
  frequencies: WordFrequency[];
  selectedWord: string | null;
  onSelectWord: (word: string) => void;
}

export default function TopKeywordsChart({ frequencies, selectedWord, onSelectWord }: TopKeywordsChartProps) {
  const data = useMemo(() => frequencies.slice(0, 20), [frequencies]);

  if (data.length === 0) {
    return <p className="text-text-gray text-sm py-12 text-center">No data to chart yet.</p>;
  }

  return (
    <div>
      <div className="bg-white border border-light-gray p-6" style={{ height: 520 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="#E7E7E7" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 12 }} stroke="#E7E7E7" />
            <YAxis
              type="category"
              dataKey="text"
              width={110}
              interval={0}
              tick={{ fill: "#2B2B2B", fontSize: 13 }}
              stroke="#E7E7E7"
            />
            <Tooltip
              cursor={{ fill: "#EAF2FF" }}
              contentStyle={{ borderColor: "#E7E7E7", fontSize: 13 }}
              formatter={(value: number) => [value, "Frequency"]}
            />
            <Bar dataKey="value" radius={[0, 2, 2, 0]} onClick={(d) => onSelectWord(d.text)} cursor="pointer">
              {data.map((entry) => (
                <Cell
                  key={entry.text}
                  fill={selectedWord === entry.text ? "#5B7FA6" : "#D6E3F7"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
