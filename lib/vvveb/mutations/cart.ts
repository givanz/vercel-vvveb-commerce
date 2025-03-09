import cartFragment from '../fragments/cart';

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $productId: ID!, $quantity: Int!, $options: String) {
    addCart(cartId: $cartId, productId: $productId, quantity: $quantity, options: $options) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart {
    createCart {
      ...cart
    }
  }
  ${cartFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
  mutation editCartItems($cartId: ID!,$key: String!, $quantity: Int!) {
    updateCart(cartId: $cartId, key: $key, quantity: $quantity) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $key: [String!]!) {
    removeCart(cartId: $cartId, key: $key) {
      ...cart
    }
  }
  ${cartFragment}
`;
