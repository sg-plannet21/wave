export function paginate<T>(data: T[], currentPage: number, pageSize: number) {
  const startIndex = pageSize * (currentPage - 1);
  return data.slice(startIndex, startIndex + pageSize);
}
