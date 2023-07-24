import { AccessRights } from "./types/access-rights.enum";

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const deg = (d: number): number => (d * Math.PI) / 180;

export const hasAccessRights = (userAccessRights) => {
  const allAccessRightsList: string[] = Object.values(AccessRights);

  return allAccessRightsList.indexOf(userAccessRights) >= allAccessRightsList.indexOf("read_write");
};

export const addToBasket = (itemId: string): void => {
  const emptyBasket = JSON.stringify({ items: [] });

  const basket = JSON.parse(window.localStorage.getItem("basket") || emptyBasket);

  basket.items.push(itemId);

  window.localStorage.setItem("basket", JSON.stringify(basket));
};
