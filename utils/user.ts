import { v4 as uuidv4 } from 'uuid';

export function getOrCreateUserId(): string {
  const match = document.cookie.match(/(^| )user_id=([^;]+)/);
  if (match) {
    // User already has a cookie; still trigger Lambda to ensure user is in DB
    triggerUserRegistration();
    return match[2];
  }

  const newId = uuidv4();
  document.cookie = `user_id=${newId}; path=/; max-age=${60 * 60 * 24 * 365}`;

  triggerUserRegistration(); // Call API to register the new user
  return newId;
}

function triggerUserRegistration() {
  fetch("https://zfr5ajjmog.execute-api.us-east-1.amazonaws.com/prod", {
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
