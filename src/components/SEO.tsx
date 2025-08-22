import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  currentPostIndex?: number;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  currentPostIndex = 0
}) => {
  // Default values
  const defaultTitle = 'Studio Nufab - Design Studio & Creative Blog';
  const defaultDescription = 'Studio Nufab is a design studio exploring culture, art, and human connection. Discover our philosophy, creative process, and long-form content about design, culture, and innovation.';
  const defaultKeywords = 'design studio, creative agency, culture, art, design philosophy, Indian design, creative blog, design thinking, innovation, human-centered design';
  const defaultImage = 'https://nufab.studio/og-image.jpg';
  const defaultUrl = 'https://nufab.studio';

  // Blog post specific content
  const blogPosts = [
    {
      title: 'NUFAB IS A DESIGN STUDIO*',
      description: 'An exploration of Studio Nufab\'s philosophy, looking inward at Indian culture and design traditions. Discover how we preserve culture with evolution.',
      keywords: 'design studio, Indian culture, design philosophy, cultural preservation, evolution, art, creativity'
    },
    {
      title: 'OUR LOGO',
      description: 'A deep dive into the meaning and philosophy behind the Studio Nufab logo design. Understanding the intersection of art and design.',
      keywords: 'logo design, brand identity, design philosophy, art and design, creative process, visual identity'
    },
    {
      title: 'This blog doesn\'t exist',
      description: 'Coming soon - More thoughtful content about design, culture, and creative philosophy from Studio Nufab.',
      keywords: 'design blog, creative content, upcoming posts, design thinking, cultural exploration'
    }
  ];

  const currentPost = blogPosts[currentPostIndex] || blogPosts[0];

  const finalTitle = title || currentPost.title;
  const finalDescription = description || currentPost.description;
  const finalKeywords = keywords || currentPost.keywords;
  const finalImage = image || defaultImage;
  const finalUrl = url || defaultUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Studio Nufab" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />
      <meta property="twitter:creator" content="@nufab_in" />
      <meta property="twitter:site" content="@nufab_in" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1244F1" />
      <meta name="msapplication-TileColor" content="#1244F1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Studio Nufab" />
      
      {/* Structured Data for current blog post */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": currentPost.title,
          "description": currentPost.description,
          "author": {
            "@type": "Organization",
            "name": "Studio Nufab",
            "url": "https://nufab.studio"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Studio Nufab",
            "logo": {
              "@type": "ImageObject",
              "url": "https://nufab.studio/logo.png"
            }
          },
          "datePublished": "2024-01-01",
          "dateModified": "2024-01-01",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": finalUrl
          },
          "image": finalImage,
          "keywords": currentPost.keywords
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
