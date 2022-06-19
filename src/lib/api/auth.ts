import api from ".";

export const signIn = async (accessToken: any, setProfile) => {
  localStorage.setItem("Authorization", accessToken);

  const profile = await api.get("my/profile");

  setProfile(profile);
};

export const signOut = setProfile => {
  localStorage.removeItem("Authorization");

  setProfile(null);
};
