import { YO_VAULT_ADDRESSES, TOKEN_ADDRESSES, DISPLAY_CURRENCIES } from './constants';

export type AccountId = 'dollar' | 'euro' | 'bitcoin' | 'ethereum' | 'gold';

export interface SavingsAccount {
  id: AccountId;
  displayName: string;
  icon: string;
  yoVault: keyof typeof YO_VAULT_ADDRESSES;
  underlyingToken: keyof typeof TOKEN_ADDRESSES;
  displayCurrency: keyof typeof DISPLAY_CURRENCIES;
  currencySymbol: string;
  vaultAddress: string;
  tokenAddress: string;
}

export const SAVINGS_ACCOUNTS: Record<AccountId, SavingsAccount> = {
  dollar: {
    id: 'dollar',
    displayName: 'Dollar Savings',
    icon: '💵',
    yoVault: 'yoUSD',
    underlyingToken: 'USDC',
    displayCurrency: 'USD',
    currencySymbol: DISPLAY_CURRENCIES.USD,
    vaultAddress: YO_VAULT_ADDRESSES.yoUSD,
    tokenAddress: TOKEN_ADDRESSES.USDC,
  },
  euro: {
    id: 'euro',
    displayName: 'Euro Savings',
    icon: '💶',
    yoVault: 'yoEUR',
    underlyingToken: 'EURC',
    displayCurrency: 'EUR',
    currencySymbol: DISPLAY_CURRENCIES.EUR,
    vaultAddress: YO_VAULT_ADDRESSES.yoEUR,
    tokenAddress: TOKEN_ADDRESSES.EURC,
  },
  bitcoin: {
    id: 'bitcoin',
    displayName: 'Bitcoin Savings',
    icon: '₿',
    yoVault: 'yoBTC',
    underlyingToken: 'cbBTC',
    displayCurrency: 'BTC',
    currencySymbol: DISPLAY_CURRENCIES.BTC,
    vaultAddress: YO_VAULT_ADDRESSES.yoBTC,
    tokenAddress: TOKEN_ADDRESSES.cbBTC,
  },
  ethereum: {
    id: 'ethereum',
    displayName: 'Ethereum Savings',
    icon: '⟠',
    yoVault: 'yoETH',
    underlyingToken: 'WETH',
    displayCurrency: 'ETH',
    currencySymbol: DISPLAY_CURRENCIES.ETH,
    vaultAddress: YO_VAULT_ADDRESSES.yoETH,
    tokenAddress: TOKEN_ADDRESSES.WETH,
  },
  gold: {
    id: 'gold',
    displayName: 'Gold Savings',
    icon: '🥇',
    yoVault: 'yoGOLD',
    underlyingToken: 'XAUt',
    displayCurrency: 'GOLD',
    currencySymbol: DISPLAY_CURRENCIES.GOLD,
    vaultAddress: YO_VAULT_ADDRESSES.yoGOLD,
    tokenAddress: TOKEN_ADDRESSES.XAUt,
  },
};

export const getAccountById = (id: AccountId): SavingsAccount => {
  return SAVINGS_ACCOUNTS[id];
};

export const getAllAccounts = (): SavingsAccount[] => {
  return Object.values(SAVINGS_ACCOUNTS);
};