const db = require("../utils/prismaClient");
const AppError = require("../utils/AppError");

exports.createMemberType = async (memberTypeData) => {
  const { name, description } = memberTypeData;

  const createdMemberType = await db.memberType.create({
    data: {
      name,
      description,
    },
  });

  if (createdMemberType) return createdMemberType;
  throw new AppError("Member Type could not be created!", 500);
};

exports.getMemberTypes = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 20;
  const skip = (page - 1) * limit;

  const searchQuery = queries.search || "";
  const sortField = queries.sortField || "createdAt";
  const sortOrder = queries.sortOrder || "desc";

  const filters = {
    OR: searchQuery
      ? [
          { name: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ]
      : undefined,
  };

  try {
    const memberTypes = await db.memberType.findMany({
      skip,
      take: limit,
      orderBy: {
        [sortField]: sortOrder,
      },
      where: filters,
    });

    const total = await db.memberType.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    return {
      memberTypes,
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

exports.getMemberTypeDetail = async (memberTypeId) => {
  const memberType = await db.memberType.findUnique({
    where: { id: parseInt(memberTypeId) },
  });

  if (!memberType) throw new AppError("Member Type not found", 404);

  return memberType;
};

exports.updateMemberType = async (memberTypeId, memberTypeDetails) => {
  const memberType = await db.memberType.findUnique({
    where: { id: parseInt(memberTypeId) },
  });

  if (!memberType) throw new AppError("Member Type not found", 404);

  const updatedMemberType = await db.memberType.update({
    where: { id: parseInt(memberTypeId) },
    data: { ...memberTypeDetails },
  });

  return updatedMemberType;
};

exports.deleteMemberType = async (memberTypeId) => {
  const memberType = await db.memberType.findUnique({
    where: { id: parseInt(memberTypeId) },
  });

  if (!memberType) throw new AppError("Member Type not found", 404);

  const deletedMemberType = await db.memberType.delete({
    where: { id: parseInt(memberTypeId) },
  });

  return deletedMemberType;
};
