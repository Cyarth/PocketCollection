import axios from "axios";
import type { Card } from "../types/card";

const API_URL = "http://localhost:3000/api";

export const searchCards = async (name: string): Promise<Card[]> => {
  const response = await axios.get<Card[]>(`${API_URL}/cards/search`, {
    params: { name },
  });

  return response.data;
};