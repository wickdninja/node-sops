import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Node SOPS',
  tagline: 'Simple, secure secrets management for Node.js',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://node-sops.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'wickdninja', // Usually your GitHub org/user name.
  projectName: 'node-sops', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/wickdninja/node-sops/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/node-sops-social-card.jpg',
    navbar: {
      title: 'Node SOPS',
      logo: {
        alt: 'Node SOPS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'dropdown',
          label: 'API',
          position: 'left',
          items: [
            {
              label: 'CLI Reference',
              to: '/api/cli',
            },
            {
              label: 'JavaScript API',
              to: '/api/js',
            },
            {
              label: 'TypeScript API',
              to: '/api/ts',
            },
          ],
        },
        {
          href: 'https://github.com/wickdninja/node-sops',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started',
            },
            {
              label: 'CLI Usage',
              to: '/cli-usage',
            },
            {
              label: 'Programmatic Usage',
              to: '/programmatic-usage',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/node-sops',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/wickdninja/node-sops/discussions',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/wickdninja',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wickdninja/node-sops',
            },
            {
              label: 'Issues',
              href: 'https://github.com/wickdninja/node-sops/issues',
            },
            {
              label: 'Releases',
              href: 'https://github.com/wickdninja/node-sops/releases',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Node SOPS. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'diff', 'json', 'yaml'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;