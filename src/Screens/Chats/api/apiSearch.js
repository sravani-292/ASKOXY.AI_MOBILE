
import { apiMetadata } from './apiMeta';

export function searchApis(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return Object.entries(apiMetadata).filter(([key, meta]) =>
    key.toLowerCase().includes(lowerKeyword) || meta.description.toLowerCase().includes(lowerKeyword)
  );
}
