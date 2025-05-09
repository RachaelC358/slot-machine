import { v4 as uuidv4 } from 'uuid';

export function getOrCreateUserId(): string {
  const newId = uuidv4();
  document.cookie = `user_id=${newId}; path=/; max-age=${60 * 60 * 24 * 365}`;

  // Wait until the cookie is set before triggering registration
  setTimeout(() => {
    triggerUserRegistration();
  }, 0);

  return newId;
}


function triggerUserRegistration() {
  fetch("https://zfr5ajjmog.execute-api.us-east-1.amazonaws.com", {
    method: 'POST', // or 'GET'
    credentials: 'include', // send cookies
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => console.log("User registration:", data))
    .catch((err) => console.error("Failed to register user:", err));
}
