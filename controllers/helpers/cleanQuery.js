module.exports = (query) => {
  if (query === undefined) return;
  if (query === "") return;

  const newQuery = query.trim().toLowerCase();

  if (newQuery !== "") return newQuery;
};
