// assistantTools.js
export const tools = [
  {
    type: 'function',
    function: {
      name: 'get_user_cart',
      description: 'Fetches user cart based on ID',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string' }
        },
        required: ['customerId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_user_profile',
      description: 'Fetches user profile',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' }
        },
        required: ['userId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_trending_products',
      description: 'Fetches currently trending products',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_active_offers',
      description: 'Gets currently active offers',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'add_to_cart',
      description: 'Adds a product to the user cart',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          itemId: { type: 'string' },
          quantity: { type: 'integer' }
        },
        required: ['customerId', 'itemId', 'quantity']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'remove_from_cart',
      description: 'Removes a product from the cart',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          itemId: { type: 'string' }
        },
        required: ['customerId', 'itemId']
      }
    }
  },
  // ➕ Add more tools as you create APIs
];
