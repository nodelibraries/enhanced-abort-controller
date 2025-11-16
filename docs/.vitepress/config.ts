import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '@nodelibraries/enhanced-abort-controller',
  description:
    'Enhanced AbortController with Node.js-style patterns for modern TypeScript applications',
  base: '/enhanced-abort-controller/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    [
      'meta',
      {
        name: 'keywords',
        content:
          'abort-controller, cancellation, async, typescript, javascript, nodejs, timeout, signal',
      },
    ],
    [
      'meta',
      {
        property: 'og:title',
        content:
          '@nodelibraries/enhanced-abort-controller - Enhanced AbortController',
      },
    ],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Enhanced AbortController with Node.js-style patterns for modern TypeScript applications',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    [
      'meta',
      {
        property: 'og:url',
        content: 'https://nodelibraries.github.io/enhanced-abort-controller/',
      },
    ],
  ],

  themeConfig: {
    search: {
      provider: 'local',
    },

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'GitHub',
        link: 'https://github.com/nodelibraries/enhanced-abort-controller',
      },
    ],

    sidebar: {
      '/guide/': [
        { text: 'Introduction', link: '/guide/' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'Quick Start', link: '/guide/quick-start' },
      ],
      '/examples/': [
        { text: 'Basic Usage', link: '/examples/basic' },
      ],
      '/api/': [
        { text: 'API Reference', link: '/api/' },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/nodelibraries/enhanced-abort-controller',
      },
    ],

    footer: {
      message:
        'Released under the MIT License. Made with ❤️ for the TypeScript and Node.js community.',
      copyright: 'Copyright © 2025 nodelibraries | Created by ylcnfrht',
    },
  },
});
