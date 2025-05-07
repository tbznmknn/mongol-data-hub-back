const db = require("../utils/prismaClient");
const AppError = require("../utils/AppError");

exports.createCompany = async (companyData, imageUrl, userId) => {
  const {
    name,
    link,
    summary,
    email,
    address,
    phone,
    content,
    occupationTypeId,
    affiliationTypeId,
  } = companyData;

  // Check if a company with the same name already exists
  const existingCompany = await db.companies.findUnique({
    where: { name },
  });
  if (existingCompany) {
    throw new AppError("A company with this name already exists", 400);
  }

  try {
    const createdCompany = await db.companies.create({
      data: {
        name,
        link: link || null,
        summary,
        email,
        address,
        phone,
        content,
        occupationTypeId: Number(occupationTypeId),
        affiliationTypeId: Number(affiliationTypeId),
        createdBy: userId || null,
        picture: imageUrl, // Store only one image filename
      },
    });
    return createdCompany;
  } catch (error) {
    throw new AppError(error.message);
  }
};

exports.getCompanies = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 20;
  const skip = (page - 1) * limit;

  const searchQuery = queries.search || "";
  const sortField = queries.sortField || "createdAt";
  const sortOrder = queries.sortOrder || "desc";
  const categories = queries.categories
    ? queries.categories.split(".").map(Number)
    : null;
  const filters = {
    OR: searchQuery
      ? [
          { name: { contains: searchQuery } },
          { email: { contains: searchQuery } },
        ]
      : undefined,
  };
  if (categories) {
    filters.affiliationTypeId = {
      in: categories, // Filter rooms by room type IDs that match any of the categories
    };
  }
  try {
    const companies = await db.companies.findMany({
      skip,
      take: limit,
      select: {
        address: true,
        createdAt: true,
        updatedAt: true,
        link: true,
        id: true,
        name: true,
        picture: true,
        summary: true,
        email: true,
        phone: true,
        AffiliationType: {
          select: {
            name: true,
            id: true,
          },
        },
        OccupationType: {
          select: {
            name: true,
            id: true,
          },
        },
        updatedBy: true,
        createdBy: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      where: filters,
    });

    const total = await db.companies.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    return {
      companies,
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

exports.getCompanyDetail = async (companyId) => {
  const company = await db.companies.findUnique({
    where: { id: parseInt(companyId) },
    include: {
      AffiliationType: true,
      OccupationType: true,
    },
  });

  if (!company) throw new AppError("Company not found", 404);

  return company;
};

exports.updateCompany = async (companyId, companyDetails, imageUrl, userId) => {
  const company = await db.companies.findUnique({
    where: { id: parseInt(companyId) },
  });

  if (!company) throw new AppError("Company not found", 404);

  // Ensure the updated name is unique
  if (companyDetails.name && companyDetails.name !== company.name) {
    const existingCompany = await db.companies.findUnique({
      where: { name: companyDetails.name },
    });
    if (existingCompany) {
      throw new AppError("A company with this name already exists", 400);
    }
  }

  const updatedData = {
    ...companyDetails,
    updatedBy: userId,
    picture: imageUrl ? imageUrl : company.picture, // Only update picture if a new one is uploaded
    occupationTypeId: companyDetails.occupationTypeId
      ? parseInt(companyDetails.occupationTypeId)
      : undefined,
    affiliationTypeId: companyDetails.affiliationTypeId
      ? parseInt(companyDetails.affiliationTypeId)
      : undefined,
  };
  console.log(updatedData);

  const updatedCompany = await db.companies.update({
    where: { id: parseInt(companyId) },
    data: updatedData,
  });

  return updatedCompany;
};

exports.deleteCompany = async (companyId) => {
  const company = await db.companies.findUnique({
    where: { id: parseInt(companyId) },
  });

  if (!company) throw new AppError("Company not found", 404);

  const deletedCompany = await db.companies.delete({
    where: { id: parseInt(companyId) },
  });

  return deletedCompany;
};
exports.getOverview = async () => {};
exports.getOverviewAdmin = async () => {
  const members = await db.members.count();
  const companies = await db.companies.count();
  const users = await db.user.count();
  const posts = await db.posts.count();
  const postsCounts = await db.posts.groupBy({
    by: ["category"], // Group by GalleryType
    _count: {
      category: true, // Count the number of items for each GalleryType
    },
  });
  const latestUsers = await db.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      email: true,
      phone: true,
      createdAt: true,
      firstName: true,
      role: true,
    },
  });

  // Structure the gallery data for the graph
  const chartData = postsCounts.map((item) => {
    return {
      postType: item.category, // Gallery type
      posts: item._count.category, // Count of gallery items for that type
      fill: `var(--color-${item.category.toLowerCase()})`, // Set color based on gallery type
    };
  });
  return {
    counts: {
      members: members,
      companies: companies,
      users: users,
      posts,
    },
    pie: chartData,
    latestUsers,
  };
};
exports.getOccupationKeys = async () => {
  try {
    const keys = await db.occupationType.findMany({
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
exports.getAffiliationKeys = async () => {
  try {
    const keys = await db.affiliationType.findMany({
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
