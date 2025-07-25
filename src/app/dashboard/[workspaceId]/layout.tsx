import React from 'react';
import { getNotifications, onAuthenticateUser } from "@/actions/user"; // Functions to fetch user-related data
import {
  getWorkSpaces,
  verifyAccessToWorkspace,
} from "@/actions/workspace"; // Functions to fetch workspace-related data
import { redirect } from "next/navigation"; // Function to handle page redirection
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"; // React Query for data fetching, caching, and SSR support
import Sidebar from "@/components/global/sidebar"; 
// Sidebar component for navigation
import GlobalHeader from "@/components/global/global-header"; // Header component for workspace navigation

// =====================
// Layout Component
// =====================

// This is a React Server Component that acts as a layout wrapper for the workspace dashboard.
// It ensures the following:
// 1. The user is authenticated.
// 2. The user has access to the requested workspace.
// 3. Preloads necessary data using React Query for better performance.
// 4. Sets up the page layout with a sidebar, a global header, and children content.

// We use TanStack Query (@tanstack/react-query) for efficient data fetching, caching, and SSR compatibility.

// Define the type for component props
type Props = {
  params: { workspaceId: string }; // Extract workspaceId from the route parameters
  children: React.ReactNode; // The child components that will be rendered inside the layout
};

const Layout = async ({ params: { workspaceId }, children }: Props) => {
 
 
 
    // =====================
  // User Authentication
  // =====================

  // Authenticate the user
  const auth = await onAuthenticateUser();

  // If the user is not authenticated or has no workspaces, redirect to the sign-in page
  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if (!auth.user.workspace.length) redirect("/auth/sign-in");

  // =====================
  // Workspace Access Control
  // =====================

  // Check if the user has access to the requested workspace
  const hasAccess = await verifyAccessToWorkspace(workspaceId);

  // If access is denied, redirect the user to their first available workspace
  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  // If workspace data is not available, return null (renders nothing)
  if (!hasAccess.data?.workspace) return null;







  // =====================
  // Data Fetching & Prefetching
  // =====================

  // Create a new instance of QueryClient to manage API queries
  const query = new QueryClient();

  // Prefetch the user's workspaces to improve performance
  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkSpaces(),
  });

  // Prefetch user notifications
  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });







  // =====================
  // Render Layout
  // =====================

  return (
    <HydrationBoundary state={dehydrate(query)}>
      {/* Hydrate preloaded data for React Query to ensure smooth client-side updates */}
      <div className="flex h-screen w-screen">
       
        {/* Full-screen layout */}
        <Sidebar activeWorkspaceId={workspaceId} />
        {/* Sidebar for workspace navigation */}
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeader workspace={hasAccess.data.workspace} />
          {/* Header displaying workspace details */}
          <div className="mt-4">{children}</div>
          {/* Render child components dynamically */}
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;
