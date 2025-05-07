const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const bcrypt = require("bcrypt");
var FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const passwordGenerator = require("generate-password");
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("first");
      // console.log("profile", profile);
      // console.log("parsing", profile.displayName);
      try {
        const existingUser = await db.user.findFirst({
          where: {
            email: profile._json.email,
          },
        });
        console.log("existingUser", existingUser);
        if (!existingUser) {
          const password = passwordGenerator.generate({
            length: 14,
            numbers: true,
            lowercase: true,
            uppercase: true,
            symbols: true,
          });

          const hashedPassword = await bcrypt.hash(password, 10);
          await db.user.create({
            data: {
              email: profile._json.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              username: userData.username,
              password: hashedPassword,
            },
          });
        }
        return done(null, { existingUser });
      } catch (err) {
        console.log("err", err.message);
        done(err);
      }
    }
  )
);
