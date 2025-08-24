// src/app/dashboard/[workspaceId]/layout.tsx (Corrected)

import React from 'react';
import { getNotifications } from "@/actions/user";
import { getWorkSpaces, verifyAccessToWorkspace } from "@/actions/workspace";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/global/sidebar";
import GlobalHeader from "@/components/global/global-header";

type Props = {
  params: { workspaceId: string };
  children: React.ReactNode;
};

const Layout = async ({ params, children }: { params: { workspaceId: string }, children: React.ReactNode }) => {
const { workspaceId } = await params;
  // params ko destructure karein
  // Check if the user has access to the requested workspace.
  // The clerkMiddleware already protects this route, so we know a user is logged in.
  const { status, data } = await verifyAccessToWorkspace(workspaceId);

  // If access is denied (e.g., wrong workspaceId in URL), redirect to the main dashboard page,
  // which will then find the user's correct workspace.
  if (status !== 200 || !data?.workspace) {
    return redirect("/dashboard");
  }

  const query = new QueryClient();

  // Prefetch data needed for the layout (sidebar and header).
  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkSpaces(),
  });

  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeader workspace={data.workspace} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;