import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const authedFetch = async (path, options = {}) => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.error || message;
    } catch (_) {  // Response body is not JSON, keep the default error message.
}
    throw new Error(message);
  }

  return res.json();
};

/**
 * Deletes a resource via the backend, which also cleans up the Cloudinary file
 * using the server-only API secret. Falls back gracefully if the backend is
 * unreachable — caller should still remove the Firestore doc client-side as backup.
 */
export const deleteResourceViaBackend = (resourceId) =>
  authedFetch(`/api/resources/${resourceId}`, { method: 'DELETE' });

export const updateUserRoleViaBackend = (userId, role) =>
  authedFetch(`/api/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
