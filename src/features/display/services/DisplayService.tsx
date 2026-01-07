import { Logger } from "@/src/core/utils/Logger";

import { DisplayItem } from "../types/DisplayType";

export const DisplayService = {
  fetchItems: async (): Promise<DisplayItem[]> => {
    try {
      Logger.log("Đang gọi API lấy danh sách display...");

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, title: "Item 1", description: "Mô tả 1" },
            { id: 2, title: "Item 2", description: "Mô tả 2" },
            { id: 2, title: "Item 2", description: "Mô tả 2" },
            { id: 2, title: "Item 2", description: "Mô tả 2" },
          ]);
        }, 1000);
      });
    } catch (error) {
      Logger.error("Lỗi khi fetchItems:", error);
      throw error;
    }
  },
};
