import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase' // Import your Supabase client

function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[color:var(--c-bg)] text-[color:var(--c-fg)]">
  <div className="p-8 w-full max-w-md rounded-lg border-[1px] border-[color:var(--c-stroke)] bg-[color:var(--c-bg)] text-[color:var(--c-fg)]">
    <h1 className="text-4xl font-bold mb-6 text-center border-b-4 border-[color:var(--c-stroke)] lowercase">PitchCraft Login</h1>
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google', 'github']}
      theme="dark"
    />
  </div>
</div>
  )
}

export default LoginPage
