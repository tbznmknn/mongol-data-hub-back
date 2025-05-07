const db = require("../utils/prismaClient");
const AppError = require("../utils/AppError");

exports.createPost = async (post, imageUrl, userId) => {
  // Check if a post with the same name already exists
  const existingPost = await db.posts.findUnique({
    where: { name: post.name },
  });
  if (existingPost) {
    throw new AppError("A post with this name already exists", 400);
  }
  if (
    post.category === "VISIONS" ||
    post.category === "RULES" ||
    post.category === "MEMBERPOST"
  ) {
    const existingCategoryPost = await db.posts.findFirst({
      where: {
        category: post.category,
      },
    });

    if (existingCategoryPost) {
      throw new AppError(
        `A post with the category ${post.category} already exists`,
        400
      );
    }
  }
  try {
    const createdPost = await db.posts.create({
      data: {
        name: post.name,
        content: post.content,
        category: post.category,
        summary: post.summary,
        picture: imageUrl || null, // Store only one picture filename
        createdBy: userId,
      },
    });
    return createdPost;
  } catch (error) {
    throw new AppError(error.message);
  }
};
exports.getUniquePost = async (type) => {
  let whereCondition = {};

  if (type === "VISIONS") {
    whereCondition = { category: "VISIONS" };
  } else if (type === "RULES") {
    whereCondition = { category: "RULES" };
  } else if (type === "MEMBERPOST") {
    whereCondition = { category: "MEMBERPOST" };
  } else {
    throw new AppError("Type error. |VISIONS|RULES|MEMBERPOST", 400);
  }

  const post = await db.posts.findFirst({
    where: whereCondition,
    include: {
      creator: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
        },
      },
      editor: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  if (!post) throw new AppError("Post not found", 404);

  return post;
};
exports.getPosts = async (queries) => {
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
          { content: { contains: searchQuery } },
        ]
      : undefined,
  };
  if (queries.categories) {
    const categories = queries.categories.split("."); // Split categories by dot
    filters.category = { in: categories }; // Prisma expects an array for filtering enum values
  }
  try {
    const posts = await db.posts.findMany({
      skip,
      take: limit,
      orderBy: {
        [sortField]: sortOrder,
      },
      select: {
        category: true,
        createdAt: true,
        createdBy: true,
        id: true,
        name: true,
        picture: true,
        summary: true,
        updatedAt: true,
        updatedBy: true,
        creator: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
        editor: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },

      where: filters,
    });
    console.log(posts);
    const total = await db.posts.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    return {
      posts,
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

exports.getPostDetail = async (postId) => {
  const post = await db.posts.findUnique({
    where: { id: parseInt(postId) },
    include: {
      creator: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
        },
      },
      editor: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  if (!post) throw new AppError("Post not found", 404);

  return post;
};

exports.updatePost = async (postId, postDetails, imageUrl) => {
  // Check if the post exists
  const post = await db.posts.findUnique({
    where: { id: parseInt(postId) },
  });

  if (!post) throw new AppError("Post not found", 404);

  // Check if another post with the same name exists (excluding the current post)
  if (postDetails.name && postDetails.name !== post.name) {
    const existingPost = await db.posts.findUnique({
      where: { name: postDetails.name },
    });

    if (existingPost) {
      throw new AppError("A post with this name already exists", 400);
    }
  }

  // Prepare updated data
  const updatedData = {
    ...postDetails,
    picture: imageUrl ? imageUrl : post.picture, // Only update picture if a new one is uploaded
  };

  // Update the post in the database
  const updatedPost = await db.posts.update({
    where: { id: parseInt(postId) },
    data: updatedData,
  });

  return updatedPost;
};

exports.deletePost = async (postId) => {
  const post = await db.posts.findUnique({
    where: { id: parseInt(postId) },
  });

  if (!post) throw new AppError("Post not found", 404);
  if (
    post.category === "VISIONS" ||
    post.category === "RULES" ||
    post.category === "RULES"
  ) {
    throw new AppError(
      `A post with the category ${post.category} can not be deleted. You can only see/update the post`,
      401
    );
  }
  const deletedPost = await db.posts.delete({
    where: { id: parseInt(postId) },
  });

  return deletedPost;
};
