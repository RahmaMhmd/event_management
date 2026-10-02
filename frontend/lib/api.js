const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const headers = {
    ...(options.headers || {}),
  };

  
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
// AUTH
export const registerUser = async (userData) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (userData) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// EVENTS
export const getEvents = async () => {
  return request("/events");
};

export const getEventById = async (id) => {
  return request(`/events/${id}`);
};

export const createEvent = async (eventData, token) => {
  return request("/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
};
// ADMIN EVENTS
export const getPendingEvents = async (token) => {
  return request("/events/admin/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const approveEvent = async (eventId, token) => {
  return request(`/events/admin/${eventId}/approve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const rejectEvent = async (eventId, token) => {
  return request(`/events/admin/${eventId}/reject`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateEvent = async (eventId, eventData, token) => {
  return request(`/events/${eventId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
};

export const deleteEvent = async (eventId, token) => {
  return request(`/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// REGISTRATIONS
export const registerForEvent = async (eventId, token) => {
  return request(`/registrations/${eventId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyRegistrations = async (token) => {
  return request("/registrations/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const cancelRegistration = async (eventId, token) => {
  return request(`/registrations/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ADMIN USERS
export const getUsers = async (token) => {
  return request("/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = async (userId, userData, token) => {
  return request(`/admin/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (userId, token) => {
  return request(`/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getCategories = async () => {
  return request("/categories");
};