const axios = require("axios");

const TCGDEX_BASE_URL = "https://api.tcgdex.net/v2/en";

const getSeries = async () => {
  const response = await axios.get(`${TCGDEX_BASE_URL}/series`);
  return response.data;
};

const getSets = async () => {
  const response = await axios.get(`${TCGDEX_BASE_URL}/sets`);
  return response.data;
};

const getSetById = async (setId) => {
  const response = await axios.get(`${TCGDEX_BASE_URL}/sets/${setId}`);
  return response.data;
};

const getCardById = async (cardId) => {
  const response = await axios.get(`${TCGDEX_BASE_URL}/cards/${cardId}`);
  return response.data;
};

module.exports = {
  getSeries,
  getSets,
  getSetById,
  getCardById,
};