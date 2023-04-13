<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="升级会员"
    :width="isMobile ? '300px' : '700px'"
  >
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
        :class="{
          active: selectedPlan === item.type,
          'plan-item-xs': isMobile,
        }"
        v-for="(item,index) of memberList"
        :key="index"
        @click="selectPlan(item.type)"
      >
        <div class="plan-name">
          <img src="@/assets/vip.png" class="vipimg" alt="" srcset="" />
          <span>{{item.label}}</span>
        </div>
        <div class="plan-price">{{item.price}}元/{{item.unit }}</div>
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
import { ref, defineEmits,onMounted } from "vue";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { getMembership } from "@/api";

const emits = defineEmits(["close"]);
const dialogVisible = ref(false);
const selectedPlan = ref("");
interface member {
  label: string
  type: string
  price: number
  unit: string
}
const memberList = ref<member[]>([])

const selectPlan = (plan: string) => {
  selectedPlan.value = plan;
};
const confirmUpgrade = () => {
  // 执行升级操作
  // dialogVisible.value = false;
  emits("close");
};
const { isMobile } = useBasicLayout();


function getMembershipList(){
  getMembership().then((res)=>{
    memberList.value = res.data as member[]
  })
}

onMounted(() => {
  getMembershipList()
})
</script>

<style scoped>
.upgrade-plan {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.plan-item {
  width: 30%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.plan-item-xs {
  width: 100%;
  margin-bottom: 10px;
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
.plan-name img {
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
