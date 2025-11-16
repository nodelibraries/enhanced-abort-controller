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

    ignoreDeadLinks: true,

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/nodelibraries/enhanced-abort-controller' },
      {
        text: '☕ Buy me a coffee',
        link: 'https://buymeacoffee.com/ylcnfrht',
        target: '_blank',
        rel: 'noopener noreferrer',
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
        { text: 'Express Integration', link: '/examples/express' },
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
        'Released under the MIT License. If you find this project helpful, consider <a href="https://buymeacoffee.com/ylcnfrht" target="_blank" rel="noopener noreferrer">buying me a coffee</a> ☕',
      copyright: 'Copyright © 2025 nodelibraries | Created by ylcnfrht',
    },
  },
});
