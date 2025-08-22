import FormGenerator from '@/components/global/form-generator'
import Loader from '@/components/global/loader'
import { Button } from '@/components/ui/button'
import { useCreateWorkspace } from '@/hooks/useCreateWorkspace'
import React from 'react'
import Squishy3DButton from "@/components/ui/squishy-3d-button";
type Props = {}

const WorkspaceForm = (props: Props) => {
  const { errors, isPending, onFormSubmit, register } = useCreateWorkspace()
  return (
    <form onSubmit={onFormSubmit} className="flex flex-col gap-y-3">
      <FormGenerator
        register={register}
        name="name"
        placeholder={"Workspace Name"}
        label="Name"
        errors={errors}
        inputType="input"
        type="text"
      />
      <Squishy3DButton
        className="w-full mt-2 bg-white text-black"
        type="submit"
        disabled={isPending}
      >
        <Loader state={isPending}>Create Workspace</Loader>
      </Squishy3DButton>
    </form>
  );
}

export default WorkspaceForm