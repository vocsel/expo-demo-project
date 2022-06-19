import { atom, useAtom } from "jotai";
import { Vocsel } from "vocsel-api";
import { IFile } from "vocsel-api/dist/types";

interface IRichFile {
  title: string;
  priceUSD: string;
  description?: string;
  file: IFile;
  node: any;
  mimetype: string;
}

export const Items = atom<null | IRichFile[]>();
export const VocselApi = atom<Vocsel | null>(null);
export const ActiveItem = atom<number>(0);
export const Mode = atom<"edit"|"preview">("edit");
export const IsInitialized = atom<boolean>(false);

export const useItems = () => useAtom(Items);
export const useVocselApi = () => useAtom(VocselApi);
export const useActiveItem = () => useAtom(ActiveItem);
export const useMode = () => useAtom(Mode);
export const useIsInitialized = () => useAtom(IsInitialized);
