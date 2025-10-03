# Environment Setup Guide for ABL Natasha Enterprises

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Paystack Configuration (for payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Setup Steps

1. **Database Setup**: Run the complete production schema script in your Supabase SQL editor:
   \`\`\`sql
   -- Run scripts/complete-production-schema.sql
   \`\`\`

2. **Admin Account**: 
   - Sign up with email: `talktostevenson@gmail.com`
   - The system will automatically create an admin profile

3. **Test Admin Access**:
   - Navigate to `/admin/test`
   - Click "Test Admin Access" to verify setup

4. **Environment Variables**:
   - Set up your Supabase project URL and anon key
   - Configure Paystack for payments
   - Update app URL for production

## Production Deployment

1. Update environment variables for production
2. Run database migration script
3. Test all admin functions
4. Verify payment integration

## Troubleshooting

- If admin access fails, check database RLS policies
- Verify environment variables are correctly set
- Check Supabase project status and permissions
