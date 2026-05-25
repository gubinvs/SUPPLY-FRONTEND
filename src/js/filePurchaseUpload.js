
import ApiUrl from "./ApiUrl";

/// Скрипт принимает файл с данными о купленной за период номенклатуре
/// и отправляет его на сервер

export const filePurchaseUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    ApiUrl + "/api/AddRecordingPurchasePriceController/",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.text("Все ок!"); // если сервер возвращает JSON
};