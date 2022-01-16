export const paginationToKnex = (page: number, limit: number) => ({
  limit: Number(limit),
  start: Number((page - 1) * limit),
});
