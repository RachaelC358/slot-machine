import { v4 as uuidv4 } from 'uuid';

export function getOrCreateUserId(): string {
  let userId = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_id='))
    ?.split('=')[1];

  if (!userId) {
    userId = uuidv4();
    document.cookie = `user_id=${userId}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=None; Secure`;
  }

  setTimeout(() => {
    triggerUserRegistration(userId);
  }, 0);

  return userId;
}

function triggerUserRegistration(userId: string) {
  fetch("https://zfr5ajjmog.execute-api.us-east-1.amazonaws.com/start-user", {
    method: 'POST',
    credentials: 'include', // optional here if you drop cookies entirely
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
  })
    .then(res => res.json())
    .then(data => console.log("User registration:", data))
    .catch(err => console.error("Failed to register user:", err));
}


