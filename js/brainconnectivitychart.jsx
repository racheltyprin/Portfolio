const { useState, useEffect, useRef } = React;

const GROUPS = {
  original: {
    label: "Original paper replication",
    color: "#7A736C",
    models: [
      { label: "Communicability (full network)", r: 0.3711 },
      { label: "Direct", r: 0.3062 },
      { label: "Shortest path", r: 0.2535 },
      { label: "Subnet communicability (voting)", r: 0.3479 },
    ]
  },
  v1: {
    label: "New subnet methods",
    color: "rgba(26, 77, 58, 0.6)",
    
    models: [
      { label: "Subnet comm. (gradient descent)", r: 0.3477 },
      { label: "Subnet comm. (simulated annealing)", r: 0.3480 },
      { label: "Subnet comm. (random search)", r: 0.3475 },
      { label: "Subnet comm. (grid search)", r: 0.3477 },
    ]
  },
  v2: {
    label: "More new subnet + new whole network",
    color: "#1A4D3A",
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

const HOVER_COLORS = {
    original: "#5F5E5A",
    v1: "#5B7A6D",
    v2: "#1F5C45",
  };
  
function BrainConnectivityChart() {
  const [active, setActive] = useState({ original: true, v1: false, v2: false });
  const [hovered, setHovered] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
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
        ctx.strokeStyle = "#d06a77";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(left, yPos);
        ctx.lineTo(right, yPos);
        ctx.stroke();
        ctx.setLineDash([]);
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
            ticks: { font: { size: 11, family: "'Satoshi', sans-serif" }, color: "#7A736C", callback: v => v.toFixed(2) },
            grid: { color: "rgba(122, 115, 108, 0.12)" },
            title: { display: true, text: "mean Pearson r", font: { size: 12, family: "'Satoshi', sans-serif" }, color: "#7A736C" }
          },
          x: {
            ticks: { font: { size: 10, family: "'Satoshi', sans-serif" }, color: "#7A736C", maxRotation: 55, minRotation: 55 },
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
    <div style={{ fontFamily: "'Satoshi', sans-serif", padding: "1rem 0", paddingLeft: "16px", position: "relative", background: "transparent" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        {Object.entries(GROUPS).map(([key, group]) => (
          <button
          key={key}
          onClick={() => toggle(key)}
          onMouseDown={e => e.preventDefault()}
          onMouseEnter={() => setHoveredBtn(key)}
          onMouseLeave={() => setHoveredBtn(null)}
            style={{
              padding: "6px 10px",
              fontSize: 10,
              fontFamily: "'Chillax', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: 2,
              border: "1px solid #1A4D3A",
              background: active[key]
                ? (hoveredBtn === key ? HOVER_COLORS[key] : group.color)
                : (hoveredBtn === key ? "#E8E0D8" : "transparent"),
              color: active[key] ? "#FAF5F0" : "#7A736C",
              cursor: "pointer",
            }}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem", justifyContent: "center" }}>
        <svg width="30" height="2" style={{ display: "block" }}>
          <line x1="0" y1="1" x2="30" y2="1" stroke="#d06a77" strokeWidth="1.5" strokeDasharray="5,4" />
        </svg>
        <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", color: "#7A736C" }}>
          original paper methods' best result (communicability: r = 0.371)
        </span>
      </div>

      <div style={{ position: "relative", width: "100%", height: 340 }}>
        <canvas ref={canvasRef} />
      </div>

      {hovered && (
        <div style={{
          position: "fixed",
          left: hovered.x + 14,
          top: hovered.y - 10,
          background: "#FAF5F0",
          border: "1px solid #1A4D3A",
          borderRadius: 2,
          padding: "8px 12px",
          fontSize: 12,
          fontFamily: "'Satoshi', sans-serif",
          color: "#2A2A28",
          pointerEvents: "none",
          zIndex: 100,
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700 }}>{hovered.label}</div>
          <div>r = {hovered.r}</div>
          <div style={{ color: hovered.positive ? "#1A4D3A" : "#d06a77" }}>{hovered.diff}</div>
        </div>
      )}
    </div>
  );
}
