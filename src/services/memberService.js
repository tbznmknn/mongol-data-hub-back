const db = require("../utils/prismaClient");
const AppError = require("../utils/AppError");

exports.createMember = async (memberData, imageUrl) => {
  const {
    name,
    memberTypeId,
    occupation,
    email,
    phone,
    content,
    hideMail,
    hidePhone,
  } = memberData;

  if (!occupation) {
    throw new AppError("Occupation is required", 400);
  }

  try {
    const createdMember = await db.members.create({
      data: {
        name,
        memberType: {
          connect: { id: parseInt(memberTypeId) }, // Ensure memberTypeId is an integer
        },
        occupation,
        picture: imageUrl || null, // Preserve existing picture if no new one is uploaded
        email,
        phone: phone || null,
        content: content || null,
        hideMail: hideMail === "true" || hideMail === true, // Convert string to boolean
        hidePhone: hidePhone === "true" || hidePhone === true, // Convert string to boolean
      },
    });

    return createdMember;
  } catch (error) {
    throw new AppError(error.message);
  }
};

exports.getMembers = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 20;
  const skip = (page - 1) * limit;
  const categories = queries.categories
    ? queries.categories.split(".").map(Number)
    : null;
  const searchQuery = queries.search || "";
  const sortField = queries.sortField || "createdAt";
  const sortOrder = queries.sortOrder || "desc";
  const customSort = queries.customSort === "true"; // Enable 3-row limit

  const filters = {
    OR: searchQuery
      ? [
          { name: { contains: searchQuery } },
          { email: { contains: searchQuery } },
          { phone: { contains: searchQuery } },
        ]
      : undefined,
  };
  if (categories) {
    filters.memberTypeId = {
      in: categories,
    };
  }

  try {
    let members = await db.members.findMany({
      skip,
      take: limit,
      where: filters,
      orderBy: { [sortField]: sortOrder }, // Default sorting
      select: {
        id: true,
        name: true,
        memberTypeId: true,
        occupation: true,
        picture: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        hideMail: true,
        hidePhone: true,
        memberType: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Always apply priority sorting
    const priorityOrder = ["Захирал", "Судлаач"];
    members = members.sort((a, b) => {
      const indexA = priorityOrder.indexOf(a.memberType.name);
      const indexB = priorityOrder.indexOf(b.memberType.name);

      if (indexA === -1 && indexB === -1) return 0; // Keep original order for others
      if (indexA === -1) return 1; // Move other members to the bottom
      if (indexB === -1) return -1; // Move priority members up
      return indexA - indexB; // Sort based on priority order
    });

    // If customSort is enabled, take only 3 rows
    if (customSort) {
      members = members.slice(0, 3);
    }

    const total = await db.members.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    return {
      members,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    throw new AppError(error.message);
  }
};

exports.getMemberDetail = async (memberId) => {
  const member = await db.members.findUnique({
    where: { id: parseInt(memberId) },
    include: {
      memberType: true, // To fetch related MemberType data
    },
  });

  if (!member) throw new AppError("Member not found", 404);

  return member;
};

exports.updateMember = async (memberId, memberDetails) => {
  const member = await db.members.findUnique({
    where: { id: parseInt(memberId) },
  });

  if (!member) throw new AppError("Member not found", 404);

  const { picture, memberTypeId, hideMail, hidePhone, ...restDetails } =
    memberDetails;

  // Convert memberTypeId to number
  const updatedDetails = {
    ...restDetails,
    memberTypeId: memberTypeId ? parseInt(memberTypeId) : undefined, // Convert memberTypeId to number
    hideMail: hideMail === "true", // Convert string "true"/"false" to boolean
    hidePhone: hidePhone === "true", // Convert string "true"/"false" to boolean
    ...(picture !== undefined && picture !== null ? { picture } : {}),
  };

  const updatedMember = await db.members.update({
    where: { id: parseInt(memberId) },
    data: updatedDetails,
  });

  return updatedMember;
};

exports.deleteMember = async (memberId) => {
  const member = await db.members.findUnique({
    where: { id: parseInt(memberId) },
  });

  if (!member) throw new AppError("Member not found", 404);

  const deletedMember = await db.members.delete({
    where: { id: parseInt(memberId) },
  });

  return deletedMember;
};
exports.getMemberKeys = async () => {
  try {
    const keys = await db.memberType.findMany({
      orderBy: {
        ["name"]: "desc",
      },
      select: { id: true, name: true },
    });

    // Add isReserved flag based on active reservations

    return keys;
  } catch (error) {
    throw new AppError("Failed to fetch rooms", 500, error.message);
  }
};
