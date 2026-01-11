export interface MenuItem {
  title: string;
  href: string;
  external?: boolean;
}

export const getMenu = (): MenuItem[] => {
  return [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blocks",
      href: "/blocks",
    },
    {
      title: "Transactions",
      href: "/transactions",
    },
    {
      title: "Contracts",
      href: "/contracts",
    },
    {
      title: "Pool",
      href: "/pool",
    },
    {
      title: "Feedback",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSfBguf59QpRRgVVFZCWt8S2D6W9aGlB8QEpxIfVJrrwH3fjUw/viewform?usp=publish-editor",
      external: true,
    },
    {
      title: "Project Catalyst",
      href: "https://projectcatalyst.io/funds/15/cardano-use-cases-prototype-and-launch/midnight-explorer-a-privacy-preserving-blockchain-explorer",
      external: true,
    },
  ];
};
