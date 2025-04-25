import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Overview',
    },
    'getting-started',
    'cli-usage',
    'programmatic-usage',
    'security-best-practices',
    {
      type: 'category',
      label: 'API Reference',
      items: ['api/cli', 'api/js', 'api/ts'],
      collapsed: false,
    },
  ],
};

export default sidebars;