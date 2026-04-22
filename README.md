# LaunchTime

A production-ready video-call social dating web app built with Next.js, TypeScript, Tailwind CSS, Appwrite, Agora, and Paystack.

## Features

- **Authentication**: Sign up, sign in, email verification, role-based access (user, host, admin)
- **User Profiles**: Avatar upload, bio, interests, online status, wallet balance
- **Host Profiles**: Host photos, rates, online/offline toggle, earnings dashboard
- **Discover**: Browse hosts with filters, search, and clean card layouts
- **Coin System**: Buy coins with Paystack, track balance, transaction history
- **Video Calling**: 1-to-1 video calls with Agora Web SDK, timed billing, auto-end
- **Admin Panel**: Dashboard with stats, user/host management, transaction oversight
- **Safety**: Report/block users, terms/privacy pages, community rules
- **Responsive**: Mobile and desktop optimized UI

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Appwrite (auth, database, storage, functions)
- **Video**: Agora Web SDK
- **Payments**: Paystack
- **UI**: Headless UI, Lucide Icons, React Hook Form, React Hot Toast

## Getting Started

1. **Clone and Install**:
   ```bash
   git clone <your-repo-url>
   cd launchtime
   npm install
   ```

2. **Setup External Services**:
   - Follow the detailed setup guide in [SETUP.md](./SETUP.md)
   - Create accounts and get API keys for Appwrite, Agora, and Paystack

3. **Environment Variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # User dashboard
│   ├── (host)/            # Host-specific pages
│   ├── (admin)/           # Admin panel
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
├── services/              # External service integrations
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
├── constants/             # App constants
└── styles/                # Global styles
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Ensure your platform supports Next.js 15
- Add all environment variables
- Configure domain and SSL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@launchtime.com or create an issue in this repository.
