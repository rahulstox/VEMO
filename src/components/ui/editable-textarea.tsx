// src/components/ui/editable-textarea.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Pencil, Check, X } from "lucide-react";
import Loader from "../global/loader";

interface EditableTextareaProps {
  initialValue: string;
  onSave: (value: string) => Promise<any>;
  isSaving: boolean;
}

export const EditableTextarea = ({
  initialValue,
  onSave,
  isSaving,
}: EditableTextareaProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue); // Sync with external changes
  }, [initialValue]);

  const handleSave = async () => {
    await onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[200px] bg-neutral-800 border-neutral-700"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={handleSave}>
            <Loader state={isSaving}>
              <Check className="h-4 w-4" />
            </Loader>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <p className="text-[#a7a7a7] whitespace-pre-wrap">
        {value || "No transcript available"}
      </p>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
};
