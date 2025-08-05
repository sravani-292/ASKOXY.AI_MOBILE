export async function fetchProducts() {
  console.log("Fetching products...");

  try {
    const response = await fetch('https://meta.oxyloans.com/api/product-service/showGroupItemsForCustomrs');
    const data = await response.json();

    const items = [];

    for (const category of data) {
      for (const cat of category.categories) {
        for (const item of cat.itemsResponseDtoList) {
          items.push({
            id: item.itemId,
            name: item.itemName,
            price: item.itemPrice,
            mrp: item.itemMrp,
            image: item.itemImage,
            description: item.itemDescription,
            saveAmount: item.saveAmount,
            savePercentage: item.savePercentage,
            weight: item.weight,
            units: item.units,
            quantity: item.quantity,
            category: cat.categoryName,
          });
        }
      }
    }    
    return items;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}
