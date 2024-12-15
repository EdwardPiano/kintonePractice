export const updateRecords = async (updatedRecords) => {
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
