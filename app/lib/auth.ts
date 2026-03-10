import { headers } from "next/headers";

export async function authorizeRequest(req: Request): Promise<boolean> {
	const reqHeaders = await headers();
	const authHeader = reqHeaders.get("authorization");

	if (!authHeader) {
		return false;
	}

	const expectedSecret = process.env.API_SECRET;
	if (!expectedSecret) {
		console.error("API_SECRET is not set in environment variables.");
		return false;
	}

	// Allow either plain secret or Bearer token for flexibility
	const token = authHeader.startsWith("Bearer ")
		? authHeader.slice(7)
		: authHeader;

	return token === expectedSecret;
}
