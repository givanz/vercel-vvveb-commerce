'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/vvveb';
import { ProductVariant } from 'lib/vvveb/types';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(prevState: any, variant: ProductVariant) {
  
  let cartId = (await cookies()).get('cartId')?.value;

  if (!cartId || !variant) {
    return 'Error adding item to cart';
  }
  
  try {
    await addToCart(cartId, variant.productId, 1, variant.productVariantId ?? 0, variant.options ?? "");
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, key: string) {
  let cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const product = cart.products.find((product) => product.key === key);

    if (product && product.key) {
      await removeFromCart(cartId, [product.key]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    productId: number;
    key: string;
    productVariantId: number;
    quantity: number;
    options :string;
  }
) {
  let cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { key, productId, quantity, productVariantId, options } = payload;

  try {
    const cart = await getCart(cartId);

    if (!cart) {
      return 'Error fetching cart';
    }

    const product = cart.products.find((item) => item.key === key);

    if (product && product.key) {
      if (quantity === 0) {
        await removeFromCart(cartId, [product.key]);
      } else {
        await updateCart(cartId, product.key, quantity);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it

      await addToCart(cartId, Number(productId), quantity, productVariantId, options);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  let cartId = (await cookies()).get('cartId')?.value;
  let cart = await getCart(cartId);

  redirect(process.env.VVVEB_URL + cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set('cartId', cart.encryptedCartId!);
}
