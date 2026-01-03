# Connecting Your Domain (Classic Admin / Self-Hosted)

If you see a **Black Sidebar** (Dashboard, Posts, Media, Pages), you are in the **WordPress Admin**.

**Important**: You usually **cannot** change your domain from here. You must go to your **Hosting Account** (where you pay for your server).

## Phase 1: Access Your Hosting Panel
This is **NOT** your WordPress Dashboard. This is the website of your host (e.g., Bluehost, SiteGround, HostGator, GoDaddy, cPanel).

1.  Log in to your **Hosting Provider**.
2.  Look for **"Domains"** or **"DNS Manager"**.
3.  Look for **"Subdomains"**.

## Phase 2: Create the Subdomain
1.  In your Hosting Panel, create a subdomain called `cms`.
    *   This will create `cms.kikayabinkarubi.net`.
2.  Use your host's tool to **move** or **point** your WordPress installation to this new subdomain.
    *   *Note*: If you are unsure, ask your hosting support: *"I want to move my WordPress site to a subdomain (cms.kikayabinkarubi.net) so I can use the main domain for a Next.js app."*

## Phase 3: Update Main Domain DNS
Once WordPress is safely on `cms.kikayabinkarubi.net`:
1.  Go to the **DNS Settings** for your main domain (`kikayabinkarubi.net`).
2.  Add the Vercel records:

| Type | Name | Value |
| :--- | :--- | :--- |
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

## Phase 4: Update Vercel
1.  Go to **Vercel Dashboard** > Settings > Environment Variables.
2.  Update `NEXT_PUBLIC_WORDPRESS_API_URL` to `https://cms.kikayabinkarubi.net/graphql`.
3.  Redeploy.
