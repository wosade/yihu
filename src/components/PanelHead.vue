<script setup>
import { defineProps } from 'vue';
// 接受其他组件传过来的路由页面的数据
const prop=defineProps({
  route:String
})
</script>
<template>
  <div class="panel-heading">
    <div class="panel-lead">
      <div class="title">{{ prop.route.meta.name }}
        <p class="description">{{ prop.route.meta.description}}</p>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.panel-heading {
  padding: 15px;
  background: #e8edf0;
  border-color: #e8edf0;
  position: relative;

  .panel-lead {
    font-size: 14px;

    .title {
      font-weight: bold;
      font-style: normal;
    }

    .description {
      margin-top: 5px;
    }
  }
}
</style>
