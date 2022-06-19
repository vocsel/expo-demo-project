export enum ObjectType {
  TERRAIN,
  SKY,
  MESH
}

export enum ActionType {
  ADD_OBJECT,
  SET_SKY,
  SET_TERRAIN,
}

export enum Template {
  ISLAND,
  CINEMA,
  GALLERY
}

export type SceneObjectItem = {
  objectType: ObjectType;
  data: any;
}

export type SceneObjectSchema = {
  settings: Record<ObjectType, any>;
  objects: Record<string, SceneObjectItem>;
};

export const EmptySceneObject = {
  settings: {},
  objects: {},
};

export enum TerrainType {
  FLAT,
  NON_PLANAR
}

export type Terrain = {
  type: TerrainType;
  material?: any;
  bgColor?: string;
};

export type Sky = {
  color?: string;
  image?: string;
};
