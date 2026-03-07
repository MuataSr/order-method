import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            avatar: true,
            bypassGates: true, // Explicitly select this field
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        console.log('[AUTH] User login - bypassGates:', user.bypassGates); // Debug log

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          bypassGates: user.bypassGates,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('[JWT CALLBACK] Triggered - user:', user ? 'present' : 'not present', 'token.id:', token?.id);
      
      if (user) {
        console.log('[JWT CALLBACK] Initial login - user.bypassGates:', user.bypassGates);
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.bypassGates = user.bypassGates ?? false;
        console.log('[JWT CALLBACK] Token set - bypassGates:', token.bypassGates);
      } else if (token?.id) {
        console.log('[JWT CALLBACK] Session update - fetching from DB for user:', token.id);
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { bypassGates: true },
        });
        if (dbUser) {
          console.log('[JWT CALLBACK] DB user found - bypassGates:', dbUser.bypassGates);
          token.bypassGates = dbUser.bypassGates ?? false;
        } else {
          console.log('[JWT CALLBACK] DB user not found!');
        }
      }
      
      console.log('[JWT CALLBACK] Returning token with bypassGates:', token.bypassGates);
      return token;
    },
    async session({ session, token }) {
      console.log('[SESSION CALLBACK] Triggered - token exists:', !!token);
      console.log('[SESSION CALLBACK] Token bypassGates:', token?.bypassGates);
      
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string | null;
        session.user.bypassGates = token.bypassGates as boolean;
        
        console.log('[SESSION CALLBACK] Session set - bypassGates:', session.user.bypassGates);
      }
      
      console.log('[SESSION CALLBACK] Returning session with bypassGates:', session.user?.bypassGates);
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      });
    },
  },
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar: string | null;
      bypassGates: boolean;
    };
  }

  interface User {
    id: string;
    role: string;
    avatar: string | null;
    bypassGates: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    avatar: string | null;
    bypassGates: boolean;
  }
}
