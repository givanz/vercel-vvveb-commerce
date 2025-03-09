[![Deploy with Vercel](https://vercel.com/button)](https%3A%2F%2Fvercel.com%2Fnew%2Fclone%3Frepository-url%3Dhttps%3A%2F%2Fgithub.com%2Fgivanz%2Fvercel-vvveb-commerce%26project-name%3Dvvveb-commerce%26repo-name%3Dvvveb-commerce%26demo-title%3DVvveb%20Next.js%20Commerce%26demo-url%3Dhttps%3A%2F%2Fvercel-vvveb-commerce.vercel.app%26demo-image%3Dhttps%3A%2F%2Fwww.vvveb.com%2Fmedia%2Fbiglogo.png%26env%3DCOMPANY_NAME%2CVVVEB_STORE_DOMAIN%2CVVVEB_USER%2CVVVEB_PASSWORD%2CVVVEB_URL%2CSITE_NAME%2CTWITTER_CREATOR%2CTWITTER_SITE)


# Next.js Vvveb Commerce

A high-performance, server-rendered Next.js App Router ecommerce application.

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Vvveb store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```
Your app should now be running on localhost:3000.


Your app should now be running on [localhost:3000](http://localhost:3000/).

<details>
  <summary>Expand if you work at Vercel and want to run locally and / or contribute</summary>

1. Run `vc link`.
1. Select the `Vercel Solutions` scope.
1. Connect to the existing `commerce-vvveb` project.
1. Run `vc env pull` to get environment variables.
1. Run `pnpm dev` to ensure everything is working correctly.
</details>


## Vvveb GraphQL

Enable GraphQL in [/.env.php](https://github.com/givanz/Vvveb/blob/master/env.php#L55)

```php
defined('GRAPHQL') || define('GRAPHQL', true);
```

From Vvveb folder run

```bash
composer require webonyx/graphql-php
```

[Documentation](http://dev.vvveb.com/graphql)

[GraphQL query plugin](https://plugins.vvveb.com/product/graphql) 

