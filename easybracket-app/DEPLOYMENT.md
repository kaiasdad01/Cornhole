# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Supabase Project**: Set up your Supabase project and get credentials

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set the **Root Directory** to: `easybracket-app`

### 2. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Build Settings

Vercel will automatically detect this is a Next.js project and use the correct settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Deploy

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build the application
3. Deploy to production

## Configuration Files

### vercel.json
This file contains Vercel-specific configuration:
- Build and deployment settings
- Security headers
- Function timeout settings

### next.config.mjs
Optimized for Vercel deployment with:
- Standalone output
- Performance optimizations
- Build optimizations

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

2. **Environment Variables**
   - Make sure `NEXT_PUBLIC_` prefix is used for client-side variables
   - Verify Supabase credentials are correct

3. **Performance Issues**
   - Check the PERFORMANCE_FIXES.md file for optimization tips
   - Monitor build times in Vercel dashboard

### Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Check Supabase connection

## Post-Deployment

After successful deployment:
1. Test all features work correctly
2. Verify authentication flows
3. Check database connections
4. Monitor performance metrics 