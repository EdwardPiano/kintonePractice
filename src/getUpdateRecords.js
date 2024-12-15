export const getUpdateRecords = async () => {
  const updatedRecords = [];
  const appId = kintone.app.getId();

  if (!appId) {
    throw new Error(
      "アプリIDを取得できませんでした。kintoneアプリ内で実行されているかご確認ください。"
    );
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
