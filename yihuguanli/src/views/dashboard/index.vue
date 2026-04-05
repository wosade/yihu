<script setup>
defineOptions({
  name: 'DashBoard'
})
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { getdashbord } from '@/api';
import * as echarts from 'echarts';

const dashData = reactive({
  user: {
    user_img: '',
    user_name: '',
    ip: '',
    permission: ''
  },
  types: [],
  typeList: []
});

// 颜色只是视觉增强：不依赖后端字段顺序/数量
const typeTheme = computed(() => {
  return {
    '待支付': { color: '#E67E22', bg: 'rgba(230, 126, 34, 0.12)' },
    '待服务': { color: '#0CA7AE', bg: 'rgba(12, 167, 174, 0.12)' },
    '已完成': { color: '#19BE6B', bg: 'rgba(25, 190, 107, 0.12)' },
    '已取消': { color: '#E63946', bg: 'rgba(230, 57, 70, 0.12)' }
  };
});

const chartDom = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (!chartDom.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartDom.value);
  }

  const dates = dashData.typeList.map((i) => i.date);
  const orderSum = dashData.typeList.map((i) => i.order_sum);
  const orderMoney = dashData.typeList.map((i) => i.order_money);

  chartInstance.setOption(
    {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          // params[0] 是当前轴上所有 series 的集合
          const p0 = params?.[0];
          const p1 = params?.[1];
          const date = p0?.axisValue ?? '';
          const count = p0?.data ?? 0;
          const money = p1?.data ?? 0;
          return `${date}<br/>订单数：${count}<br/>订单金额：${money}`;
        }
      },
      legend: {
        top: 0,
        left: 0,
        icon: 'round',
        textStyle: { color: '#6b7280' }
      },
      grid: { left: 10, right: 10, top: 40, bottom: 20, containLabel: true },
      xAxis: [
        {
          type: 'category',
          data: dates,
          axisLine: { lineStyle: { color: 'rgba(16, 24, 40, 0.08)' } },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280' }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '订单数',
          axisLabel: { color: '#6b7280' },
          axisLine: { lineStyle: { color: 'rgba(16, 24, 40, 0.08)' } },
          splitLine: { lineStyle: { color: 'rgba(16, 24, 40, 0.06)' } }
        },
        {
          type: 'value',
          name: '订单金额',
          axisLabel: { color: '#6b7280' },
          axisLine: { lineStyle: { color: 'rgba(16, 24, 40, 0.08)' } },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '订单数',
          type: 'line',
          yAxisIndex: 0,
          data: orderSum,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { color: '#0CA7AE', width: 2.5 },
          itemStyle: { color: '#0CA7AE' },
          areaStyle: { color: 'rgba(12, 167, 174, 0.12)' }
        },
        {
          name: '订单金额',
          type: 'bar',
          yAxisIndex: 1,
          data: orderMoney,
          barWidth: '40%',
          itemStyle: { color: '#E67E22' },
          emphasis: { focus: 'series' }
        }
      ]
    },
    true
  );
};

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(async () => {
  const res = await getdashbord();
  const payload = res?.data?.data || {};
  dashData.user = payload.user || dashData.user;
  dashData.types = payload.types || [];
  dashData.typeList = payload.typeList || [];

  await nextTick();
  renderChart();
});

watch(
  () => dashData.typeList,
  async () => {
    await nextTick();
    renderChart();
  },
  { deep: true }
);

// 释放内存，避免路由切换后 ECharts 继续占用 DOM
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance) chartInstance.dispose();
  chartInstance = null;
});

window.addEventListener('resize', handleResize);
</script>
<template>
  <div class="dashboard-wrap">
    <div class="dashboard-header">
      <div class="dashboard-title">
        <div class="title">控制台概览</div>
        <div class="subtitle">订单状态统计与每日数据</div>
      </div>

      <div class="user-box" v-if="dashData.user?.user_name">
        <el-avatar :size="44" :src="dashData.user.user_img" />
        <div class="user-info">
          <div class="user-name">{{ dashData.user.user_name }}</div>
          <div class="user-meta">{{ dashData.user.permission }} · IP: {{ dashData.user.ip }}</div>
        </div>
      </div>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6" v-for="t in dashData.types" :key="t.state">
        <el-card class="stat-card" shadow="never" :body-style="{ padding: '14px 14px 12px' }"
          :style="{
            background: typeTheme[t.state]?.bg || '#F6F7FB'
          }"
        >
          <div class="stat-top">
            <div class="stat-state">{{ t.state }}</div>
            <div class="stat-dot"
              :style="{ background: typeTheme[t.state]?.color || '#909399' }"
            />
          </div>
          <div class="stat-num" :style="{ color: typeTheme[t.state]?.color || '#909399' }">
            {{ t.num ?? 0 }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="chart-card" shadow="never">
      <template #header>
        <div class="list-header">
          <span>订单趋势</span>
          <span class="list-hint">订单数（折线） / 金额（柱状）</span>
        </div>
      </template>
      <div class="chart" ref="chartDom"></div>
    </el-card>

    <el-card class="list-card" shadow="never">
      <template #header>
        <div class="list-header">
          <span>近 5 天统计</span>
          <span class="list-hint">（订单数 / 订单金额）</span>
        </div>
      </template>

      <el-table :data="dashData.typeList" style="width: 100%" :border="false">
        <el-table-column prop="date" label="日期" width="150" />
        <el-table-column prop="order_sum" label="订单数" width="120" />
        <el-table-column prop="order_money" label="订单金额" />
      </el-table>
    </el-card>
  </div>
</template>
<style scoped lang="less">
.dashboard-wrap {
  margin: 16px;
  padding: 18px 18px 22px;
  box-sizing: border-box;

  min-height: calc(100vh - 64px);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(16, 24, 40, 0.06);
  margin-bottom: 16px;

  .dashboard-title {
    .title {
      font-size: 18px;
      font-weight: 800;
      color: #1f2937;
      letter-spacing: 0.5px;
    }

    .subtitle {
      margin-top: 6px;
      font-size: 13px;
      color: #6b7280;
    }
  }

  .user-box {
    display: flex;
    gap: 12px;
    align-items: center;
    background: #f6f7fb;
    border: 1px solid rgba(16, 24, 40, 0.06);
    padding: 10px 12px;
    border-radius: 12px;

    .user-info {
      .user-name {
        font-size: 14px;
        font-weight: 800;
        color: #111827;
        line-height: 20px;
      }

      .user-meta {
        margin-top: 3px;
        font-size: 12px;
        color: #6b7280;
        line-height: 16px;
        white-space: nowrap;
      }
    }
  }
}

.stat-row {
  margin-bottom: 16px;
}

.stat-card {
  border: 1px solid rgba(16, 24, 40, 0.06);
  border-radius: 12px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(16, 24, 40, 0.08);
  }

  .stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    .stat-state {
      font-size: 13px;
      font-weight: 700;
      color: #374151;
    }

    .stat-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  }

  .stat-num {
    margin-top: 10px;
    font-size: 30px;
    font-weight: 900;
    letter-spacing: 0.5px;
  }
}

.list-card {
  border-radius: 12px;
  border: 1px solid rgba(16, 24, 40, 0.06);
}

.chart-card {
  margin-bottom: 16px;
  border-radius: 12px;
  border: 1px solid rgba(16, 24, 40, 0.06);
}

.chart {
  width: 100%;
  height: 320px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 800;
  color: #111827;

  .list-hint {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
  }
}

:deep(.el-table) {
  --el-table-header-bg-color: #ffffff;
}

:deep(.el-table__cell) {
  padding: 10px 0;
}
</style>
