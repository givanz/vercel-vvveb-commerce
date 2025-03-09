export const getMenuQuery = /* GraphQL */ `
  query getMenu($slug: String!) {
    menu(slug: $slug) {
      items {
        name
        url
        menuItemId
        parentId
      }
    }
  }
`;
