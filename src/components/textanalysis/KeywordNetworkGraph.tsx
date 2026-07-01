"use client";

import { useState } from "react";

interface KeywordNode {
  word: string;
  count: number;
}

interface KeywordNetworkGraphProps {
  centerWord: string;
  keywords: KeywordNode[];
  onSelectWord: (word: string) => void;
}

const WIDTH = 640;
const HEIGHT = 320;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const RADIUS = 110;
const CENTER_NODE_R = 36;

const EDGE_COLOR = "#8B97A8";
const NODE_COLOR = "#6A90AA";
const NODE_HOVER_COLOR = "#3E6FA3";
const CENTER_COLOR = "#1E2D3D";

export default function KeywordNetworkGraph({ centerWord, keywords, onSelectWord }: KeywordNetworkGraphProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const maxCount = Math.max(...keywords.map((k) => k.count), 1);
  const n = keywords.length;

  const nodes = keywords.map((k, i) => {
    const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
    const ratio = k.count / maxCount;
    return {
      ...k,
      x: CENTER_X + RADIUS * Math.cos(angle),
      y: CENTER_Y + RADIUS * Math.sin(angle),
      r: 15 + ratio * 13,
      strokeWidth: 1.5 + ratio * 4.5,
      opacity: 0.3 + ratio * 0.4,
      labelBelow: Math.sin(angle) > 0.15,
    };
  });

  const hoveredNode = nodes.find((n) => n.word === hovered) ?? null;

  return (
    <div className="relative bg-white border border-light-gray overflow-hidden pb-24">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Keyword network centered on ${centerWord}`}
      >
        {nodes.map((node) => (
          <line
            key={`edge-${node.word}`}
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={node.x}
            y2={node.y}
            stroke={EDGE_COLOR}
            strokeWidth={node.strokeWidth}
            opacity={hovered === node.word ? Math.min(1, node.opacity + 0.3) : node.opacity}
            className="transition-museum"
          />
        ))}

        {nodes.map((node) => (
          <g
            key={node.word}
            onClick={() => onSelectWord(node.word)}
            onMouseEnter={() => setHovered(node.word)}
            onMouseLeave={() => setHovered((h) => (h === node.word ? null : h))}
            className="cursor-pointer"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={hovered === node.word ? NODE_HOVER_COLOR : NODE_COLOR}
              className="transition-museum"
            />
            <text
              x={node.x}
              y={node.labelBelow ? node.y + node.r + 14 : node.y - node.r - 8}
              textAnchor="middle"
              dominantBaseline={node.labelBelow ? "hanging" : "auto"}
              className="select-none transition-museum"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                fontWeight: hovered === node.word ? 700 : 500,
                fill: hovered === node.word ? NODE_HOVER_COLOR : "#1E2D3D",
              }}
            >
              {node.word}
            </text>
          </g>
        ))}

        <circle cx={CENTER_X} cy={CENTER_Y} r={CENTER_NODE_R} fill={CENTER_COLOR} />
        <text
          x={CENTER_X}
          y={CENTER_Y}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            fill: "#fff",
          }}
        >
          {centerWord}
        </text>
      </svg>

      {hoveredNode && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-ink text-white text-xs px-4 py-2 text-center shadow-lg z-10 max-w-[90%]">
          &ldquo;{centerWord}&rdquo; ↔ &ldquo;{hoveredNode.word}&rdquo; · co-occurs in {hoveredNode.count} excerpt{hoveredNode.count === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}
