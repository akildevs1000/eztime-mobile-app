<template>
  <span>
    <style scoped>
      .chartBox {
        width: 250px; /* smaller width */
        height: 250px; /* set height to keep aspect ratio */
        margin: 0 auto; /* center horizontally */
        border-radius: 20px;
      }
    </style>
    <v-row class="pa-3">
      <v-col cols="12" class="text-center">
        <div class="mt-2">Today Remaing Hours</div>
        <div class="chartBox text-center">
          <canvas id="myChart"></canvas>
        </div>
      </v-col>
    </v-row>
  </span>
</template>

<script>
export default {
  data() {
    return {
      chart: null,
      currentValue: 0,
      targetValue: 65,
    };
  },
  mounted() {
    // Load Chart.js from CDN if not already loaded
    if (!window.Chart) {
      const script = document.createElement("script");
      script.src = "/scripts/chart.js";
      script.onload = () => this.initChart();
      document.head.appendChild(script);
    } else {
      this.initChart();
    }
  },
  methods: {
    initChart() {
      const gaugeNeedle = {
        id: "gaugeNeedle",
        afterDatasetDraw(chart) {
          const {
            ctx,
            chartArea: { left, top, width, height },
          } = chart;

          // Get center of the chart area manually
          const cx = left + width / 2;
          const cy = top + height / 2;

          // Calculate angle from 0–100 to 180–360 degrees (π to 2π radians)
          const angle = Math.PI + (currentValue / 100) * Math.PI;
          const needleLength = height / 2.5;
          const needleWidth = 6;

          const tipX = cx + Math.cos(angle) * needleLength;
          const tipY = cy + Math.sin(angle) * needleLength;

          const baseAngle = angle + Math.PI / 2;
          const baseX1 = cx + Math.cos(baseAngle) * (needleWidth / 2);
          const baseY1 = cy + Math.sin(baseAngle) * (needleWidth / 2);
          const baseX2 = cx - Math.cos(baseAngle) * (needleWidth / 2);
          const baseY2 = cy - Math.sin(baseAngle) * (needleWidth / 2);

          ctx.save();

          // Shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 5;

          // Draw needle (triangle)
          ctx.beginPath();
          ctx.moveTo(baseX1, baseY1);
          ctx.lineTo(tipX, tipY);
          ctx.lineTo(baseX2, baseY2);
          ctx.closePath();
          ctx.fillStyle = "#6946dd";
          ctx.fill();

          // Draw center circle
          ctx.beginPath();
          ctx.shadowBlur = 0;
          ctx.arc(cx, cy, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#333";
          ctx.fill();

          ctx.restore();
        },
      };

      const data = {
        labels: ["Low", "Medium", "High"],
        datasets: [
          {
            data: [40, 30, 30],
            backgroundColor: ["#4caf50", "#ffeb3b", "#f44336"],
            borderWidth: 0,
            cutout: "80%",
            circumference: 180, // 180 for semi-circle
            rotation: 270, // rotate to start from bottom center
          },
        ],
      };

      const config = {
        type: "doughnut",
        data,
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
        plugins: [gaugeNeedle],
      };

      const ctx = document.getElementById("myChart").getContext("2d");
      this.chart = new window.Chart(ctx, config);
      this.animateNeedle();
    },

    animateNeedle() {
      const speed = 2;
      const animate = () => {
        const diff = this.targetValue - this.currentValue;
        if (Math.abs(diff) < 0.1) {
          this.currentValue = this.targetValue;
          this.chart.update();
          return;
        }
        this.currentValue += diff / speed;
        this.chart.update();
        requestAnimationFrame(animate);
      };
      animate();
    },
  },
};
</script>
