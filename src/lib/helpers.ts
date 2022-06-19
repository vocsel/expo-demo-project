import { AccessRights } from "./types/access-rights.enum";

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const deg = (d: number): number => (d * Math.PI) / 180;

export const hasAccessRights = (userAccessRights) => {
  const allAccessRightsList: string[] = Object.values(AccessRights);

  return allAccessRightsList.indexOf(userAccessRights) >= allAccessRightsList.indexOf("read_write");
};
