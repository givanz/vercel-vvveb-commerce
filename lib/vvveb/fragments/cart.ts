//import productFragment from './product';

const cartFragment = /* GraphQL */ `
  fragment cart on CartType {
    cartId
    encryptedCartId
    checkoutUrl
    total
    totalItems
    totalPrice
    totalTax
    priceCurrency
    totals {
      key
      title
      value
      valueFormatted
      text
    }    
    products {
      productId
      key
      name
      slug
      price
      priceCurrency
      quantity
      image
      optionValue {
        productOptionId
        productOptionValueId
        image
        name
        option
      }
    }   
  }
`;

export default cartFragment;
