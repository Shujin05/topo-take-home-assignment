import axios from "axios";

const BASE_URL =
  "/api";

export const getRawData = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/raw-data`, {
      headers: { Accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching raw data:", error);
    throw error;
  }
};


export const getChartData = async (params: Record<string, string>) => {
  const res = await axios.get(`${BASE_URL}/chart-data`, { params });
  return res.data;
};