# Oink 🐷💰

**Smart micro-investing through spare change round-ups**

Oink is a modern fintech platform that helps users build wealth effortlessly by automatically investing their spare change from everyday purchases into cryptocurrency. Every transaction gets rounded up to the nearest dollar, and the difference is invested into your chosen cryptocurrency portfolio.

## 🚀 Features

### Core Functionality
- **Automatic Round-ups**: Every purchase is rounded up to the nearest dollar
- **Crypto Investment**: Spare change is automatically invested in Bitcoin, Ethereum, Solana, and more
- **Smart Thresholds**: Set minimum investment amounts to optimize transaction fees
- **Real-time Portfolio Tracking**: Monitor your investments with beautiful charts and analytics
- **Bank Integration**: Secure connection to your bank accounts via Plaid

### Investment Options
- **Auto-Invest**: Set it and forget it - investments happen automatically when thresholds are met
- **Manual Investment**: Take control with one-click manual investments
- **Multiple Cryptocurrencies**: Choose from Bitcoin, Ethereum, Solana, Dogecoin, and more
- **Advanced Trading**: Market and limit orders for sophisticated investors

### User Experience
- **Beautiful Dashboard**: Clean, intuitive interface with real-time data
- **Mobile Responsive**: Works perfectly on all devices
- **Investment History**: Track all your investments and performance over time
- **Community Features**: Connect with other investors and share insights

## 🛠 Tech Stack

### Frontend
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful data visualization
- **shadcn/ui** - Modern UI components

### Backend & APIs
- **Next.js API Routes** - Serverless backend functions
- **Plaid API** - Bank account integration and transaction data
- **Coinbase API** - Cryptocurrency trading and portfolio management
- **Server Actions** - Type-safe server-side operations

### Infrastructure
- **Vercel** - Deployment and hosting
- **Environment Variables** - Secure API key management

## 🏗 Project Structure

```
oink/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── onboarding/        # User setup flow
│   ├── login/             # Authentication
│   ├── signup/            # User registration
│   ├── portfolio/         # Investment portfolio
│   ├── transactions/      # Transaction history
│   ├── community/         # Social features
│   └── api/               # API routes
│       ├── plaid/         # Bank integration
│       ├── coinbase/      # Crypto trading
│       └── user-data/     # User management
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard.tsx     # Main dashboard
│   ├── landing-page.tsx  # Marketing page
│   ├── sidebar.tsx       # Navigation
│   └── forms/            # Authentication forms
├── lib/                  # Utility functions
│   ├── plaid-server.ts   # Plaid integration
│   ├── coinbase-server.ts # Coinbase integration
│   └── utils.ts          # Helper functions
└── actions/              # Server Actions
    ├── user-actions.ts   # User management
    └── investment-actions.ts # Investment logic
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Plaid API credentials
- Coinbase API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ThomasCaneday/oink.git
   cd oink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your API credentials:
   ```env
   # Plaid Configuration
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret_key
   
   # Coinbase Configuration
   COINBASE_API_KEY=your_coinbase_api_key
   COINBASE_API_SECRET=your_coinbase_api_secret
   COINBASE_ACCOUNT_ID=your_coinbase_account_id
   COINBASE_PAYMENT_METHOD_ID=your_payment_method_id
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Plaid Setup
1. Create a Plaid account at [plaid.com](https://plaid.com)
2. Get your Client ID and Secret Key
3. Configure your allowed redirect URIs
4. Add your credentials to `.env.local`

### Coinbase Setup
1. Create a Coinbase account and enable API access
2. Generate API keys in your Coinbase Pro account
3. Set up a payment method for funding
4. Add your credentials to `.env.local`

### Development vs Production
The app includes a development mode toggle that uses mock APIs for testing without making real transactions. Toggle this in the dashboard settings.

## 📱 Usage

### For Users
1. **Sign up** and complete the onboarding flow
2. **Connect your bank** account securely via Plaid
3. **Choose your cryptocurrency** preferences
4. **Set your investment threshold** (minimum amount to invest)
5. **Start spending** - your spare change will automatically be invested!

### For Developers
- Use the development mode for testing
- Check the API testing section in the dashboard
- Monitor logs for debugging
- Use the mock APIs to avoid real transactions during development

## 🔒 Security

- **Bank-level security** with Plaid integration
- **API key encryption** and secure storage
- **No sensitive data** stored in the frontend
- **Environment variable protection**
- **Secure API endpoints** with proper validation

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Roadmap

- [ ] **Mobile App** - Native iOS and Android apps
- [ ] **More Cryptocurrencies** - Expand supported coins
- [ ] **Social Features** - Investment challenges and leaderboards
- [ ] **AI Insights** - Smart investment recommendations
- [ ] **Tax Integration** - Automatic tax reporting
- [ ] **Referral Program** - Earn rewards for inviting friends

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: thomascaneday@gmail.com

## 🙏 Acknowledgments

- **Plaid** for secure bank integration
- **Coinbase** for cryptocurrency trading APIs
- **Vercel** for hosting and deployment
- **shadcn/ui** for beautiful UI components
- **Next.js** team for the amazing framework
- **Pacific Software Ventures** superb full-stack development team

---

**Made with ❤️ by the Oink team**

*Start investing your spare change today and watch your wealth grow! 🐷💰*
