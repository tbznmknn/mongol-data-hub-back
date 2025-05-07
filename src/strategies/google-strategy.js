const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const bcrypt = require("bcrypt");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passwordGenerator = require("generate-password");
const jwt = require("jsonwebtoken");
const { createLogger } = require("winston");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("profile", profile);
        // console.log("profilejson", profile._json);
        // Check if user already exists based on email
        const existingUser = await db.user.findFirst({
          where: {
            email: profile._json.email,
          },
        });
        console.log("existingUser", existingUser);
        // If user doesn't exist, create a new one
        if (!existingUser) {
          // Generate a random password since the user won't be using it with Google login
          const password = passwordGenerator.generate({
            length: 14,
            numbers: true,
            lowercase: true,
            uppercase: true,
            symbols: true,
          });

          const hashedPassword = await bcrypt.hash(password, 10);

          // Create a new user in the database
          const newUser = await db.user.create({
            data: {
              email: profile._json.email,
              firstName: profile.name?.givenName || "Google",
              lastName: profile.name?.familyName || "User",
              image: profile._json.picture,
              emailVerified: true,
              username:
                profile.displayName.replace(/\s+/g, "").toLowerCase() +
                "-" +
                Date.now(), // Handle username safely
              password: hashedPassword, // Store a hashed password
              accounts: {
                create: {
                  providerType: "GOOGLE",
                  providerAccountId: profile._json.sub,
                },
              },
            },
          });

          // Generate JWT token for the new user
          const token = jwt.sign(
            {
              id: newUser.id,
              email: newUser.email,
              role: newUser.role,
              username: newUser.username,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              image: newUser.image,
              email_verified: newUser.emailVerified,
            },
            process.env.AUTH_SECRET,
            { expiresIn: "10d" }
          );

          newUser.accessToken = token;
          // console.log("created an user");
          return done(null, { user: newUser });
        }

        // User already exists, generate a new token for the existing user
        const token = jwt.sign(
          {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            username: existingUser.username,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            image: existingUser.image,
            email_verified: existingUser.emailVerified,
          },
          process.env.AUTH_SECRET,
          { expiresIn: "10d" }
        );
        existingUser.accessToken = token;

        return done(null, { user: existingUser });
      } catch (err) {
        console.error("Error during authentication:", err.message);
        return done(err);
      }
    }
  )
);
