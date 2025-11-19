import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 ABL Natasha Enterprises - Database Setup\n')

  try {
    console.log('🔍 Checking database tables...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (tablesError && tablesError.code === '42P01') {
      console.log('\n⚠️  Database tables not found!')
      console.log('\n📋 Manual Setup Required:')
      console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard')
      console.log('2. Select your project')
      console.log('3. Go to SQL Editor (left sidebar)')
      console.log('4. Click "New Query"')
      console.log('5. Copy the contents of SUPABASE_SETUP.sql file')
      console.log('6. Paste it into the SQL Editor')
      console.log('7. Click "Run" to execute')
      console.log('\n✅ After running the SQL, run this command again: pnpm setup:db\n')
      process.exit(1)
    }

    console.log('✅ Database tables found!\n')

    console.log('🔍 Checking for admin user: talktostevenson@gmail.com')
    
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const adminUser = authUsers?.users.find(u => u.email === 'talktostevenson@gmail.com')

    if (adminUser) {
      console.log(`✅ Found user in auth.users (ID: ${adminUser.id})`)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', adminUser.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error checking profile:', profileError.message)
      }

      if (!profile) {
        console.log('📝 Creating admin profile...')
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: adminUser.id,
            email: adminUser.email!,
            is_admin: true,
            role: 'admin',
            full_name: adminUser.user_metadata?.full_name || 'Admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('❌ Error creating profile:', insertError.message)
          process.exit(1)
        }
        console.log('✅ Admin profile created successfully!')
      } else if (!profile.is_admin) {
        console.log('📝 Updating profile to admin...')
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_admin: true, role: 'admin', updated_at: new Date().toISOString() })
          .eq('id', adminUser.id)

        if (updateError) {
          console.error('❌ Error updating profile:', updateError.message)
          process.exit(1)
        }
        console.log('✅ Profile updated to admin successfully!')
      } else {
        console.log('✅ Admin profile already exists and configured!')
      }

      console.log('\n✨ Setup Complete!')
      console.log('\n📋 Next Steps:')
      console.log('1. Visit your app at the Replit URL')
      console.log('2. Sign in with: talktostevenson@gmail.com')
      console.log('3. Go to /admin to access the admin dashboard')
    } else {
      console.log('⚠️  User not found in auth.users')
      console.log('\n📋 Next Steps:')
      console.log('1. Visit your app at the Replit URL')
      console.log('2. Click "Sign Up" and create an account with: talktostevenson@gmail.com')
      console.log('3. After signing up, run this script again: npm run setup:db')
      console.log('4. Then you can access /admin')
    }

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setupDatabase()
