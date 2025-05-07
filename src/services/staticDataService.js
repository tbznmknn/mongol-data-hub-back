// services/staticDataService.js
const db = require("../utils/prismaClient");
const AppError = require("../utils/AppError");

exports.createStaticData = async (data, imageUrl) => {
  try {
    const fields = [data.name, imageUrl, data.description].filter(Boolean);

    if (fields.length > 1) {
      throw new AppError(
        "Only one of 'name', 'picture', or 'description' can be provided.",
        400
      );
    }
    const createdData = await db.staticData.create({
      data: {
        purpose: data.purpose,
        title: data.title,
        name: data.name || null,
        description: data.description || null,
        picture: imageUrl || null,
      },
    });
    return createdData;
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

exports.getStaticData = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 10;
  const skip = (page - 1) * limit;
  const sortField = queries.sortField || "updatedAt";
  const sortOrder = queries.sortOrder || "desc";

  const searchQuery = queries.search || "";

  const filters = {
    OR: searchQuery
      ? [
          { title: { contains: searchQuery } },
          { purpose: { contains: searchQuery } },
        ]
      : undefined,
  };

  try {
    const staticData = await db.staticData.findMany({
      skip,
      take: limit,
      where: filters,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const total = await db.staticData.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    return {
      data: staticData,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};
exports.getStaticDataByTitle = async (id) => {
  console.log("first", id);
  const data = await db.staticData.findUnique({
    where: {
      title: id,
    },
    select: {
      name: true,
      title: true,
      description: true,
      picture: true,
    },
  });
  if (!data) {
    throw new AppError("Static Data missing from database");
  }
  return data;
};
exports.getStaticDataDetail = async (id) => {
  const staticData = await db.staticData.findUnique({
    where: { id: parseInt(id) },
  });
  if (!staticData) throw new AppError("Static data not found", 404);
  return staticData;
};

exports.updateStaticData = async (id, data, imageUrl) => {
  const staticData = await db.staticData.findUnique({
    where: { id: parseInt(id) },
  });
  if (!staticData) throw new AppError("Static data not found", 404);

  return await db.staticData.update({
    where: { id: parseInt(id) },
    data: {
      purpose: data.purpose || staticData.purpose,
      title: data.title || staticData.title,
      name: data.name || staticData.name,
      description: data.description || staticData.description,
      picture: imageUrl || staticData.picture,
    },
  });
};

exports.deleteStaticData = async (id) => {
  const staticData = await db.staticData.findUnique({
    where: { id: parseInt(id) },
  });
  if (!staticData) throw new AppError("Static data not found", 404);

  return await db.staticData.delete({ where: { id: parseInt(id) } });
};
