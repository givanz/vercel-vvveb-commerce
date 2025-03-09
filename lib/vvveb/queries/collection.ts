import productFragment from '../fragments/product';

const collectionFragment = /* GraphQL */ `
  fragment collection on TaxonomyItemType {
    slug
    name
    content
  }
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($slug: String) {
    taxonomyItem(slug: $slug) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    taxonomyItems(limit: 100, postType: "product", type: "categories", parentId: 0) {
        nodes {
          ...collection
        }
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts($slug: String) {
      products(taxonomy: $slug, limit: 100) {
          nodes {
            ...product
          }
    }
  }
  ${productFragment}
`;
