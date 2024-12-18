import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    {
      id: 'guest',
      name: 'Guest',
      type: 'credentials',
      credentials: {},
      authorize: async () => {
        // Return a guest user object
        return { id: 'guest', name: 'Guest User' }
      },
    },
  ],
  session: {
    strategy: 'jwt', // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // Session expiration time
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Connect to MongoDB and insert user data if not already present
        const db = await connectToDatabase()
        const usersCollection = db.collection('users')

        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ id: user.id })

        // Insert user if they do not already exist in the database
        if (!existingUser) {
          await usersCollection.insertOne(user)
        }

        // Save basic user info to the JWT token
        token.id = user.id // Store user ID in token
        token.name = user.name // Store user name in token
      }

      return token
    },
    async session({ session, token }) {
      // Attach the user ID and name to the session object for frontend access
      // @ts-expect-error: Assigning user email to session.email
      session.user.id = token.id // Assigning user ID from token to session
      // @ts-expect-error: Assigning user email to session.email
      session.user.name = token.name // Assigning user name from token to session
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
