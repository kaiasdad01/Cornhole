# EasyBracket - Tournament Management App

A modern, user-friendly tournament management application built with Next.js, designed for casual sports like Cornhole, Pickleball, and more.

## Features

- 🏆 **Tournament Creation**: Create custom tournaments with your own details
- 👥 **Team Management**: Add and manage teams for your tournaments
- 🏅 **Bracket Building**: Generate single elimination, double elimination, or round-robin brackets
- 📊 **Live Dashboard**: Real-time tournament progress tracking
- 🔐 **Email Authentication**: Simple sign-up and sign-in with email
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Modern UI**: Beautiful, intuitive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (Database, Authentication)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cornhole
   ```

2. **Install dependencies**
   ```bash
   cd easybracket-app
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the app directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
cornhole/
├── easybracket-app/                # Next.js app directory
│   ├── app/                        # Next.js app directory
│   ├── components/                 # React components
│   ├── lib/                        # Utilities and services
│   ├── hooks/                      # Custom React hooks
│   └── styles/                     # Global styles
├── .gitignore
└── README.md
```

## Usage

1. **Create an Account**: Sign up with your email to access admin features
2. **Create Tournament**: Set up a new tournament with name, date, location, and bracket type
3. **Add Teams**: Enter team names and details
4. **Generate Bracket**: Automatically create tournament brackets
5. **Manage Live**: Track matches and update scores in real-time
6. **View Reports**: Get tournament statistics and results

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the **Root Directory** to: `easybracket-app`
4. Add environment variables in Vercel dashboard
5. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository. 