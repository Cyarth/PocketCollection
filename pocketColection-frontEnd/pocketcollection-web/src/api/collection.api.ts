import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getCollections = async () => {
  const response = await axios.get(
    `${API_URL}/collections`,
    getAuthHeaders()
  );

  return response.data;
};

export const createCollection = async (
  name: string,
  description: string
) => {
  const response = await axios.post(
    `${API_URL}/collections`,
    {
      name,
      description,
    },
    getAuthHeaders()
  );

  return response.data;
};

export const addCardToCollection = async (
  collectionId: number,
  payload: {
    card_id: string;
    quantity: number;
    condition: string;
    language: string;
    is_foil: boolean;
    purchase_price?: number | null;
  }
) => {
  const response = await axios.post(
    `${API_URL}/collections/${collectionId}/items`,
    payload,
    getAuthHeaders()
  );

  return response.data;
};

export const getCollectionById = async (
  collectionId: number
) => {
  const response = await axios.get(
    `${API_URL}/collections/${collectionId}`,
    getAuthHeaders()
  );

  return response.data;
};