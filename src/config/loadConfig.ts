import { PublicKey } from "@solana/web3.js";

import type {
  GovernanceConfig,
  GovernorConfig,
  GovernorParameters,
  LockerParameters,
  QuarryConfig,
} from "./types";

type QuarryConfigJSON = Omit<
  QuarryConfig,
  "rewarder" | "mintWrapper" | "redeemer"
> & {
  rewarder?: string;
  mintWrapper?: string;
  redeemer?: string;
};

export interface GovernorConfigJSON
  extends Omit<
    GovernorConfig,
    "address" | "governance" | "quarry" | "saves" | "minter" | "gauge"
  > {
  address: string;
  governance: Omit<GovernanceConfig, "address" | "parameters"> & {
    address: string;
    parameters?: {
      governor?: Omit<GovernorParameters, "proposalActivationMinVotes"> & {
        proposalActivationMinVotes: string;
      };
      locker?: Omit<LockerParameters, "quorumVotes"> & {
        quorumVotes: string;
      };
    };
  };
  quarry?: QuarryConfigJSON;
  saves?: {
    mint: string;
    duration: number;
  }[];
  minter?: {
    mintWrapper?: string;
    redeemer?: string;
  };
  gauge?: Omit<GovernorConfig["gauge"], "gaugemeister"> & {
    gaugemeister: string;
  };
}

const loadQuarryConfig = ({
  rewarder,
  mintWrapper,
  redeemer,
  ...rest
}: QuarryConfigJSON): QuarryConfig => {
  return {
    ...rest,
    rewarder: rewarder ? new PublicKey(rewarder) : undefined,
    mintWrapper: mintWrapper ? new PublicKey(mintWrapper) : undefined,
    redeemer: redeemer ? new PublicKey(redeemer) : undefined,
  };
};

/**
 * Loads a Governor from its JSON representation.
 * @returns
 */
export const loadGovernorConfig = ({
  address,
  governance,
  quarry,
  saves,
  minter,
  gauge,
  ...rest
}: GovernorConfigJSON): GovernorConfig => {
  return {
    address: new PublicKey(address),
    governance: {
      ...governance,
      address: new PublicKey(governance.address),
      parameters: governance.parameters
        ? {
            governor: governance.parameters.governor,
            locker: governance.parameters.locker,
          }
        : undefined,
    },
    quarry: quarry ? loadQuarryConfig(quarry) : undefined,
    saves: saves
      ? saves.map(({ mint, duration }) => ({
          mint: new PublicKey(mint),
          duration,
        }))
      : undefined,
    minter: minter
      ? {
          mintWrapper: minter.mintWrapper
            ? new PublicKey(minter.mintWrapper)
            : undefined,
          redeemer: minter.redeemer
            ? new PublicKey(minter.redeemer)
            : undefined,
        }
      : undefined,
    gauge: gauge
      ? {
          ...gauge,
          gaugemeister: new PublicKey(gauge.gaugemeister),
        }
      : undefined,
    ...rest,
  };
};
