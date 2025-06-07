
const productFragment = /* GraphQL */ `
  fragment product on ProductType {
      productId
      slug
      stockQuantity
      name
      content
      createdAt
      updatedAt
      price
      priceCurrency
      variants {
        productVariantId
        productId
        options
        image
        price
        oldPrice
        stockQuantity
        weight
        sku
        barcode        
      }
      image
      images {
        productImageId
        productId
        image
        sortOrder
      }
      seo {
        og {
          title
          description
        }
        twitter {
          title
          content
          label1
          data1
          label2
          data2
        }
      }
      sites {
        siteId
        key
        name
        host
        theme
        template
        settings
      }
  }
`;

export default productFragment;
