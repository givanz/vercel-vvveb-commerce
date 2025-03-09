'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/vvveb/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  stockQuantity,
  hasVariants,
  selectedVariantId
}: {
  stockQuantity: number;
  hasVariants: boolean;
  selectedVariantId: number | undefined;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (stockQuantity < 1) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (hasVariants && !selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, stockQuantity } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants?.find((variant: ProductVariant) =>
    variant.productVariantId.toString() === state["productVariantId"]
  );
  
  const hasVariants = variants?.length ? true : false;
  const defaultVariantId = variants?.length === 1 ? variants[0]?.productId : product.productId;
  const selectedVariantId = variant?.productVariantId || defaultVariantId;
  const options = variant?.options ?? "";
  const finalVariant = variants?.find((variant) => variant.productVariantId === selectedVariantId)!;
  const actionWithVariant = formAction.bind(null, finalVariant || product);

   return (
    <form
      action={async () => {
        addCartItem(finalVariant, product, options);
        await actionWithVariant();
      }}
    >
      <SubmitButton stockQuantity={stockQuantity} hasVariants={hasVariants} selectedVariantId={selectedVariantId} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
