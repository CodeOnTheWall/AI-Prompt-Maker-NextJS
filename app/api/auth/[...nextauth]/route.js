import NextAuth from "next-auth";
// https://localhost:3000 for authorized domains in GCP
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

// call NextAuth as a func and provide the options object
// The handler function is a serverless function, which means that it
// is only called when it is needed. This is a good thing because it means
// that the NextAuth server does not have to be constantly connected to the
// database.
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // functions
    // if want to customize what is on session review next-auth session callback docs
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    // this signIn will sign a JWT with the email, username, and image
    // as well as the secret key from .env
    // dont need to sign the jwt myself, as nextauth auto does this
    async signIn({ profile }) {
      try {
        await connectToDB();
        // check if a user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new user and save to db
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;

        // serverless - called a Lambda function, which opens up only when
        // its called, which will spin up and connect to server, which is great
        // so that it doesnt have to be constantly connected
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

// this handler func can be called as both GET and POST
// GET here is for the session, and POST here is for the login
// more info here: https://next-auth.js.org/configuration/initialization#route-handlers-app
export { handler as GET, handler as POST };
