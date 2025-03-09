import productFragment from '../fragments/product';

export const getProductQuery = /* GraphQL */ `
  query getProduct($slug: String!) {
    product(slug: $slug) {
      ...product
        options {
          productOptionId
          productId
          optionId
          name
          value
          required
          values {
            productOptionId
            productOptionValueId
            name
            quantity
            priceOperator
            price
            pointsOperator
            points
            weightOperator
            weight
          }    
        } 
      }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($search: String) {
    products(search: $search) {
        nodes {
          ...product
        }
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: Int!) {
   products(related:$productId) {
        nodes {
          ...product
        }
    }
  }
  ${productFragment}
`;
