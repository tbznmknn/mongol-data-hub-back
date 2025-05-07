const db = require("../utils/prismaClient");
const AppError = require("../utils/AppError");

exports.createTimeline = async (timelineData) => {
  const { name, description, year } = timelineData;

  const existing = await db.timeline.findUnique({
    where: {
      year: year,
    },
  });
  if (existing) {
    throw new AppError(
      `Year ${year} already exists in the timeline. You can only update or delete the existing one`,
      400
    );
  }
  const createdTimeline = await db.timeline.create({
    data: { name, description, year },
  });

  if (createdTimeline) return createdTimeline;
  throw new AppError("Timeline could not be created!", 500);
};
exports.getTimelines = async (queries) => {
  if (queries.data === "get") {
    const data = await db.timeline.findMany({
      select: {
        id: true,
        name: true,
        year: true,
        description: true,
      },
    });
    console.log(data);
    return { timelines: data, undefined };
  }
  const page = parseInt(queries.page) || 1;
  const limit = parseInt(queries.limit) || 20;
  const skip = (page - 1) * limit;

  const searchQuery = queries.search || "";
  const sortField = queries.sortField || "year";
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
    const timelines = await db.timeline.findMany({
      skip,
      take: limit,
      orderBy: { [sortField]: sortOrder },
      where: filters,
    });

    const total = await db.timeline.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    return {
      timelines,
      pagination: { total, totalPages, currentPage: page, limit },
    };
  } catch (error) {
    throw new AppError(error.message);
  }
};

exports.getTimelineDetail = async (timelineId) => {
  const timeline = await db.timeline.findUnique({
    where: { id: parseInt(timelineId) },
  });
  if (!timeline) throw new AppError("Timeline not found", 404);
  return timeline;
};

exports.updateTimeline = async (timelineId, timelineDetails) => {
  const timeline = await db.timeline.findUnique({
    where: { id: parseInt(timelineId) },
  });
  if (!timeline) throw new AppError("Timeline not found", 404);
  return await db.timeline.update({
    where: { id: parseInt(timelineId) },
    data: { ...timelineDetails },
  });
};

exports.deleteTimeline = async (timelineId) => {
  const timeline = await db.timeline.findUnique({
    where: { id: parseInt(timelineId) },
  });
  if (!timeline) throw new AppError("Timeline not found", 404);
  return await db.timeline.delete({ where: { id: parseInt(timelineId) } });
};
