import { NextResponse } from "next/server";
import {
  handleApiError,
  isAdminRequest,
  jsonError,
  nowIso,
  parseJsonBody,
  requireAdmin,
} from "@/lib/server/api";
import { collectionFor, isResourceName, normalizeDocument } from "@/lib/server/resources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const { resource } = await params;
    if (!isResourceName(resource)) return jsonError("Unknown API resource.", 404);

    const url = new URL(request.url);
    const collection = await collectionFor(resource);
    const query = url.searchParams.get("q")?.trim();
    const status = url.searchParams.get("status")?.trim();
    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
        { emailAddress: { $regex: query, $options: "i" } },
      ];
    }

    const documents = await collection.find(filter).sort({ _createdAt: -1, id: 1 }).toArray();
    return NextResponse.json({ data: documents.map((document) => normalizeDocument(document)) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const { resource } = await params;
    if (!isResourceName(resource)) return jsonError("Unknown API resource.", 404);

    const isPublicSubmission = resource === "dealers" || resource === "enquiries";
    if (!isPublicSubmission) {
      const unauthorized = requireAdmin(request);
      if (unauthorized) return unauthorized;
    }

    const body = await parseJsonBody(request);
    
    if (resource === "enquiries") {
      const { fullName, mobileNumber, farmName, message } = body;
      if (!fullName || !mobileNumber || !farmName || !message) {
        return jsonError("Full Name, Mobile Number, Farm / Company Name, and Message are mandatory fields.", 400);
      }
    }

    const submittedAt = new Date();
    const publicDefaults = isPublicSubmission
      ? {
          status: "New",
          date: submittedAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata",
          }),
        }
      : {};
    const id = isPublicSubmission
      ? `${resource === "dealers" ? "DA" : "EN"}-${Date.now()}`
      : typeof body.id === "string" && body.id
        ? body.id
        : `${resource}-${Date.now()}`;
    const document = { ...body, ...publicDefaults, id, _createdAt: nowIso(), _updatedAt: nowIso() };
    const collection = await collectionFor(resource);
    await collection.insertOne(document);
    return NextResponse.json({ data: normalizeDocument(document) }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return jsonError("Request body must be valid JSON.");
    return handleApiError(error);
  }
}

export async function PUT() {
  return jsonError("Use the resource-specific ID endpoint for updates.", 405);
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return jsonError("Admin authentication is required.", 401);
  return jsonError("Use the resource-specific ID endpoint for deletes.", 405);
}
