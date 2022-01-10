import type { TokenInfo } from "@saberhq/token-utils";

export interface GovernorConfig {
  slug: string;
  name: string;
  description: string;
  address: string;

  govToken: {
    address: string;
  } & Partial<Omit<TokenInfo, "mint">>;

  customLogoURI?: string;
  /**
   * Settings for minting tokens as the DAO. Enabling this allows DAO members to create "mint" proposals which can be used for grants.
   */
  minter?: {
    /**
     * The Quarry mint wrapper.
     */
    mintWrapper: string;
    /**
     * The redeemer key, if applicable.
     *
     * The consumer of the redeemer key should be aware of how to handle different types of redeemers,
     * based on the owner of this account.
     */
    redeemer?: string;
  };
  /**
   * Settings for the Quarry Gauge system.
   */
  gauge?: {
    /**
     * The Gaugemeister, if gauges are enabled for this governor.
     */
    gaugemeister: string;
  };
  /**
   * Settings for how proposals should be managed.
   */
  proposals?: {
    /**
     *
     */
    instructions?: string;
    /**
     * If specified, this links to the forum for discussing proposals.
     */
    requiredDiscussionLink?: string | null;
  };
  links?: {
    forum?: string;
  };
}

export interface GovernorMeta extends GovernorConfig {
  govToken: TokenInfo;
  iconURL: string;
}
