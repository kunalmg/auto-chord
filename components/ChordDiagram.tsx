import type { Fingering } from "@/lib/chords";

export default function ChordDiagram({
  name,
  fingering,
}: {
  name: string;
  fingering: Fingering;
}) {
  const maxFret = Math.max(...fingering.filter((n) => n > 0), 3);
  const startFret = maxFret > 4 ? Math.min(...fingering.filter((n) => n > 0)) : 1;
  const frets = Array.from({ length: 5 }, (_, i) => startFret + i);
  const strings = [0, 1, 2, 3, 4, 5]; // E A D G B E
  const w = 120;
  const h = 150;
  const pad = 20;
  const gridW = w - pad * 2;
  const gridH = h - pad * 2 - 20;
  const dx = gridW / (strings.length - 1);
  const dy = gridH / (frets.length - 1);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
      <div className="text-xs text-white/80">{name}</div>
      <svg width={w} height={h} className="mt-1">
        <g transform={`translate(${pad},${pad})`}>
          {strings.map((s, i) => (
            <line
              key={`s${s}`}
              x1={i * dx}
              y1={0}
              x2={i * dx}
              y2={gridH}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1}
            />
          ))}
          {frets.map((f, i) => (
            <line
              key={`f${f}`}
              x1={0}
              y1={i * dy}
              x2={gridW}
              y2={i * dy}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={i === 0 && startFret === 1 ? 3 : 1}
            />
          ))}
          {fingering.map((f, i) => {
            const x = i * dx;
            if (f === -1) {
              return (
                <text key={`m${i}`} x={x} y={-6} fontSize="10" fill="white" textAnchor="middle">
                  x
                </text>
              );
            }
            if (f === 0) {
              return (
                <circle key={`o${i}`} cx={x} cy={-6} r={3} fill="none" stroke="white" />
              );
            }
            const fretIdx = f - startFret + 0.5;
            return (
              <circle
                key={`p${i}`}
                cx={x}
                cy={fretIdx * dy}
                r={6}
                fill="white"
                opacity={0.9}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

