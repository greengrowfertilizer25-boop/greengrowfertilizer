import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

export const RESOURCE_NAMES = [
  "products",
  "categories",
  "crops",
  "hero",
  "blogs",
  "dealers",
  "enquiries",
] as const;

export type ResourceName = (typeof RESOURCE_NAMES)[number];

export type SingletonResourceName = "d2c" | "contact-details" | "about-company";

export function isResourceName(value: string): value is ResourceName {
  return RESOURCE_NAMES.includes(value as ResourceName);
}

export function isSingletonResourceName(value: string): value is SingletonResourceName {
  return value === "d2c" || value === "contact-details" || value === "about-company";
}

export function collectionFor(resource: ResourceName) {
  return getDatabase().then((database) => database.collection(resource));
}

export function normalizeDocument<T extends Record<string, unknown>>(document: T) {
  const { _id, ...rest } = document;
  return {
    ...rest,
    id: typeof rest.id === "string" ? rest.id : String(_id ?? ""),
  };
}

export function idFilter(id: string) {
  if (ObjectId.isValid(id)) {
    return { $or: [{ id }, { _id: new ObjectId(id) }] };
  }
  return { id };
}

export function singletonDocumentId(resource: SingletonResourceName): string {
  return resource;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
