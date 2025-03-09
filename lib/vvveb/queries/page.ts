import seoFragment from '../fragments/seo';

const pageFragment = /* GraphQL */ `
  fragment page on PostType {
    ... on PostType {
      postId
      name
      slug
      content
      image
      seo {
        ...seo
      }
      createdAt
      updatedAt
    }
  }
  ${seoFragment}
`;

export const getPageQuery = /* GraphQL */ `
  query getPage($slug: String!) {
    post(slug: $slug) {
      ...page
    }
  }
  ${pageFragment}
`;

export const getPagesQuery = /* GraphQL */ `
  query getPages($type: String) {
    posts(limit: 100, type: $type) {
      nodes {
          ...page
        }
    }
  }
  ${pageFragment}
`;
