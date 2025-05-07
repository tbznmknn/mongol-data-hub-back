// schemas/userSchema.js
const { z } = require("zod");

// Define Zod schema for user registration
exports.loginSchema = z.object({
  body: z.object({
    // username: z.string(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Enter password"),
  }),
  // query: z.object({
  //   role: z.string().optional(),
  // }),
  // params: z.object({
  //   userId: z.string().uuid("Invalid user ID"),
  // }),
});
exports.createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "Enter First Name"),
    lastName: z.string().min(1, "Enter last name"),
    password: z
      .string()
      .min(8, { message: "Нууц үг дор хаяж 8 тэмдэгтийн урттай байна" })
      .max(100, { message: "Нууц үг 100 тэмдэгтээс их байж болохгүй" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      }) // Lowercase letter
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      }) // Uppercase letter
      .regex(/\d/, { message: "Password must contain at least one number" }) // Number
      .regex(/[@$!%*;?&#]/, {
        message: "Password must contain at least one special character",
      }), // Special character
  }),
});
exports.changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z
      .string()
      .min(8, { message: "Нууц үг дор хаяж 8 тэмдэгтийн урттай байна" }),
    password: z
      .string()
      .min(8, { message: "Нууц үг дор хаяж 8 тэмдэгтийн урттай байна" })
      .max(100, { message: "Нууц үг 100 тэмдэгтээс их байж болохгүй" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      }) // Lowercase letter
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      }) // Uppercase letter
      .regex(/\d/, { message: "Password must contain at least one number" }) // Number
      .regex(/[@$!%*;?&#]/, {
        message: "Password must contain at least one special character",
      }), // Special character
  }),
});
// exports.editUserDetailsSchema = z.object({
//   body: z.object({
//     firstName: z.string(),
//     lastName: z.string(),
//     username: z.string(),
//     password: z
//       .string()
//       .min(8, { message: "Нууц үг дор хаяж 8 тэмдэгтийн урттай байна" }),
//   }),
// });
