import { Post, Category } from "./data";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://demo.wpgraphql.com/graphql";

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    // Validating URL presence
    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not defined");
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`API Fetch Failed: ${res.status} ${res.statusText}`);
      console.error(`URL attempted: ${API_URL}`);
      throw new Error(`WordPress API returned status ${res.status}`);
    }

    const text = await res.text();

    try {
      const json = JSON.parse(text);
      if (json.errors) {
        console.error(json.errors);
        throw new Error('Failed to fetch from WordPress API');
      }
      return json.data;
    } catch (parseError) {
      console.error("Invalid JSON response from WordPress API.");
      console.error("API URL:", API_URL);
      console.error("Response Start:", text.substring(0, 200));
      throw new Error("Received HTML instead of JSON. Check your URL.");
    }
  } catch (e) {
    console.error("WordPress API Error:", e);
    return null;
  }
}

export async function getAllPostsForHome(): Promise<Post[]> {
  const data = await fetchAPI(`
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          databaseId
          date
          slug
          title
          excerpt
          content
          author {
            node {
              databaseId
              name
            }
          }
          categories {
            nodes {
              databaseId
              name
              slug
            }
          }
          featuredImage {
            node {
              databaseId
              sourceUrl
            }
          }
        }
      }
    }
  `);

  return data?.posts?.nodes?.map(mapPostFromWP) || [];
}

export async function getPostBySlugFromWP(slug: string): Promise<Post | undefined> {
  const data = await fetchAPI(`
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        databaseId
        date
        slug
        title
        excerpt
        content
        author {
          node {
            databaseId
            name
          }
        }
        categories {
          nodes {
            databaseId
            name
            slug
          }
        }
        featuredImage {
          node {
            databaseId
            sourceUrl
          }
        }
      }
    }
  `, {
    variables: { slug }
  });

  if (!data?.post) return undefined;
  return mapPostFromWP(data.post);
}

function mapPostFromWP(node: any): Post {
  return {
    id: node.databaseId,
    date: node.date,
    slug: node.slug,
    title: node.title,
    content: node.content,
    excerpt: node.excerpt,
    author_id: node.author?.node?.databaseId || 0,
    author_name: node.author?.node?.name || "Team BKBK",
    categories: node.categories?.nodes?.map((cat: any) => cat.databaseId) || [],
    featured_media_id: node.featuredImage?.node?.databaseId || 0,
    featured_image_url: node.featuredImage?.node?.sourceUrl || null,
    // Helper property not in original interface but useful
    category_names: node.categories?.nodes?.map((cat: any) => cat.name) || [],
  };
}
