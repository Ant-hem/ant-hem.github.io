module.exports = {
  title: 'Ant-hem\'s home',
  description:
      'Software Engineer writing articles about C++, C#, Java and other stuff.',
  theme: '@vuepress/theme-blog',
  themeConfig: {
    nav: [
      {
        text: 'Blog',
        link: '/',
      },
      {
        text: 'Tags',
        link: '/tag/',
      },
      {
        text: 'About',
        link: '/about/index.html',
      },
    ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/Ant-hem/',
        },
        {
          type: 'twitter',
          link: 'https://twitter.com/Antoine_hy/',
        },
        {
          type: 'linkedin',
          link: 'https://www.linkedin.com/in/antoinehemery/',
        }
      ],
      copyright: [
        {
          text: 'Privacy Policy',
          link: 'https://policies.google.com/privacy?hl=en-US',
        },
        {
          text: 'MIT Licensed | Copyright © 2019-present',
          link: '',
        },
        {
          text: 'Source',
          link: 'https://github.com/Ant-hem/ant-hem.github.io/',
        }
      ],
    },
    sitemap: {hostname: 'https://ahemery.dev'},
    feed: {
      canonical_base: 'https://ahemery.dev',
    },
  },

}
