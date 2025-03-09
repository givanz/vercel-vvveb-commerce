export type Maybe<T> = T | null;

export type Connection<T> = {
  nodes: Array<T>;
};

export type Cart = Omit<VvvebCart, 'products'> & {
  products: CartItem[];
};

export type CartProduct = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;  
  priceCurrency: string;
};

export type CartItem = {
  productId: number | undefined;
  productVariantId: number | undefined;
  key: string | undefined;
  quantity: number;
  price: number;
  priceCurrency: string;
  total: number;
  totalFormatted: string;
  name: string;
  slug: string;
  image: string;
  options: string;
  optionValue: {
    name: string;
    option: string;
    productOptionId: number,
    productOptionValueId: number;
  }[];
};

export type CartTotal = {
  key: String;
  title: String;
  value: String;
  valueFormatted: String;
  text: String;
};

export type Collection = VvvebCollection & {
  path: string;
};

export type Image = {
  image: string;
  productImageId: number;
};

export type Menu = {
  name: string;
  url: string;
  menuItemId: number;
  parentId: number;
};

export type Money = {
  amount: number;
  currencyCode: string;
};

export type Page = {
  postId: string;
  name: string;
  slug: string;
  body: string;
  content: string;
  image: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<VvvebProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ProductOptionValue = {
  productOptionId: number;
  productOptionValueId: number;
  name: string;
  option: string;
};

export type ProductOption = {
  productOptionId: string;
  name: string;
  values: ProductOptionValue[];
};

export type ProductVariant = {
  productVariantId: number;
  productId: number;
  stockQuantity:number;
  name: string;
  image: string;
  options: string;
  price: number;
  priceCurrency: string;
};

export type SEO = {
  og: {
    title: string;
    description: string;
  },
  twitter: {
    title: string;
    content: string;
  }
};

export type VvvebCart = {
  cartId: string | undefined;
  encryptedCartId: string | undefined;
  checkoutUrl: string;
  totals: CartTotal[];
  products: CartItem[];
  total:number;
  totalItems: number;
  totalPrice: number;
  totalTax: number;
  priceCurrency: string;
};

export type VvvebCollection = {
  slug: string;
  name: string;
  content: string;
  path: string;
};

export type VvvebProduct = {
  productId: number;
  slug: string;
  stockQuantity: number;
  name: string;
  content: string;
  options: ProductOption[];
  price: number;
  priceFormatted: string;
  priceCurrency: string;
  variants: ProductVariant[];
  image: string;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type VvvebCartOperation = {
  data: {
    cart: VvvebCart;
  };
  variables: {
    cartId: string;
  };
};

export type VvvebCreateCartOperation = {
  data: { createCart: VvvebCart };
};

export type VvvebAddToCartOperation = {
  data: {
    addCart: VvvebCart;
  };
  variables: {
    cartId: string;
    productId: number;
    quantity: number;
    productVariantId: number;
    options: string;
  };
};

export type VvvebRemoveFromCartOperation = {
  data: {
    removeCart: VvvebCart;
  };
  variables: {
    cartId: string;
    key: string[];
  };
};

export type VvvebUpdateCartOperation = {
  data: {
    updateCart: VvvebCart;
  };
  variables: {
    cartId: string;
    key: string;
    quantity: number;
  };
};

export type VvvebCollectionOperation = {
  data: {
    taxonomyItem: VvvebCollection;
  };
  variables: {
    slug: string;
  };
};

export type VvvebCollectionProductsOperation = {
  data: {
      products: Connection<VvvebProduct>;
  };
  variables: {
    slug: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type VvvebCollectionsOperation = {
  data: {
    taxonomyItems: Connection<VvvebCollection>;
  };
};

export type VvvebMenuOperation = {
  data: {
    menu?: {
      items: {
        name: string;
        url: string;
        menuItemId: number;        
        parentId: number;  
      }[];
    };
  };
  variables: {
    slug: string;
  };
};

export type VvvebPageOperation = {
  data: { post: Page };
  variables: { slug: string };
};

export type VvvebPagesOperation = {
  data: {
    posts: Connection<Page>;
  };
  variables: {
    type: string;
  };  
};

export type VvvebProductOperation = {
  data: { product: VvvebProduct };
  variables: {
    slug: string;
  };
};

export type VvvebProductRecommendationsOperation = {
  data: {
    products: Connection<VvvebProduct>;
  };
  variables: {
    productId: number;
  };
};

export type VvvebProductsOperation = {
  data: {
    products: Connection<VvvebProduct>;
  };
  variables: {
    search?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};
