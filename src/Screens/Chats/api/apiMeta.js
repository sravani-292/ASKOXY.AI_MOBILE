
export const apiMetadata = {
  get_user_cart: {
    description: 'Fetch the user\'s cart items using their customerId',
    method: 'GET',
    path: '/cart-service/cart/userCartInfo?customerId={customerId}',
    requiresAuth: true,
  },
  get_user_profile: {
    description: 'Get profile details of the user using userId',
    method: 'GET',
    path: '/users/{userId}',
    requiresAuth: true,
  },
  get_trending_products: {
    description: 'Fetch trending product categories and items',
    method: 'GET',
    path: '/product-service/showGroupItemsForCustomrs',
    requiresAuth: false,
  },
  get_active_offers: {
    description: 'Fetch all currently active offers',
    method: 'GET',
    path: '/offers/active',
    requiresAuth: false,
  },
  add_to_cart: {
    description: 'Add or increment quantity of a product in user\'s cart',
    method: 'POST',
    path: '/cart-service/cart/addAndIncrementCart',
    body: '{ customerId, itemId, quantity }',
    requiresAuth: true,
  },
  remove_from_cart: {
    description: 'Remove item from user\'s cart',
    method: 'POST',
    path: '/cart-service/cart/remove',
    body: '{ customerId, itemId }',
    requiresAuth: true,
  },
};
