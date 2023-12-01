const advancedResults = (model, populate) => async (req, res, next) => {
  // Pipeline stages
  const pipeline = [];
  // Match stage - to filter based on query params
  const match = { ...req.query };
  // Remove fields from query
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((param) => delete match[param]);
  pipeline.push({ $match: match });

  // Projection stage - to select specific fields
  if (req.query.select) {
    const fields = req.query.select.split(' ');
    const projection = {};
    fields.forEach((field) => {
      projection[field] = 1;
    });
    pipeline.push({ $project: projection });
  }

  // Sort stage - to sort based on query params
  const sortCriteria = {};
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',');
    sortBy.forEach((criteria) => {
      const [field, order] = criteria.split(':');
      sortCriteria[field] = order === 'desc' ? -1 : 1;
    });
    pipeline.push({ $sort: sortCriteria });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } }); // Default sorting criteria
  }

  // Pagination stage - to paginate based on query params
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  pipeline.push({ $skip: startIndex });
  pipeline.push({ $limit: limit });

  if (populate) {
    pipeline.push(
      {
        $lookup:
          {
            from: populate.path,
            localField: '_id',
            foreignField: populate.field,
            as: populate.as,
          },
      },
    );
  }

  // Aggregate stage using the pipeline - to get total documents
  const results = await model.aggregate(pipeline);
  const total = await model.countDocuments(match);

  // Pagination results
  const pagination = {};
  const endIndex = startIndex + results.length;
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Setting the response data
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

export default advancedResults;
