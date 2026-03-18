import { useState, useEffect, useRef } from "react";

const GROUPS = {
  original: {
    label: "Original paper replication",
    color: "#888780",
    models: [
      { label: "Communicability (full network)", r: 0.3711 },
      { label: "Direct", r: 0.3062 },
      { label: "Shortest path", r: 0.2535 },
      { label: "Subnet communicability (voting)", r: 0.3479 },
    ]
  },
  v1: {
    label: "Version 1: new subnet methods",
    color: "#0F6E56",
    models: [
      { label: "Subnet comm. (gradient descent)", r: 0.3477 },
      { label: "Subnet comm. (simulated annealing)", r: 0.3480 },
      { label: "Subnet comm. (random search)", r: 0.3475 },
      { label: "Subnet comm. (grid search)", r: 0.3477 },
    ]
  },
  v2: {
    label: "Version 2: new subnet + whole network",
    color: "#185FA5",
    models: [
      { label: "Heat kernel", r: 0.3934 },
      { label: "Cosine communicability", r: 0.3924 },
      { label: "Normalized communicability", r: 0.3738 },
      { label: "Subnet cosine communicability", r: 0.3804 },
      { label: "Subnet heat kernel", r: 0.3753 },
      { label: "Mean first passage time", r: 0.2947 },
    ]
  }
};

const BASELINE = 0.3711;
const Y_MIN = 0.22;
const Y_MAX = 0.42;

export default function BrainConnectivityChart() {
  const [active, setActive] = useState({ original: true, v1: false, v2: false });
  const [hovered, setHovered] = useState(null);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const toggle = (key) => {
    setActive(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getData = () => {
    const labels = [], values = [], colors = [];
    Object.entries(GROUPS).forEach(([key, group]) => {
      if (!active[key]) return;
      group.models.forEach(m => {
        labels.push(m.label);
        values.push(m.r);
        colors.push(group.color);
      });
    });
    return { labels, values, colors };
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    if (typeof window === "undefined" || !window.Chart) return;

    if (chartRef.current) chartRef.current.destroy();

    const { labels, values, colors } = getData();

    const baselinePlugin = {
      id: "baseline",
      afterDraw(chart) {
        const { ctx, scales: { y } } = chart;
        const yPos = y.getPixelForValue(BASELINE);
        const left = chart.chartArea.left;
        const right = chart.chartArea.right;
        ctx.save();
        ctx.strokeStyle = "#D85A30";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(left, yPos);
        ctx.lineTo(right, yPos);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#D85A30";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("original paper best result r = 0.371", right - 4, yPos - 5);
        ctx.restore();
      }
    };

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "bar",
      plugins: [baselinePlugin],
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderRadius: 3,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          y: {
            min: Y_MIN,
            max: Y_MAX,
            ticks: { font: { size: 11 }, color: "#888780", callback: v => v.toFixed(2) },
            grid: { color: "rgba(136,135,128,0.12)" },
            title: { display: true, text: "mean Pearson r", font: { size: 12 }, color: "#888780" }
          },
          x: {
            ticks: { font: { size: 10 }, color: "#888780", maxRotation: 35, minRotation: 25 },
            grid: { display: false }
          }
        },
        onHover: (event, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            const val = values[idx];
            const diff = ((val - BASELINE) * 100).toFixed(1);
            const sign = val >= BASELINE ? "+" : "";
            setHovered({
              label: labels[idx],
              r: val.toFixed(4),
              diff: `${sign}${diff}% vs baseline`,
              positive: val >= BASELINE,
              x: event.native.clientX,
              y: event.native.clientY,
            });
          } else {
            setHovered(null);
          }
        }
      }
    });
  }, [active]);

  return (
    <div style={{ fontFamily: "inherit", padding: "1rem 0", position: "relative" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {Object.entries(GROUPS).map(([key, group]) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            style={{
              padding: "6px 14px",
              fontSize: 13,
              borderRadius: 6,
              border: active[key] ? "1.5px solid #2C2C2A" : "0.5px solid #B4B2A9",
              background: active[key] ? "#F1EFE8" : "transparent",
              color: active[key] ? "#2C2C2A" : "#888780",
              cursor: "pointer",
              fontWeight: active[key] ? 500 : 400,
            }}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div style={{ position: "relative", width: "100%", height: 340 }}>
        <canvas ref={canvasRef} />
      </div>

      {hovered && (
        <div style={{
          position: "fixed",
          left: hovered.x + 14,
          top: hovered.y - 10,
          background: "#fff",
          border: "0.5px solid #B4B2A9",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 12,
          color: "#2C2C2A",
          pointerEvents: "none",
          zIndex: 100,
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 500 }}>{hovered.label}</div>
          <div>r = {hovered.r}</div>
          <div style={{ color: hovered.positive ? "#0F6E56" : "#D85A30" }}>{hovered.diff}</div>
        </div>
      )}
    </div>
  );
}