import cartFragment from '../fragments/cart';

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(cartId: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;
