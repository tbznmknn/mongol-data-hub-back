const db = require("../utils/prismaClient");
const AppError = require("../utils/AppError");

exports.createOccupationType = async (occupationTypeData) => {
  const { name } = occupationTypeData;

  const createdOccupationType = await db.occupationType.create({
    data: { name },
  });

  if (createdOccupationType) return createdOccupationType;
  throw new AppError("Occupation Type could not be created!", 500);
};

exports.getOccupationTypes = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 20;
  const skip = (page - 1) * limit;

  const searchQuery = queries.search || "";
  const sortField = queries.sortField || "createdAt";
  const sortOrder = queries.sortOrder || "desc";

  const filters = searchQuery ? { name: { contains: searchQuery } } : {};

  try {
    const occupationTypes = await db.occupationType.findMany({
      skip,
      take: limit,
      orderBy: {
        [sortField]: sortOrder,
      },
      where: filters,
    });

    const total = await db.occupationType.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    return {
      occupationTypes,
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

exports.getOccupationTypeDetail = async (occupationTypeId) => {
  const occupationType = await db.occupationType.findUnique({
    where: { id: parseInt(occupationTypeId) },
  });

  if (!occupationType) throw new AppError("Occupation Type not found", 404);

  return occupationType;
};

exports.updateOccupationType = async (
  occupationTypeId,
  occupationTypeDetails
) => {
  const occupationType = await db.occupationType.findUnique({
    where: { id: parseInt(occupationTypeId) },
  });

  if (!occupationType) throw new AppError("Occupation Type not found", 404);

  const updatedOccupationType = await db.occupationType.update({
    where: { id: parseInt(occupationTypeId) },
    data: { ...occupationTypeDetails },
  });

  return updatedOccupationType;
};

exports.deleteOccupationType = async (occupationTypeId) => {
  const occupationType = await db.occupationType.findUnique({
    where: { id: parseInt(occupationTypeId) },
  });

  if (!occupationType) throw new AppError("Occupation Type not found", 404);

  const deletedOccupationType = await db.occupationType.delete({
    where: { id: parseInt(occupationTypeId) },
  });

  return deletedOccupationType;
};
