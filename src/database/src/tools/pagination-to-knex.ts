export const paginationToKnex = (page: number, limit: number) => ({
  limit: Number(limit),
  start: Number(Math.max(page - 1, 0) * limit),
});
