<template>
  <el-dialog :visible.sync="dialogVisible" title="升级会员" >
    <div class="upgrade-desc">
      <ul class="bluetext">
        <li>国内直接访问</li>
        <li>AI智能续写&承接上下文</li>
        <li>最新GPT多模态自然语言模型</li>
        <li>与先进的聊天机器人互动聊天</li>
      </ul>
    </div>
    <div class="upgrade-plan">
      <div
        class="plan-item"
        :class="{ active: selectedPlan === 'monthly' }"
        @click="selectPlan('monthly')"
      >
        <div class="plan-name">
          <img src="@/assets/vip.png" class="vipimg" alt="" srcset="" />
          <span>包月</span>
        </div>
        <div class="plan-price">15元/月</div>
      </div>
      <div
        class="plan-item"
        :class="{ active: selectedPlan === 'annual' }"
        @click="selectPlan('annual')"
      >
        <div class="plan-name">
          <img src="@/assets/vip.png" class="vipimg" alt="" srcset="" />
          <span>包年</span>
        </div>
        <div class="plan-price">130元/年</div>
      </div>
      <div
        class="plan-item"
        :class="{ active: selectedPlan === 'seasonal' }"
        @click="selectPlan('seasonal')"
      >
        <div class="plan-name">
          <img src="@/assets/vip.png" class="vipimg" alt="" srcset="" />
          <span>包季</span>
        </div>
        <div class="plan-price">50元/季</div>
      </div>
    </div>

    <div slot="footer" class="tc_r">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="confirmUpgrade"
        :disabled="!selectedPlan"
        >确认升级</el-button
      >
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";

const emits = defineEmits(["close"]);
const dialogVisible = ref(false);
const selectedPlan = ref("");
const selectPlan = (plan: string) => {
  selectedPlan.value = plan;
};
const confirmUpgrade = () => {
  // 执行升级操作
  // dialogVisible.value = false;
  emits("close");
};


</script>

<style scoped>
.upgrade-plan {
  display: flex;
  justify-content: space-between;
}
.plan-item {
  width: 30%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.plan-item:hover {
  border-color: #409eff;
  color: #409eff;
}
.plan-item.active {
  border-color: #409eff;
  color: #409eff;
}
.plan-name {
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
 align-items: center;
}
.plan-name img{
  height: 20px;
  margin-right: 5px;
}
.plan-price {
  font-size: 24px;
  font-weight: bold;
}
.upgrade-desc {
  margin-bottom: 20px;
}
.upgrade-desc p {
  margin-bottom: 10px;
}
.upgrade-plan {
  margin-bottom: 30px;
}
.tc_r {
  text-align: right;
}
</style>
