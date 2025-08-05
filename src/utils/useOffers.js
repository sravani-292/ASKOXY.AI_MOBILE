import BASE_URL from '../../Config';
export async function fetchOffers(query) {
  const PROMO_API = `${BASE_URL}product-service/getComboActiveInfo`;
  try {
    const response = await fetch(PROMO_API);
    const data = await response.json();
    return data || [];
  } catch (e) {
    return [];
  }
}
