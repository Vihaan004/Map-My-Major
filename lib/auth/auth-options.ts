import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { Adapter } from 'next-auth/adapters';
import { supabaseAdmin } from '@/lib/db/supabase-admin';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials');
}

export const authOptions: NextAuthOptions = {
  // Using JWT sessions (no database adapter needed!)
  // User data will be stored in the JWT token and synced to Supabase manually
  adapter: undefined,
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Save user to Supabase database when they sign in
      if (user.email && user.id) {
        try {
          // Upsert user (insert or update if exists)
          const { error: userError } = await supabaseAdmin
            .from('users')
            .upsert({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              email_verified: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (userError) {
            console.error('Error saving user:', userError);
          }

          // Save account info if this is OAuth
          if (account) {
            const { error: accountError } = await supabaseAdmin
              .from('accounts')
              .upsert({
                id: `${account.provider}-${account.providerAccountId}`,
                user_id: user.id,
                type: account.type,
                provider: account.provider,
                provider_account_id: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }, {
                onConflict: 'provider,provider_account_id'
              });

            if (accountError) {
              console.error('Error saving account:', accountError);
            }
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          userId: user.id,
          accessToken: account.access_token,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { userId: user.id, isNewUser });
    },
    async signOut({ token, session }) {
      console.log('User signed out');
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
