'use client';

import clsx from 'clsx';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import { ProductOption, ProductVariant } from 'lib/vvveb/types';

type Combination = {
  productVariantId: number;
  stockQuantity: number;
  options:string;
  [key: number]: number | boolean;
};

export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const hasNoOptionsOrJustOneOption =
    !options || !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }
  
let opts = {};

options.forEach((opt) => {
  opts[opt["productOptionId"]] = opt;
});

  const combinations: Combination[] = variants.map((variant) => {
        //change numeric keys to string for json parse to work
      variant.options = variant.options.replace(/(\d+):/g, '"$1":');
      let json = JSON.parse("{" + variant.options + "}");
      let strOptions = {};

      for (let key in json) {
        let val = json[key];
        strOptions[opts[key]["name"]] = opts[key]["values"].find(element => element["productOptionValueId"] == val)["name"] ?? "";
      }
      return {
        productVariantId: variant.productVariantId,
        stockQuantity: variant.stockQuantity,
        options: variant.options,
        ...strOptions
      }
  });

  return options.map((option) => (
    <form key={option.name}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            // Base option params on current productOption so we can preserve any other param state.
            const optionParams = { ...state, [option.name]: value.name };
            // Filter out invalid options and check if the option combination is available for sale.
            
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              options.find(
                (option) => option.name === key && option.values.find((val) => val.name == value)
              )
            );
            
            const currentCombination = combinations.find((combination) =>
              filtered.every(
                ([key, value]) => combination[key] === value
              )
            );
            
            if (!currentCombination) return null;

            const isstockQuantity = currentCombination && (currentCombination.stockQuantity > 0);
            // The option is active if it's in the selected options.
            const isActive = state[option.name] === value.name;
            const productVariantId = currentCombination.productVariantId;
            const productOptions = currentCombination.options;

            return (
              <button
                formAction={() => {
                  const newState = updateOption(option.name, value.name, productVariantId.toString(), productOptions);
                  updateURL(newState);
                }}
                key={value.name}
                aria-disabled={!isstockQuantity}
                disabled={!isstockQuantity}
                title={`${option.name} ${value.name}${!isstockQuantity ? ' (Out of Stock)' : ''}`}
                className={clsx(
                  'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                  {
                    'cursor-default ring-2 ring-blue-600': isActive,
                    'ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600':
                      !isActive && isstockQuantity,
                    'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                      !isstockQuantity
                  }
                )}
              >
                {value.name}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
