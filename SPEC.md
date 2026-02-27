# Stash — DeFi Savings for Everyone

## Vision
A savings app that looks and feels like N26/Revolut. Zero crypto jargon. Users see savings accounts with interest rates, not vaults with APYs. All blockchain complexity is invisible.

## Language Rules (CRITICAL)
NEVER show on the UI:
- "Vault", "TVL", "APY", "DeFi", "Web3", "blockchain", "on-chain"
- Wallet addresses (0x...)
- Transaction hashes
- Token contract addresses
- "Shares", "redeem", "approve", "gas"

ALWAYS use instead:
- "Savings account" (not vault)
- "Annual rate" or "Interest rate" (not APY)
- "Deposit" / "Withdraw" (not deposit/redeem)
- "Balance" (not position)
- "Processing..." (not "confirming transaction...")
- Currency symbols: $, €, £ (not USDC, EURC, WETH)

## Accounts (mapped to YO vaults)
| Display Name | Icon | YO Vault | Underlying | Display Currency |
|---|---|---|---|---|
| Dollar Savings | 💵 | yoUSD | USDC | $ |
| Euro Savings | 💶 | yoEUR | EURC | € |
| Bitcoin Savings | ₿ | yoBTC | cbBTC | BTC |
| Ethereum Savings | ⟠ | yoETH | WETH | ETH |
| Gold Savings | 🥇 | yoGOLD | XAUt | oz |

## Pages

### 1. Landing / Onboard
- Hero: "Your savings, earning more"
- Subtitle: "Open a savings account in 30 seconds. Earn up to X% per year."
- Single CTA: "Get Started"
- Connect wallet via email (Privy or RainbowKit embedded wallet)
- NO mention of crypto, blockchain, wallet

### 2. Home Dashboard
- "Good morning, [name]" greeting
- Total balance card (all accounts combined, in USD)
- "You've earned $X.XX this month" highlight
- List of savings accounts with balance + annual rate
- Floating "+" button to deposit

### 3. Account Detail
- Account name + icon
- Balance (large, prominent)
- Annual rate badge
- Earnings chart (line chart, last 30 days from useVaultHistory)
- "Deposit" and "Withdraw" buttons
- Transaction history (recent deposits/withdrawals)

### 4. Deposit Flow
- Select account (or pre-selected from account detail)
- Amount input with currency symbol (large, centered)
- Quick amounts: $50, $100, $500, $1000
- "Deposit" button
- Loading state: "Processing your deposit..." (with subtle animation)
- Success state: "Done! $100 added to Dollar Savings" with confetti
- Behind the scenes: approve → deposit via YO SDK, user sees nothing

### 5. Withdraw Flow  
- Same UX as deposit but "Withdraw"
- Shows available balance
- "Processing your withdrawal..."
- Success: "Done! $100 sent to your wallet"
- Behind the scenes: redeem via YO SDK

### 6. Savings Goals
- Create a goal: name, target amount, linked account
- Visual progress: ring/bar showing % saved
- "Vacation 🏖️ — $340 / $2,000 (17%)"
- Tap to deposit more toward this goal
- Stored in localStorage

## Tech Stack
- **Next.js 15** App Router
- **@yo-protocol/react** + **@yo-protocol/core**
- **wagmi v2** + **viem**
- **@rainbow-me/rainbowkit** (with email login if possible, otherwise standard)
- **TanStack Query**
- **Tailwind CSS v4**
- **Framer Motion** (animations, page transitions)
- **Recharts** (earnings chart)
- **TypeScript** strict mode
- **Base chain** (8453) — cheapest gas

## Design System

### Colors
- Background: #09090B (near black)
- Cards: #18181B (zinc-900) with subtle border #27272A
- Primary accent: #10B981 (emerald-500) — money green
- Secondary: #6366F1 (indigo-500) — for charts
- Text: #FAFAFA (zinc-50) primary, #A1A1AA (zinc-400) secondary
- Success: #10B981, Error: #EF4444

### Typography
- Font: Inter (clean, banking feel)
- Balance numbers: tabular-nums, text-4xl font-semibold
- Section headers: text-lg font-medium
- Body: text-sm text-zinc-400

### Components
- Cards with rounded-2xl, subtle border, no harsh shadows
- Buttons: rounded-xl, h-12, font-medium
- Inputs: rounded-xl, large touch targets (min 48px)
- Bottom navigation bar (mobile): Home, Accounts, Goals
- Pull-to-refresh feel on dashboard
- Skeleton loaders (not spinners)

### Animations
- Page transitions: slide + fade (framer-motion)
- Numbers: count-up animation on balance
- Deposit success: confetti burst
- Goal progress: animated ring fill
- Card hover: subtle scale(1.02)

## Project Structure
```
app/
├── layout.tsx              # Root + providers + bottom nav
├── page.tsx                # Home dashboard
├── accounts/
│   └── [id]/page.tsx       # Account detail + chart
├── deposit/page.tsx        # Deposit flow
├── withdraw/page.tsx       # Withdraw flow
├── goals/page.tsx          # Savings goals
├── onboard/page.tsx        # Landing + wallet connect
└── providers.tsx           # Wagmi + RainbowKit + YieldProvider
components/
├── BalanceCard.tsx          # Total balance display
├── AccountRow.tsx           # Account in list
├── DepositForm.tsx          # Amount input + submit
├── WithdrawForm.tsx         # Amount input + submit
├── EarningsChart.tsx        # Line chart (Recharts)
├── GoalCard.tsx             # Savings goal with progress
├── BottomNav.tsx            # Mobile bottom navigation
├── Confetti.tsx             # Success animation
├── CountUp.tsx              # Animated number
└── Skeleton.tsx             # Loading placeholder
lib/
├── wagmi.ts                # Config (Base chain)
├── accounts.ts             # Vault → human-friendly account mapping
├── goals.ts                # localStorage CRUD
├── format.ts               # Currency formatting helpers
└── constants.ts            # Chain config, addresses
```

## YO SDK Usage
- `useVaults()` → populate accounts list with rates
- `useVault(name)` → account detail page
- `useUserBalance(vault, address)` → show balance
- `useVaultHistory(vault)` → earnings chart data
- `useDeposit({ vault })` → deposit flow
- `useRedeem({ vault })` → withdraw flow
- `useApprove({ token })` → auto-approve before deposit
- `VAULTS` constant → map account names to vault addresses

## Trust & Safety (20% of judging)
- Show "Secured by [protocol name]" at bottom of account pages
- Link to audit reports (small, non-intrusive)
- Show deposit/withdrawal confirmations with check marks
- "Your funds are always yours. Withdraw anytime." messaging
- HTTPS only, no sensitive data in localStorage (only goal names/targets)

## What Makes This Win
1. **Zero crypto UX** — judges will compare this to other submissions that look like DeFi dashboards. This looks like a banking app.
2. **Savings goals** — emotional connection to money. Not just yield farming.
3. **Polish** — animations, skeleton loaders, confetti, count-up numbers. Feels expensive.
4. **Trust** — clean language builds trust. No scary crypto terms.
