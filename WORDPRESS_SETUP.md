# WordPress Setup Guide

This application is configured to fetch content from a **Headless WordPress** backend.

## Prerequisites

1.  **WordPress Site**: You need a running WordPress instance.
2.  **WPGraphQL Plugin**: Install and activate the [WPGraphQL](https://www.wpgraphql.com/) plugin on your WordPress site. This exposes the GraphQL API.
3.  **WPGraphQL for ACF** (Optional): If you use Advanced Custom Fields, you'll need this add-on.

## Configuration

1.  Create a `.env.local` file in the root of the project (if it doesn't exist).
2.  Add your WordPress API URL:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
```

## Verifying Connection

The application is built to fail gracefully if the connection is missing (it will show empty states).

To verify:
1.  Ensure your WP site is public or locally accessible.
2.  Run `npm run dev`.
3.  Check the "Latest Headlines" section. If you see posts from your WordPress site, it's working!

## Troubleshooting

-   **CORS Errors**: If you host WP on a different domain, you may need to configure CORS headers in WordPress or use a plugin like "WPGraphQL CORS".
-   **Images**: Ensure your WordPress images are accessible. Next.js `next.config.ts` might need to be updated to allow your WordPress image domain if you use `next/image` optimization rigorously (currently set to unoptimized or configured for basic domains).
