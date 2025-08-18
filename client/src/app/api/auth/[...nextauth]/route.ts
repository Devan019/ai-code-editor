// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"

async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      })

    const response = await fetch(url, { method: "POST" })
    const refreshedTokens = await response.json()

    if (!response.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000, // new expiry from Google
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // reuse old one if not returned
    }
  } catch (error) {
    console.error("Error refreshing access token", error)
    return { ...token, error: "RefreshAccessTokenError" }
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive.file",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  secret : process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account } : { token: JWT; account: any }) {
      // First login → save tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = Date.now() + account.expires_at * 1000
        return token
      }

      // If token still valid → return as is
      if (Date.now() < (token.expiresAt as number)) {
        return token
      }

      // If expired → refresh it
      return await refreshAccessToken(token)
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user.id = token.sub
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    },
  },
  session: {
    maxAge: 7 * 24 * 60 * 60, // <-- 7 days session in NextAuth (cookies)
  },
})

export { handler as GET, handler as POST }
