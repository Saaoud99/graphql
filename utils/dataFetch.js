const DOMAIN_NAME = "https://learn.zone01oujda.ma";
const AUTH_URL = `${DOMAIN_NAME}/api/auth/signin`;
const GRAPHQL_URL = `${DOMAIN_NAME}/api/graphql-engine/v1/graphql`;

const Authenticate = async (username, password) => {
  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(username + ":" + password)}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

const GetData = async (token, query) => {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    return data;

  } catch (error) {
    return { error: error.message };
  }
}

const Authorized = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  return true;
}

export { Authenticate, GetData, Authorized };