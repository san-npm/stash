import { VAULTS } from '@yo-protocol/core';

// Chain and protocol constants
export const CHAIN_ID = 8453; // Base chain - cheapest gas
export const CHAIN_NAME = 'Base';

// YO Protocol vault addresses from @yo-protocol/core
export const YO_VAULT_ADDRESSES = {
  yoUSD: VAULTS.yoUSD.address,
  yoEUR: VAULTS.yoEUR.address,
  yoBTC: VAULTS.yoBTC.address,
  yoETH: VAULTS.yoETH.address,
  yoGOLD: VAULTS.yoGOLD.address,
} as const;

// Underlying token addresses
export const TOKEN_ADDRESSES = {
  USDC: '0xA0b86a33E6412b9e0e4e518F6bFfFaF5bA41F4C6' as const,
  EURC: '0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42' as const,
  cbBTC: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf' as const,
  WETH: '0x4200000000000000000000000000000000000006' as const,
  XAUt: '0x68749665FF8D2d112Fa859AA293F07A622782F38' as const,
} as const;

// Display currencies
export const DISPLAY_CURRENCIES = {
  USD: '$',
  EUR: '€',
  BTC: '₿',
  ETH: 'Ξ',
  GOLD: 'oz',
} as const;