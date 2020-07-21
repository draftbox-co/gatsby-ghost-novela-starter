let siteConfig;
let ghostConfig;

// loading site config
try {
  siteConfig = require(`./siteConfig`);
} catch (e) {
  siteConfig = null;
}

// loading ghost config
try {
  ghostConfig = require(`./.ghost`);
} catch (e) {
  ghostConfig = {
    development: {
      apiUrl: process.env.GHOST_API_URL,
      contentApiKey: process.env.GHOST_CONTENT_API_KEY,
      version: process.env.GHOST_VERSION,
    },
    production: {
      apiUrl: process.env.GHOST_API_URL,
      contentApiKey: process.env.GHOST_CONTENT_API_KEY,
      version: process.env.GHOST_VERSION,
    },
  };
} finally {
  const { apiUrl, contentApiKey } =
    process.env.NODE_ENV === `development`
      ? ghostConfig.development
      : ghostConfig.production;

  if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
    ghostConfig = null; //allow default config to take over
  }
}

// setting up plugins
let gatsbyPlugins = [
  {
    resolve: `@draftbox-co/gatsby-ghost-novela-theme`,
    options: {
      ghostConfig: ghostConfig,
      siteConfig: siteConfig,
    },
  },
];

if (process.env.SEGMENT_KEY) {
  gatsbyPlugins.push({
    resolve: `gatsby-plugin-segment-js`,
    options: {
      prodKey: process.env.SEGMENT_KEY,
      devKey: process.env.SEGMENT_KEY,
      trackPage: true,
      delayLoad: true,
      delayLoadTime: 1000,
    },
  });
}

if (process.env.GA) {
  gatsbyPlugins.unshift({
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: process.env.GA,
      head: true,
    },
  });
}

if (process.env.GATSBY_MIXPANEL_TOKEN) {
  gatsbyPlugins.push({
    resolve: `gatsby-plugin-mixpanel`,
    options: {
      apiToken: process.env.GATSBY_MIXPANEL_TOKEN,
      enableOnDevMode: true,
      pageViews: "all",
    },
  });
}

if (process.env.GATSBY_HOTJAR_ID) {
  gatsbyPlugins.push({
    resolve: `@draftbox-co/gatsby-plugin-hotjar-lazy`,
    options: {
      id: process.env.GATSBY_HOTJAR_ID,
      sv: 6,
      optimize: true,
    },
  });
}

if (process.env.GATSBY_GTAG_MANAGER_ID) {
  gatsbyPlugins.unshift({
    resolve: `gatsby-plugin-google-tagmanager`,
    options: {
      id: process.env.GATSBY_GTAG_MANAGER_ID,
      includeInDevelopment: true,
    },
  });
}

if (process.env.GATSBY_TAWK_ID) {
  gatsbyPlugins.push({
    resolve: `@draftbox-co/gatsby-plugin-tawk-lazy`,
    options: {
      tawkId: process.env.GATSBY_TAWK_ID,
      optimize: true
    },
  });
}

if (process.env.GATSBY_CRISP_ID) {
  gatsbyPlugins.push({
    resolve: `@draftbox-co/gatsby-plugin-crisp-chat-lazy`,
    options: {
      websiteId: process.env.GATSBY_CRISP_ID,
      enableDuringDevelop: true,
      optimize: true
    },
  });
}

if (process.env.GATSBY_OLARK_ID) {
  gatsbyPlugins.push({
    resolve: `@draftbox-co/gatsby-plugin-olark-lazy`,
    options: {
      olarkSiteID: process.env.GATSBY_OLARK_ID,
      optimize: true
    },
  });
}

module.exports = {
  plugins: gatsbyPlugins,
};
