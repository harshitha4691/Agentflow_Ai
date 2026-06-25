import "@/styles/globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  // Public-facing paths requiring zero secure checking validation loops
  const publicPaths = ["/login", "/register", "/"];
  const isPublicPath = publicPaths.includes(router.pathname);

  return (
    <>
      {isPublicPath ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </>
  );
}