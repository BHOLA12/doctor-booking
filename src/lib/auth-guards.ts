import { ForbiddenError, UnauthorizedError } from "@/app/api/error-handler";

interface UserSession {
  userId: string;
  role: string;
  name: string;
}

/**
 * Asserts that the authenticated user is the owner of the resource or an admin.
 * Throws ForbiddenError if checks fail.
 */
export async function assertOwnership(
  session: UserSession | null | undefined,
  resourceOwnerId: string
) {
  if (!session) {
    throw new UnauthorizedError();
  }

  if (session.role === "ADMIN") {
    return;
  }

  if (session.userId !== resourceOwnerId) {
    throw new ForbiddenError("Access Denied: You do not own this resource");
  }
}

/**
 * Asserts that the user is a doctor or an admin.
 */
export function assertDoctorOrAdmin(session: UserSession | null | undefined) {
  if (!session) {
    throw new UnauthorizedError();
  }

  if (session.role !== "DOCTOR" && session.role !== "PATHOLOGIST" && session.role !== "ADMIN") {
    throw new ForbiddenError("Access Denied: Healthcare provider permissions required");
  }
}
