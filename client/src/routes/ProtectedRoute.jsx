import { Navigate, useLocation } from "react-router-dom";

// ============================================================
// IS TOKEN VALID
//
// A token existing in localStorage isn't enough — a stale or
// expired JWT would previously let the user sit on a protected
// page until the next API call happened to fail. This decodes
// the JWT payload (no signature verification is needed client
// side; the server always re-validates the signature) and
// checks the standard "exp" claim so an expired/malformed
// token is treated the same as "not logged in".
// ============================================================

const isTokenValid = (token) => {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  try {
    const payloadJson = atob(
      parts[1].replace(/-/g, "+").replace(/_/g, "/")
    );

    const payload = JSON.parse(payloadJson);

    // No "exp" claim means we can't verify expiry client-side;
    // let the server be the source of truth in that case.
    if (!payload?.exp) {
      return true;
    }

    const expiryMs = payload.exp * 1000;

    return Date.now() < expiryMs;
  } catch (error) {
    console.error("Failed to decode auth token:", error);
    return false;
  }
};

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    // Clear a stale/expired token so the app doesn't keep
    // treating the user as logged in elsewhere (e.g. Navbar).
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
