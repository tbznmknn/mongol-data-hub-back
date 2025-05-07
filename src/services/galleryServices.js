const db = require("../utils/prismaClient"); // Assuming you're using Prisma
const AppError = require("../utils/AppError");

// Create a new galleryItem with associated pictures
exports.createGalleryItem = async (galleryItemData, image) => {
  const date = galleryItemData.date ? new Date(galleryItemData.date) : null; // Default to now() if null
  console.log(date);

  const createdGalleryItem = await db.galleryItem.create({
    data: {
      url: image.url,
      altText: image.altText || "Gallery image",
      description: galleryItemData.description || null,
      description_en: galleryItemData.description_en || null,
      type: galleryItemData.type || "GENERAL",
      date: date ? date : null, // Ensure valid date
    },
  });

  return createdGalleryItem;
};

// Retrieve all galleryItems with filters, pagination, and sorting
exports.getGalleryItems = async (queries) => {
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 20;
  const skip = (page - 1) * limit;

  const filters = {};

  if (queries.GalleryItemId) {
    filters.id = parseInt(queries.GalleryItemId);
  }

  if (queries.categories) {
    const categories = queries.categories.split("."); // Split categories by dot
    filters.type = { in: categories }; // Prisma expects an array for filtering enum values
  }

  try {
    const galleryItems = await db.galleryItem.findMany({
      skip,
      take: limit,
      orderBy: {
        [queries.sortField || "createdAt"]: queries.sortOrder || "desc",
      },
      where: filters,
    });

    const total = await db.galleryItem.count({ where: filters });

    return {
      galleryItems,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    throw new AppError("Failed to fetch galleryItems", 500, error.message);
  }
};

// Retrieve galleryItem details by ID
exports.getGalleryItemDetails = async (galleryItemId) => {
  try {
    const galleryItem = await db.galleryItem.findUnique({
      where: { id: parseInt(galleryItemId) },
    });
    if (!galleryItem) throw new AppError("galleryItem not found", 404);
    return galleryItem;
  } catch (error) {
    throw new AppError(
      "Failed to fetch galleryItem details",
      500,
      error.message
    );
  }
};

// Update galleryItem details and optionally add new pictures
exports.updateGalleryItem = async (galleryItemId, galleryItemDetails) => {
  console.log(galleryItemDetails);
  try {
    const existingGalleryItem = await db.galleryItem.findUnique({
      where: { id: parseInt(galleryItemId) },
    });
    console.log(galleryItemDetails);
    if (!existingGalleryItem) throw new AppError("Gallery item not found", 404);

    const updatedGalleryItem = await db.galleryItem.update({
      where: { id: parseInt(galleryItemId) },
      data: {
        url: galleryItemDetails.url || existingGalleryItem.url,
        altText: galleryItemDetails.altText || existingGalleryItem.altText,
        description:
          galleryItemDetails.description || existingGalleryItem.description,
        description_en:
          galleryItemDetails.description_en ||
          existingGalleryItem.description_en,
        type: galleryItemDetails.type || existingGalleryItem.type,
        date: galleryItemDetails.date
          ? new Date(galleryItemDetails.date)
          : existingGalleryItem.date,
      },
    });

    return updatedGalleryItem;
  } catch (error) {
    console.error(error);
    throw new AppError("Failed to update gallery item", 500, error.message);
  }
};

// Change the main picture for a galleryItem
exports.changeMainPicture = async (galleryItemId, pictureId) => {
  // Verify the picture belongs to the specified galleryItem
  const picture = await db.galleryItemPicture.findUnique({
    where: { id: parseInt(pictureId) },
  });
  if (!picture || picture.galleryItemId !== parseInt(galleryItemId)) {
    throw new AppError(
      "Picture does not belong to the specified galleryItem",
      404
    );
  }
  try {
    // Reset all pictures' `isMain` for the galleryItem
    await db.galleryItemPicture.updateMany({
      where: { galleryItemId: parseInt(galleryItemId) },
      data: { isMain: false },
    });

    // Set the specified picture as the main picture
    const updatedPicture = await db.galleryItemPicture.update({
      where: { id: parseInt(pictureId) },
      data: { isMain: true },
    });

    return updatedPicture;
  } catch (error) {
    console.error(error);
    throw new AppError("Failed to change main picture", 500, error.message);
  }
};

// Delete selected pictures by their IDs
exports.deletePictures = async (pictureIds) => {
  try {
    console.log(pictureIds);
    const picturesToDelete = await db.galleryItem.findMany({
      where: { id: { in: pictureIds.map((id) => parseInt(id)) } },
    });
    console.log();

    if (picturesToDelete.length === 0) {
      throw new AppError("No pictures found for the given IDs", 400);
    }

    const deleted = await db.galleryItem.deleteMany({
      where: { id: { in: pictureIds.map((id) => parseInt(id)) } },
    });

    return deleted;
  } catch (error) {
    console.error(error);
    throw new AppError("Failed to delete pictures", 500, error.message);
  }
};

// Delete galleryItem by ID
exports.deleteGalleryItem = async (galleryItemId) => {
  const galleryItem = await db.galleryItem.findUnique({
    where: { id: parseInt(galleryItemId) },
  });
  if (!galleryItem) throw new AppError("galleryItem not found", 404);
  try {
    await db.galleryItem.delete({ where: { id: parseInt(galleryItemId) } });
    return { message: "galleryItem deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new AppError("Failed to delete galleryItem", 500, error.message);
  }
};
