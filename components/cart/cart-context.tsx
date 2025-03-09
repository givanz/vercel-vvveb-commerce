'use client';

import type { Cart, CartItem, Product, ProductVariant } from 'lib/vvveb/types';
import React, { createContext, use, useContext, useMemo, useOptimistic } from 'react';

type UpdateType = 'plus' | 'minus' | 'delete';

type CartAction =
  | { type: 'UPDATE_ITEM'; payload: { key: string; updateType: UpdateType } }
  | { type: 'ADD_ITEM'; payload: { variant: ProductVariant; product: Product, options :string } };

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (key: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product, options: string ) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemPrice(quantity: number, price: number): number {
  return (price * quantity);
}

function updateCartItem(item: CartItem, updateType: UpdateType): CartItem | null {
  if (updateType === 'delete') return null;

  const newQuantity = updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.price) / item.quantity;
  const newTotalAmount = calculateItemPrice(newQuantity, singleItemAmount);

  return {
    ...item,
    quantity: newQuantity,
    total: item.price,
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemPrice(quantity, variant?.price || product.price);

  return {
    key: existingItem?.key,
    productId: product?.productId,
    productVariantId: existingItem?.productVariantId ?? variant?.productVariantId,
    quantity,
    price:  existingItem?.price ?? product.price,
    priceCurrency:  existingItem?.priceCurrency ?? product.priceCurrency ?? 'USD',
    total: totalAmount,
    totalFormatted: "",
    name:existingItem?.name ?? product?.name ?? "",
    slug:existingItem?.slug?? product?.slug  ?? "",
    options:existingItem?.options ?? variant?.options ?? "",
    optionValue: existingItem?.optionValue ?? [],
    image:product.image,
  };
}

function updateCartTotals(products: CartItem[]): Pick<Cart, 'totalItems' | 'totalPrice'> {
  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = products.reduce((sum, item) => sum + Number(item.price), 0);

  return {
    totalItems,
    totalPrice :totalAmount
 };
}

function createEmptyCart(): Cart {
  return {
    cartId: undefined,
    encryptedCartId: undefined,
    checkoutUrl: '',
    products: [],
    totals: [],
    total: 0,
    totalItems: 0,
    totalPrice: 0,
    totalTax: 0,
    priceCurrency: 'USD'
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { key, updateType } = action.payload;
      const updatedProducts = currentCart.products
        .map((item) =>
          item.key === key ? updateCartItem(item, updateType) : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedProducts.length === 0) {
        return {
          ...currentCart,
          products: [],
          totalItems: 0,
          totalPrice: currentCart.totalPrice,
          totalTax: currentCart.totalTax
        };
      }

      return { ...currentCart, ...updateCartTotals(updatedProducts), products: updatedProducts };
    }
    case 'ADD_ITEM': {
      const { variant, product } = action.payload;
      const existingItem = currentCart.products.find((item) => (variant && item.productVariantId === variant?.productVariantId) || (!variant &&  item.productId == product.productId));
      const updatedItem = createOrUpdateCartItem(existingItem, variant, product);

      const updatedProducts = existingItem
        ? currentCart.products.map((item) => (((variant && item.productVariantId === variant?.productVariantId) || item.productId === variant?.productId) ? updatedItem : item))
        : [...currentCart.products, updatedItem];

      return { ...currentCart, ...updateCartTotals(updatedProducts), products: updatedProducts };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(initialCart, cartReducer);

  const updateCartItem = (key: string, updateType: UpdateType) => {
    updateOptimisticCart({ type: 'UPDATE_ITEM', payload: { key, updateType } });
  };

  const addCartItem = (variant: ProductVariant, product: Product, options : string) => {
    updateOptimisticCart({ type: 'ADD_ITEM', payload: { variant, product, options } });
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem
    }),
    [optimisticCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
