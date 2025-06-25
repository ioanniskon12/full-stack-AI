// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔵 Authorize called with:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          throw new Error("Invalid credentials");
        }

        try {
          await dbConnect();
          console.log("✅ Connected to DB for auth");

          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          }).select("+password");

          console.log("🔵 User found:", !!user);

          if (!user || !user.password) {
            console.log("❌ User not found");
            throw new Error("User not found");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("🔵 Password correct:", isPasswordCorrect);

          if (!isPasswordCorrect) {
            console.log("❌ Invalid password");
            throw new Error("Invalid password");
          }

          console.log("✅ User authenticated successfully");

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("❌ Auth error:", error);
          throw error;
        }
      },
    }),
    // Only include OAuth providers if environment variables are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("🔵 JWT callback - user:", user?.email);

      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        token.name = user.name;
        token.image = user.image;
      }

      // Handle OAuth sign in
      if (account?.provider && account.provider !== "credentials") {
        await dbConnect();

        try {
          let dbUser = await User.findOne({
            email: token.email?.toLowerCase(),
          });

          if (!dbUser) {
            // Generate a secure random password for OAuth users
            const randomPassword = await bcrypt.hash(
              Math.random().toString(36).slice(-8) + Date.now().toString(36),
              10
            );

            // Create user with all required fields
            dbUser = await User.create({
              email: token.email.toLowerCase(),
              name: token.name || token.email.split("@")[0], // Fallback name
              password: randomPassword, // Required field, but won't be used for OAuth
              image: token.picture || token.image,
              role: "user",
              emailVerified: true,
              lastLogin: new Date(),
            });

            console.log(`✅ Created OAuth user: ${dbUser.email}`);
          } else {
            // Update user info
            dbUser.name = token.name || dbUser.name;
            dbUser.image = token.picture || token.image || dbUser.image;
            dbUser.lastLogin = new Date();
            await dbUser.save();
            console.log(`✅ Updated OAuth user: ${dbUser.email}`);
          }

          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        } catch (error) {
          console.error("❌ OAuth user creation/update error:", error);
          // Don't throw - let the user sign in even if DB update fails
        }
      }

      return token;
    },
    async session({ session, token }) {
      console.log("🔵 Session callback - token:", token.email);

      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.image = token.image;
      }

      console.log("🔵 Session created:", session.user.email);
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug in development
};

export default NextAuth(authOptions);
