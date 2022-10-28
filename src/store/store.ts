import { atom, useAtom } from "jotai";
import { Vocsel } from "vocsel-api";
import { IFile } from "vocsel-api/dist/types";

interface IRichFile {
  title: string;
  priceUSD: string;
  description?: string;
  file: IFile;
  node: any;
}

export const Items = atom<IRichFile[]>([]);
export const VocselApi = atom<Vocsel | null>(null);
export const ActiveItem = atom<number>(0);
export const Mode = atom<"edit"|"preview">("edit");

export const useItems = () => useAtom(Items);
export const useVocselApi = () => useAtom(VocselApi);
export const useActiveItem = () => useAtom(ActiveItem);
export const useMode = () => useAtom(Mode);
