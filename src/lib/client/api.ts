export type ApiResource =
  | "products"
  | "categories"
  | "crops"
  | "hero"
  | "blogs"
  | "dealers"
  | "enquiries";

export type SettingsResource = "d2c" | "contact-details" | "about-company";

interface ApiEnvelope<T> {
  data: T;
}

function adminHeaders(extra?: HeadersInit): HeadersInit {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("adminApiToken") : null;
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function unwrap<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | { error?: string } | null;

  if (!response.ok) {
    const message = payload && "error" in payload ? payload.error : undefined;
    throw new Error(message || `API request failed with status ${response.status}.`);
  }

  return (payload as ApiEnvelope<T>).data;
}

export async function listResource<T>(resource: ApiResource): Promise<T[]> {
  return unwrap<T[]>(await fetch(`/api/${resource}`, { cache: "no-store" }));
}

export async function getResource<T>(resource: ApiResource, id: string): Promise<T> {
  return unwrap<T>(await fetch(`/api/${resource}/${encodeURIComponent(id)}`, { cache: "no-store" }));
}

export async function createResource<T extends object>(
  resource: ApiResource,
  data: T,
): Promise<T> {
  return unwrap<T>(
    await fetch(`/api/${resource}`, {
      method: "POST",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }),
  );
}

export async function updateResource<T extends object>(
  resource: ApiResource,
  id: string,
  data: T,
): Promise<T> {
  return unwrap<T>(
    await fetch(`/api/${resource}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }),
  );
}

export async function deleteResource(resource: ApiResource, id: string): Promise<void> {
  const response = await fetch(`/api/${resource}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });

  if (!response.ok) await unwrap<never>(response);
}

export async function getSettings<T>(resource: SettingsResource): Promise<T> {
  return unwrap<T>(await fetch(`/api/settings/${resource}`, { cache: "no-store" }));
}

export async function saveSettings<T extends object>(
  resource: SettingsResource,
  data: T,
): Promise<T> {
  return unwrap<T>(
    await fetch(`/api/settings/${resource}`, {
      method: "PUT",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }),
  );
}

export async function uploadMedia(file: File, folder?: string) {
  const formData = new FormData();
  formData.set("file", file);
  if (folder) formData.set("folder", folder);

  return unwrap<{ public_id: string; secure_url: string }>(
    await fetch("/api/media/upload", {
      method: "POST",
      headers: adminHeaders(),
      body: formData,
    }),
  );
}
