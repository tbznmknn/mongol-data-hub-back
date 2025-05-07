const db = require("../utils/prismaClient");
const AppError = require("../utils/AppError");

exports.createAffiliationType = async (affiliationTypeData) => {
  const { name, description } = affiliationTypeData;

  const createdAffiliationType = await db.affiliationType.create({
    data: { name, description },
  });

  if (createdAffiliationType) return createdAffiliationType;
  throw new AppError("Affiliation Type could not be created!", 500);
};

exports.getAffiliationTypes = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 20;
  const skip = (page - 1) * limit;

  const searchQuery = queries.search || "";
  const sortField = queries.sortField || "createdAt";
  const sortOrder = queries.sortOrder || "desc";

  const filters = searchQuery
    ? {
        OR: [
          { name: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ],
      }
    : {};

  try {
    const affiliationTypes = await db.affiliationType.findMany({
      skip,
      take: limit,
      orderBy: {
        [sortField]: sortOrder,
      },
      where: filters,
    });

    const total = await db.affiliationType.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    return {
      affiliationTypes,
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

exports.getAffiliationTypeDetail = async (affiliationTypeId) => {
  const affiliationType = await db.affiliationType.findUnique({
    where: { id: parseInt(affiliationTypeId) },
  });

  if (!affiliationType) throw new AppError("Affiliation Type not found", 404);

  return affiliationType;
};

exports.updateAffiliationType = async (
  affiliationTypeId,
  affiliationTypeDetails
) => {
  const affiliationType = await db.affiliationType.findUnique({
    where: { id: parseInt(affiliationTypeId) },
  });

  if (!affiliationType) throw new AppError("Affiliation Type not found", 404);

  const updatedAffiliationType = await db.affiliationType.update({
    where: { id: parseInt(affiliationTypeId) },
    data: {
      name: affiliationTypeDetails.name,
      description: affiliationTypeDetails.description,
    },
  });

  return updatedAffiliationType;
};

exports.deleteAffiliationType = async (affiliationTypeId) => {
  const affiliationType = await db.affiliationType.findUnique({
    where: { id: parseInt(affiliationTypeId) },
  });

  if (!affiliationType) throw new AppError("Affiliation Type not found", 404);

  const deletedAffiliationType = await db.affiliationType.delete({
    where: { id: parseInt(affiliationTypeId) },
  });

  return deletedAffiliationType;
};
