// src/hooks/useFolders.ts

import { useState, useEffect } from "react";
import { useMutationData } from "./useMutationData";
import {
  getWorkSpaces,
  getWorkspaceFolders,
  moveVideoLocation,
} from "@/actions/workspace";
import useZodForm from "./useZodForm";
import { moveVideoSchema } from "@/components/forms/change-video-location/schema";
import { useQueryData } from "./useQueryData";
import { WorkspaceProps } from "@/types/index.type"; // Types import karein

export const useMoveVideos = (videoId: string, currentWorkspace: string) => {
  // Step 1: Redux hooks ko hata dein.

  // Step 2: React Query se workspaces get karein
  const { data: workspaceData } = useQueryData(
    ["user-workspaces"],
    getWorkSpaces
  );
  const { data: workspaceInfo } = workspaceData as WorkspaceProps;
  const workspaces = workspaceInfo
    ? [
        ...workspaceInfo.workspace,
        ...workspaceInfo.members.map((m) => m.WorkSpace),
      ]
    : [];

  const [isFetching, setIsFetching] = useState(false);
  const [isFolders, setIsFolders] = useState<any[] | undefined>(undefined);

  const { mutate, isPending } = useMutationData(
    ["change-video-location"],
    (data: { folder_id: string; workspace_id: string }) =>
      moveVideoLocation(videoId, data.workspace_id, data.folder_id)
  );

  const { errors, onFormSubmit, watch, register } = useZodForm(
    moveVideoSchema,
    mutate,
    { folder_id: null, workspace_id: currentWorkspace }
  );

  const fetchFolders = async (workspace: string) => {
    setIsFetching(true);
    const foldersResponse = await getWorkspaceFolders(workspace);
    setIsFetching(false);
    setIsFolders(foldersResponse.data);
  };

  useEffect(() => {
    fetchFolders(currentWorkspace);
  }, []);

  useEffect(() => {
    const subscription = watch(async (value) => {
      if (value.workspace_id) fetchFolders(value.workspace_id);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders: isFolders || [], // Yahan "folders" ab local state se aayega
    workspaces, // Yeh React Query se aa raha hai
    isFetching,
    isFolders,
  };
};
// Note: Redux hooks ko hata diya gaya hai aur ab React Query ka istemal ho raha hai.
// "useFolders" hook ab Redux se independent hai aur sirf local state aur React Query ka istemal karta hai.
// Yeh approach zyada modular aur maintainable hai, kyunki Redux ka dependency nahi hai.