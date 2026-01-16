# Complete Domain & Architecture Setup Guide (Troubleshooting Edition)

**Current Status:**
*   DNS is correct (Global DNS sees `cms` -> `64.29.17.65`).
*   **Missing Step**: GoDaddy's server might not know it's supposed to answer for `cms`.

---

## Step 1: Tell GoDaddy about the Subdomain (Crucial)

*Just pointing the IP isn't enough; the server needs to claim the name.*

1.  Log in to your **GoDaddy Hosting Dashboard** (cPanel / Managed WP).
2.  Look for a section called **Domains** or **Subdomains**.
3.  **Create a New Subdomain**:
    *   **Subdomain**: `cms`
    *   **Domain**: `kikayabinkarubi.net`
    *   **Document Root / Destination**: Select your **Main Website Folder** (usually `/public_html` or `/`).
        *   *Why?* We want `cms.kikayabinkarubi.net` to show the EXACT SAME WordPress as your main site for now.
    *   Click **Create**.

## Step 2: Verify Connection

1.  Wait 5 minutes.
2.  Visit `http://cms.kikayabinkarubi.net`.
3.  **It works if**: You see your current website (or a login page).

## Step 3: Rename WordPress

*Only proceed once Step 2 works.*

1.  Log in to `kikayabinkarubi.net/wp-admin`.
2.  Go to **Settings** -> **General**.
3.  **WordPress Address (URL)**: Change to `https://cms.kikayabinkarubi.net`
4.  **Site Address (URL)**: Change to `https://cms.kikayabinkarubi.net`
5.  Click **Save Changes**.

## Step 4: Final Vercel Check

1.  Ensure Vercel Domains has `kikayabinkarubi.net` as verified.
