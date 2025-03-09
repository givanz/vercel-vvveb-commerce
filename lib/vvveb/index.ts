import { VVVEB_GRAPHQL_API_ENDPOINT, TAGS } from 'lib/constants';
import { isVvvebError } from 'lib/type-guards';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  VvvebAddToCartOperation,
  VvvebCart,
  VvvebCartOperation,
  VvvebCollection,
  VvvebCollectionOperation,
  VvvebCollectionProductsOperation,
  VvvebCollectionsOperation,
  VvvebCreateCartOperation,
  VvvebMenuOperation,
  VvvebPageOperation,
  VvvebPagesOperation,
  VvvebProduct,
  VvvebProductOperation,
  VvvebProductRecommendationsOperation,
  VvvebProductsOperation,
  VvvebRemoveFromCartOperation,
  VvvebUpdateCartOperation
} from './types';

const domain = process.env.VVVEB_STORE_DOMAIN;
const endpoint = `${domain}${VVVEB_GRAPHQL_API_ENDPOINT}`;
const key = process.env.VVVEB_STOREFRONT_ACCESS_TOKEN!;


type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function vvvebFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {

    headers = {
      'Content-Type': 'application/json',
      //'X-Vvveb-Storefront-Access-Token': key,
      'Authorization' : 'Basic ' + btoa(process.env.VVVEB_USER + ":" + process.env.VVVEB_PASSWORD),
      ...headers
    }
    
    const result = await fetch(endpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers,
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();
    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isVvvebError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.nodes;
};

const reshapeCart = (cart: VvvebCart): Cart => {
  return {
    ...cart,
    products: cart.products
  };
};

const reshapeCollection = (collection: VvvebCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.slug}`
  };
};

const reshapeCollections = (collections: VvvebCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productname: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    return {
      image,
    };
  });
};


const reshapeProducts = (products: VvvebProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = product;

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await vvvebFetch<VvvebCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.createCart);
}

export async function addToCart(
  cartId: string,
  productId: number,
  quantity: number,
  productVariantId: number,
  options: string
): Promise<Cart> {
  
  const res = await vvvebFetch<VvvebAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      productId,
      quantity,
      productVariantId,
      options
    },
    cache: 'no-store'
  });
 
  return reshapeCart(res.body.data.addCart);
}

export async function removeFromCart(cartId: string, key: string[]): Promise<Cart> {
  const res = await vvvebFetch<VvvebRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      key
    },
    cache: 'no-store'
  });
  
  return reshapeCart(res.body.data.removeCart);
}

export async function updateCart(
  cartId: string,
  key: string,
  quantity: number 
): Promise<Cart> {
  const res = await vvvebFetch<VvvebUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      key,
      quantity
    },
    cache: 'no-store'
  });
  
  return reshapeCart(res.body.data.updateCart);
}

export async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined;
  }

  const res = await vvvebFetch<VvvebCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart]
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
}

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  const res = await vvvebFetch<VvvebCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      slug
    }
  });

  return reshapeCollection(res.body.data.taxonomyItem);
}

export async function getCollectionProducts({
  taxonomy,
  reverse,
  sortKey
}: {
  taxonomy: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await vvvebFetch<VvvebCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      slug:taxonomy,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.products) {
    console.log(`No collection found for \`${taxonomy}\``);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getCollections(): Promise<Collection[]> {
  const res = await vvvebFetch<VvvebCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const vvvebCollections = removeEdgesAndNodes(res.body?.data?.taxonomyItems);
  const collections = [
    {
      slug: '',
      name: 'All',
      content: 'All products',
      path: '/search',
    },
    ...reshapeCollections(vvvebCollections)
  ];

  return collections;
}

export async function getMenu(slug: string): Promise<Menu[]> {
  const res = await vvvebFetch<VvvebMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      slug
    }
  });

  return (
    res.body?.data?.menu?.items.map((item: { name: string; url: string, menuItemId: number, parentId: number }) => ({
      name: item.name,
      menuItemId: item.menuItemId,
      parentId: item.parentId,
      url:item.url
    })) || []
  );
}

export async function getPage(slug: string): Promise<Page> {
  const res = await vvvebFetch<VvvebPageOperation>({
    query: getPageQuery,
    cache: 'no-store',
    variables: { slug }
  });

  return res.body.data.post;
}

export async function getPages(type: string): Promise<Page[]> {
  const res = await vvvebFetch<VvvebPagesOperation>({
    query: getPagesQuery,
    cache: 'no-store',
    variables: {
      type
    }
  });

  return removeEdgesAndNodes(res.body.data.posts);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const res = await vvvebFetch<VvvebProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      slug
    }
  });

  return res.body.data.product;
}

export async function getProductRecommendations(productId: number): Promise<Product[]> {
  const res = await vvvebFetch<VvvebProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProducts({
  search,
  reverse,
  sortKey
}: {
  search?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await vvvebFetch<VvvebProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      search,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Vvveb,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = (await headers()).get('x-vvveb-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.VVVEB_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
