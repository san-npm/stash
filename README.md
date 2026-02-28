# Stash

Modern savings app that earns you real yield on your money. No crypto complexity, just better interest rates.

![Stash App Screenshot](./screenshot.png)
*Clean, mobile-first interface inspired by modern banking apps*

## What is Stash?

Stash makes DeFi accessible to everyone by hiding all the complexity behind a familiar banking interface. Users simply create an account with their email, deposit dollars or euros, and earn competitive interest rates — all while their funds are actually earning real DeFi yields through YO Protocol vaults on Base.

## Features

- **Email signup only** — No seed phrases or wallet setup required
- **Real yield** — Earn competitive interest rates on USD and EUR deposits
- **Instant access** — Withdraw your money anytime, no lock-up periods
- **Mobile-first** — Optimized for phones with offline PWA support
- **Bank-like UX** — Familiar interface that looks like N26 or Revolut
- **Zero crypto jargon** — Users see "savings accounts" and "interest rates"
- **Multi-currency** — Support for both Dollar and Euro savings
- **Secure** — Non-custodial wallets powered by Privy's embedded wallet infrastructure

## Tech Stack

- **Frontend**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with Framer Motion animations
- **Wallet Infrastructure**: Privy (embedded wallets with email auth)
- **Blockchain**: Base (Layer 2)
- **DeFi Integration**: YO Protocol SDK
- **Web3 Libraries**: wagmi, viem
- **Deployment**: Vercel with PWA support

## Architecture

Stash combines three key technologies to deliver a seamless experience:

### 1. Privy Embedded Wallets
- Users sign up with just their email address
- Wallet is created and managed silently in the background
- Private keys are secured using Privy's infrastructure
- No seed phrases or crypto knowledge required

### 2. YO Protocol Integration
- User deposits are automatically routed to YO Protocol vaults
- yoUSD vault for dollar savings
- yoEUR vault for euro savings
- Real DeFi yields without user complexity

### 3. Progressive Web App
- Installable on mobile devices
- Offline support for account viewing
- Native app-like experience
- Push notifications for important updates

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/san-npm/stash.git
cd stash

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## YO SDK Hackathon

This project was built for the YO SDK Hackathon on DoraHacks, showcasing how YO Protocol can power consumer-friendly DeFi applications.

### Judging Criteria Alignment

- **User Experience (30%)**: Clean, intuitive interface that hides crypto complexity
- **Creativity (30%)**: Novel approach to making DeFi accessible through familiar banking UX
- **SDK Usage (20%)**: Deep integration with YO Protocol vaults for real yield generation
- **Trust (20%)**: Non-custodial architecture with transparent, auditable smart contracts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- **Live Demo**: [stash-app.vercel.app](https://stash-app.vercel.app)
- **Repository**: [github.com/san-npm/stash](https://github.com/san-npm/stash)
- **YO Protocol**: [yo.finance](https://yo.finance)
- **DoraHacks Submission**: [dorahacks.io/hackathon/yo-sdk](https://dorahacks.io/hackathon/yo-sdk)