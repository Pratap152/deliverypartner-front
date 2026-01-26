import apiClient from "../../services/ApiClient";

export const ReportIssueService = {
  reportIssue: async ({ issueType, notes, orderId, slotId }) => {
    const response = await apiClient.post("/api/issues/report", {
      issueType,
      notes,
      orderId,
      slotId,
    });

    return response.data;
  },
};
