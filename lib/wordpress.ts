const API_URL = process.env.WORDPRESS_API_URL || "https://cms.kikayabinkarubi.net/graphql";

interface FetchAPIOptions {
  variables?: Record<string, unknown>;
}

async function fetchAPI(query: string, { variables }: FetchAPIOptions = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getAllPostsForHome(preview: boolean) {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `
  );

  return data?.posts;
}

interface PreviewData {
  post?: {
    id?: number;
    slug?: string;
    revisions?: { nodes: unknown[] };
  };
}

export async function getPostAndMorePosts(slug: string, preview: boolean, previewData: PreviewData) {
  const postPreview = preview ? previewData?.post : undefined;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview?.id
    : slug === postPreview?.slug;
  const isDraft = isSamePost && preview;
  const revisions = isDraft && postPreview?.revisions;
  const primary = isDraft && revisions ? revisions.nodes[0] : postPreview;

  const data = await fetchAPI(
    `
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        edges {
          node {
            name
            slug
          }
        }
      }
      author {
        node {
          name
          firstName
          lastName
          avatar {
            url
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview?.id : slug,
        idType: isDraft ? 'DATABASE_ID' : 'SLUG',
      },
    }
  );

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }: { node: { slug: string } }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
}
