<template>
  <div>
    <el-button :loading="loading" @click="handleClick" class="custom-button">
      Update Records
    </el-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElButton, ElLoading, ElMessage } from "element-plus";
import { getUpdateRecords } from "./getUpdateRecords";
import { updateRecords } from "./updateRecords";

const loading = ref(false);

const handleClick = async () => {
  loading.value = true;
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "Updating records...",
  });
  try {
    const updatedRecords = await getUpdateRecords();
    await updateRecords(updatedRecords);
    ElMessage({
      message: `タスクが正常に完了し、${updatedRecords.length}件のレコードが更新されました。`,
      type: "success",
      plain: true,
    });
  } catch (error) {
    ElMessage({
      showClose: true,
      message: "The task execution failed. Please contact the developer.",
      type: "error",
    });
    console.error("実行中にエラーが発生しました:", error);
  } finally {
    loading.value = false;
    loadingInstance.close();
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
};
</script>

<style scoped>
.custom-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
}

.custom-button:hover {
  background-color: #45a049;
}
</style>
