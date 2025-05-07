const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");

exports.getUsers = async (userId, queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 10;
  const skip = (page - 1) * limit;
  const searchQuery = queries.search || ""; // Single search query for all columns
  const sortField = queries.sortField || "createdAt";
  const sortOrder = queries.sortOrder || "desc";
  const role = queries.role || "";
  const roles = queries.role ? queries.role.split(".") : [];
  const filters = {
    OR: [
      { email: { contains: searchQuery } },
      { phone: { contains: searchQuery } },
      { firstName: { contains: searchQuery } },
      { lastName: { contains: searchQuery } },
    ],
  };
  if (roles.length > 0) {
    filters.AND = { role: { in: roles } };
  }

  try {
    const users = await db.user.findMany({
      skip,
      take: limit,
      where: filters,
      orderBy: {
        [sortField]: sortOrder,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        modifiedAt: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });

    const total = await db.user.count({
      where: filters,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      users,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (errors) {
    throw new AppError(errors);
  }
};
exports.getUserDetail = async (userId) => {
  if (!userId) throw new AppError("Хэрэглэгчийн ID оруулна уу", 400);

  const existingUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  delete existingUser.password;
  return existingUser;
};
exports.editUserDetails = async (userId, userData) => {
  if (!userId) throw new AppError("Хэрэглэгийн ID оруулна уу", 400);
  const { firstName, lastName, username, password } = userData;

  const existingUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!existingUser) {
    throw new AppError("Хэрэглэгч олдсонгүй", 409);
  }
  const existingUsername = await db.user.findUnique({
    where: {
      username: username,
    },
  });
  if (existingUsername) {
    throw new AppError("Хэрэглэгчийн нэр аль хэдийн авсан байна", 400);
  }
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) throw new AppError("Буруу нууц үг", 401);
  const changedUser = await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      username: username || undefined,
    },
  });
  delete changedUser.password;
  return changedUser;
};

//OR HAILT
// exports.getUsers = async (req, res) => {
//   const page = parseInt(queries.page) || 1;
//   const limit = parseInt(queries.limit) || 10;
//   const skip = (page - 1) * limit;
//   // const search = queries.search || "";
//   const email = queries.email || "";
//   const phone = queries.phone_number || "";
//   const companyName = queries.company_name || "";
//   const useServerQuery = queries.useServer || "";

//   const useServer = useServerQuery == "true";

//   const sortField = queries.sortField || "createdAt";
//   const sortOrder = queries.sortOrder || "desc";
//   const filters = {
//     AND: [
//       companyName ? { company_name: { contains: companyName } } : {},
//       email ? { email: { contains: email } } : {},

//       phone ? { phone_number: { contains: phone } } : {},
//       useServerQuery ? { useServer: useServer } : {},
//       { hudaldan_avagch: null },
//       { role: "USER" },
//       { registeredBy: null },
//       // useServer ? { useServer: false } : {},
//     ],
//   };
//   try {
//     const users = await prisma.user.findMany({
//       skip,
//       take: limit,
//       // where: filters,

//       orderBy: {
//         [sortField]: sortOrder,
//       },
//       // include: {
//       //   hudaldan_avagch: {
//       //     select: { info_check: true },
//       //   },
//       // },
//       select: {
//         id: true,
//         email: true,
//         emailVerified: true,
//         role: true,
//         company_name: true,
//         phone_number: true,
//       },
//     });

//     const total = await prisma.user.count({
//       where: filters,
//     });

//     const totalPages = Math.ceil(total / limit);

//     res.status(200).json({
//       success: true,
//       data: users,
//       pagination: {
//         total,
//         totalPages,
//         currentPage: page,
//         limit,
//       },
//     });
//   } catch (errors) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
