const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { generateVerificationToken } = require("../utils/generateRandom");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
//* Testeer hereglegch uusgene. Email shalgahgui buh erhiin tuvshind ajillana
exports.createUser = async (userData) => {
  const { email, password, firstName, lastName } = userData;
  console.log("adkjfbhsdljk", email, password);
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new AppError("И-мэйл аль хэдийн авсан байна", 409);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email: email,
      firstName: firstName,
      lastName: lastName,
      hashedPassword,
    },
  });
  if (user) return user;
  throw new AppError(`Хэрэглэгч үүссэнгүй!`, 500);
};
//* Superadmin hereglegch uusgene. Tuvshin zaaj bolno
exports.createTestUser = async (userData) => {
  const { email, password, firstName, lastName, role } = userData;
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new AppError("И-мэйл аль хэдийн авсан байна", 409);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email: email,
      firstName: firstName,
      lastName: lastName,
      hashedPassword,
      role,
    },
  });
  if (user) return user;
  throw new AppError(`Хэрэглэгч үүссэнгүй!`, 500);
};
//* Hereglegch nevtrene. Token avna.
exports.loginWithCredentials = async (userData) => {
  console.log(userData);
  const { email, password } = userData;
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  console.log(existingUser);
  const passwordMatch = await bcrypt.compare(
    password,
    existingUser.hashedPassword
  );
  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        image: existingUser.image,
        email_verified: existingUser.emailVerified,
      },
      process.env.AUTH_SECRET,
      { expiresIn: "10day" }
    );
    existingUser.accessToken = token;
    delete existingUser.password;
    return existingUser;
  } else {
    throw new AppError("Нууц үг буруу байна", 401);
  }
};
//* Nevtersen hereglegch nuuts ug solino.
exports.changePassword = async (userId, userData) => {
  const existingUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  const passwordMatch = await bcrypt.compare(
    userData.oldPassword,
    existingUser.hashedPassword
  );
  console.log("match");
  if (passwordMatch) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        hashedPassword,
      },
    });
    return true;
  } else {
    throw new AppError("Буруу нууц үг", 401);
  }
};
//* Superadmin duriin hereglegchiin erhiin tuvshing solino. SU ooriinhoo erhiig solij bolohgui
exports.changeUserRole = async (userId, userData) => {
  const { email, role } = userData;
  if (!role || !email)
    throw new AppError("Хэрэглэгч эсвэл эрхийн түвшин оруулна уу", 400);

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }

  const user = await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      role: userData.role,
    },
  });
  delete user.password;
  return user;
};
//* Superadmin hereglegchiig ustgana
exports.deleteUser = async (userId, userData) => {
  const { email } = userData;
  if (!email) throw new AppError("Хэрэглэгч оруулна уу", 400);

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  if (existingUser.id === userId) {
    throw new AppError("Өөр өөрийгөө устгаж болохгүй", 401);
  }

  const user = await db.user.delete({
    where: {
      id: existingUser.id,
    },
  });
  return user;
};
//* Hereglegch ooroo burtgel uusgene. Ajillah draalal-> register()-> sendConfirmationLink() -> confirmToken() -> DONE(then login)
exports.register = async (userData) => {
  const user = await db.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (user) {
    if (user.emailVerified) {
      throw new AppError("It is already verified email", 400);
    } else {
      throw new AppError("It is unverified email", 400);
    }
  } else {
    const existingData = await db.dataBeforeVerification.findUnique({
      where: {
        email_action: {
          action: "newUser",
          email: userData.email,
        },
      },
    });
    if (existingData) {
      await db.dataBeforeVerification.delete({
        where: {
          email_action: {
            action: "newUser",
            email: userData.email,
          },
        },
      });
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const data = await db.dataBeforeVerification.create({
      data: {
        email: userData.email,
        action: "newUser",
        phone: userData.phone,
        firstName: userData.firstName,
        lastName: userData.lastName,
        hashedPassword: hashedPassword,
      },
    });
    if (data) {
      return data;
    } else {
      throw new AppError(`Бүртгэл амжилтгүй боллоо`, 500);
    }
  }
};
//* Baazdaa batalgaajiltiin token uusgene.
exports.sendConfirmationLink = async (userData) => {
  let { method, email, action } = userData;
  try {
    if (method === "email") {
      if (action === "newUser") {
        const user = await db.user.findFirst({
          where: {
            email: email,
          },
        });

        if (user) {
          if (user.emailVerified)
            throw new AppError("Баталгаажсан хэрэглэгч байна.", 400);
        }
        const token = generateVerificationToken();
        const preData = await db.dataBeforeVerification.findUnique({
          where: {
            email_action: {
              email,
              action,
            },
          },
        });
        if (!preData)
          throw new AppError("Бүртгэлийн формыг эхнээс нь хийнэ үү.", 400);
        const existingToken = await db.verificationToken.findFirst({
          where: {
            email: email,
            action: action,
          },
        });
        if (existingToken) {
          await db.verificationToken.delete({
            where: {
              email_token_action: {
                email: existingToken.email,
                token: existingToken.token,
                action: action,
              },
            },
          });
        }

        const verificationToken = await db.verificationToken.create({
          data: {
            email: email,
            token: token,
            expires: new Date(moment().add(2, "h").utc(8).format()),
            action: action,
          },
        });
        console.log(verificationToken);

        // const confirmationNumber = generateConfirmationNumber();
        const confirmationLink = `${process.env.FRONTEND_URL}/confirmtoken?token=${token}&action=newUser&email=${email}`;

        const message = `Hello, <br><br>
                        A registration confirmation request has been sent. <br><br>
                        Please confirm your registration using the following link: <br><br>
                        Confirmation Code: <b><a href="${confirmationLink}">Confirmation Link</a></b> <br><br>
                        If you did not send this request, please contact us immediately at 75551919. <br><br>
                        Have a great day!`;
        const sentEmail = await sendEmail({
          // email: user.email,
          email: email,
          from: "МХКХ бүртгэл баталгаажуулах хүсэлт",
          subject: "Баталгаажуулах",
          html: message,
        });
        return `${email} -руу баталгаажуулах хүсэлт илгээлээ.`;
      } else if (action === "resetPassword") {
        const user = await db.user.findFirst({
          where: {
            email: email,
          },
        });

        if (!user) throw new AppError("И-мэйл системд алга.", 400);

        const existingToken = await db.verificationToken.findFirst({
          where: {
            email: email,
            action: action,
          },
        });
        if (existingToken) {
          await db.verificationToken.delete({
            where: {
              email_token_action: {
                email: existingToken.email,
                token: existingToken.token,
                action: action,
              },
            },
          });
        }
        const token = generateVerificationToken();

        const verificationToken = await db.verificationToken.create({
          data: {
            email: email,
            token: token,
            expires: new Date(moment().add(2, "h").utc(8).format()),
            action: action,
          },
        });

        // const confirmationNumber = generateConfirmationNumber();
        const confirmationLink = `${process.env.FRONTEND_URL}/confirmtoken?token=${token}&action=resetPassword&email=${email}`;

        const message = `Сайн байна уу? <br><br>Нууц үг солих хүсэлт илгээлээ. <br>  <br><br> Баталгаажуулах дугаар: <b><a href="${confirmationLink}">Баталгаажуулах линк</a></b><br><br>Хэрэв та хүсэлт илгээгээгүй бол яаралтай 75551919 дугаарт холбогдон мэдэгдэнэ үү.<br><br>Өдрийг сайхан өнгөрүүлээрэй.`;

        const sentEmail = await sendEmail({
          // email: user.email,
          email: email,
          from: "МХКХ нууц үг солих хүсэлт",
          subject: "Баталгаажуулах",
          html: message,
        });

        return `${email} -руу баталгаажуулах хүсэлт илгээлээ.`;
      }
    } else {
      throw new AppError(`Input Invalidation error`, 400);
    }
  } catch (e) {
    throw new AppError(e);
    throw new AppError(`Something has gone wrong`, 500);
  }
};
//* Baazd bgaa batalgaajiltiin tokeng batlana. Herev amjilttai bol hereglegchiin burtgel& nuuts ug solilt(martsan) amjilttai
exports.confirmToken = async (userData) => {
  if (!userData.token && !userData.email && !userData.action)
    throw new AppError("Буруу линк байна.", 400);
  const reqToken = userData.token;
  if (userData.action === "newUser") {
    const token = await db.verificationToken.findUnique({
      where: {
        email_token_action: {
          token: userData.token,
          action: userData.action,
          email: userData.email,
        },
      },
    });
    console.log(token);

    if (!token) {
      throw new AppError("Баталгаажуулах линк буруу байна", 400);
    }
    const presentTime = new Date(moment().utc(8).format());

    const hasExpired = new Date(token.expires) < presentTime;

    if (hasExpired) {
      throw new AppError(
        "Баталгаажуулах линкний хугацаа дуусав. Шинээр баталгаажуулах линк авч баталгаажуулна уу",
        400
      );
    }
    const user = await db.user.findUnique({
      where: { email: userData.email },
    });
    if (user) {
      throw new AppError("Хэрэглэгч аль хэдийн үүссэн байна", 400);
    } else {
      const user = await db.dataBeforeVerification.findUnique({
        where: {
          email_action: {
            action: "newUser",
            email: userData.email,
          },
        },
      });
      if (!user) throw new AppError("Server error, no user data found");
      const newUser = await db.user.create({
        data: {
          email: user.email,
          hashedPassword: user.hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          role: "USER",
          phone: user.phone,
          emailVerified: presentTime,
        },
      });
      await db.dataBeforeVerification.delete({
        where: {
          email_action: {
            email: token.email,
            action: "newUser",
          },
        },
      });
      await db.verificationToken.delete({
        where: {
          email_token_action: {
            email: token.email,
            token: token.token,
            action: "newUser",
          },
        },
      });
      return `Бүртгэл амжилттай баталгаажлаа`;
    }
  } else if (userData.action === "resetPassword") {
    const token = await db.verificationToken.findUnique({
      where: {
        email_token_action: {
          token: userData.token,
          action: userData.action,
          email: userData.email,
        },
      },
    });
    if (!token) {
      throw new AppError("Баталгаажуулах линк буруу байна", 400);
    }
    const presentTime = new Date(moment().utc(8).format());
    const hasExpired = new Date(token.expires) < presentTime;
    if (hasExpired) {
      throw new AppError(
        "Баталгаажуулах линкний хугацаа дуусав. Шинээр баталгаажуулах линк авч баталгаажуулна уу",
        400
      );
    }

    const user = await db.user.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      throw new AppError("User does not exists", 400);
    } else {
      const existingUser = await db.dataBeforeVerification.findUnique({
        where: {
          email_action: {
            action: "resetPassword",
            email: userData.email,
          },
        },
      });
      if (!existingUser)
        throw new AppError("Server error, no user data found", 500);
      const updatedUser = await db.user.update({
        where: {
          email: existingUser.email,
        },
        data: {
          hashedPassword: existingUser.hashedPassword,
        },
      });

      await db.verificationToken.delete({
        where: {
          email_token_action: {
            email: token.email,
            token: token.token,
            action: userData.action,
          },
        },
      });
      await db.dataBeforeVerification.delete({
        where: {
          email_action: {
            action: "resetPassword",
            email: userData.email,
          },
        },
      });
      return `Нууц үг амжилттай солигдлоо`;
    }
  } else throw new AppError("Баталгаажуулах линк буруу байна", 400);
};
//* Systemd email burtgeltei esehiig shalgana. Used for registration, forgot password.
const checkEmailUnavailability = async (userData) => {
  const user = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (user) {
    console.log(user.oneTimePasswordToken);
    if (user.oneTimePasswordToken) {
      return res.status(401).json({ success: false, message: "OneTime" });
    }
    if (user.emailVerified) {
      res.status(200).json({
        success: true,
        message: "Batalgaajsan Email baina",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Batalgaajaagui mail baina",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Email alga.",
    });
  }
};
//* Hereglegch systemd nuuts ugee martsnaa sergeeh. Ajillah draalal-> forgotPassword() -> sendConfirmationLink() -> confirmToken() ->DONE
exports.forgotPassword = async (userData) => {
  const user = await db.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (user) {
    if (user.oneTimePasswordToken) throw new AppError("Access Denied", 401);
    const existingData = await db.dataBeforeVerification.findUnique({
      where: {
        email_action: {
          action: "resetPassword",
          email: userData.email,
        },
      },
    });
    if (existingData) {
      await db.dataBeforeVerification.delete({
        where: {
          email_action: {
            action: "resetPassword",
            email: userData.email,
          },
        },
      });
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const data = await db.dataBeforeVerification.create({
      data: {
        email: userData.email,
        action: "resetPassword",
        hashedPassword: hashedPassword,
      },
    });
    if (data) {
      return "Operation success. Please proceeed to next step";
    }
  } else {
    throw new AppError("Email not found", 400);
  }
};
