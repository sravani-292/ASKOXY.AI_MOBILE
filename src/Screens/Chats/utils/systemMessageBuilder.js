
import { apiMetadata } from '../api/apiMeta';

export function buildSystemMessage(userId) {
  const general = Object.entries(apiMetadata)
    .filter(([, meta]) => !meta.requiresAuth)
    .map(([key, meta]) => `- ${key}(): ${meta.description}`)
    .join('\n');

  const auth = Object.entries(apiMetadata)
    .filter(([, meta]) => meta.requiresAuth)
    .map(([key, meta]) => `- ${key}(): ${meta.description}`)
    .join('\n');

  return {
    role: 'system',
    content: userId
      ? `User is logged in (ID: ${userId}).\n\nYou can use these authenticated APIs:\n\n${auth}\n\nAlso available to everyone:\n${general}`
      : `User is not logged in.\n\nUse only public APIs:\n\n${general}`,
  };
}
