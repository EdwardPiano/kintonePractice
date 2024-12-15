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
      message: `The task was successfully completed, and ${updatedRecords.length} records have been updated.`,
      type: "success",
      plain: true,
    });
  } catch (error) {
    ElMessage({
      showClose: true,
      message: "The task execution failed. Please contact the developer.",
      type: "error",
    });
    console.error("執行過程中發生錯誤:", error);
  } finally {
    loading.value = false;
    loadingInstance.close();
  }
};

const getUpdateRecords = async () => {
  const updatedRecords = [];
  const appId = kintone.app.getId();

  if (!appId) {
    throw new Error("無法取得應用程式 ID，請確認是否在 kintone 應用內執行。");
  }

  const body = {
    app: appId,
    query: '製品名 in ("kintone")',
    size: 500,
  };

  const cursorResp = await kintone.api(
    kintone.api.url("/k/v1/records/cursor.json", true),
    "POST",
    body
  );

  while (true) {
    const recordData = await kintone.api(
      kintone.api.url("/k/v1/records/cursor.json", true),
      "GET",
      cursorResp
    );

    recordData.records.forEach((record) => {
      updatedRecords.push({
        id: record.$id.value,
        record: {
          クラウド: {
            value: ["対象"],
          },
        },
      });
    });

    if (!recordData.next) break;
  }
  return updatedRecords;
};

const updateRecords = async (updatedRecords) => {
  const BULK_REQUEST_MAX = 20;
  const RECORDS_PER_UPDATE = 100;

  let totalUpdated = 0;

  const chunkSize = BULK_REQUEST_MAX * RECORDS_PER_UPDATE;

  for (let i = 0; i < updatedRecords.length; i += chunkSize) {
    const currentBatch = updatedRecords.slice(i, i + chunkSize);
    const bulkRequests = [];

    for (let j = 0; j < currentBatch.length; j += RECORDS_PER_UPDATE) {
      const chunk = currentBatch.slice(j, j + RECORDS_PER_UPDATE);

      bulkRequests.push({
        method: "PUT",
        api: "/k/v1/records.json",
        payload: {
          app: kintone.app.getId(),
          records: chunk.map((record) => ({
            id: record.id,
            record: record.record,
          })),
        },
      });
    }
    console.log("bulkRequests", bulkRequests);
    //bulkRequest API
    await kintone.api(kintone.api.url("/k/v1/bulkRequest", true), "POST", {
      requests: bulkRequests,
    });
    totalUpdated += currentBatch.length;
    console.log(
      `目前已更新 ${Math.min(totalUpdated, updatedRecords.length)}/${
        updatedRecords.length
      } 條記錄`
    );
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
