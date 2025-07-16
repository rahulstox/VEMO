'use client'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import Loader from '../loader'
import FolderDuotone from '@/components/icons/folder-duotone'
import { useMutationData, useMutationDataState } from '@/hooks/useMutationData'
import { renameFolders } from '@/actions/workspace'
import { Input } from '@/components/ui/input'

type Props = {
  name: string
  id: string
  optimistic?: boolean
  count?: number
  existingFolderNames?: string[] // <- pass all folder names from parent
}

const Folder = ({ id, name, optimistic, count, existingFolderNames = [] }: Props) => {

  const inputRef = useRef<HTMLInputElement | null>(null) // reference to rename input
  const folderCardRef = useRef<HTMLDivElement | null>(null) // unused currently
  const pathName = usePathname() // get current path
  const router = useRouter() // for navigation
  const [onRename, setOnRename] = useState(false) // toggle rename mode

  const [showModal, setShowModal] = useState(false)
  const [pendingRename, setPendingRename] = useState('')

  const Rename = () => setOnRename(true) // start renaming
  const Renamed = () => setOnRename(false) // stop renaming 


  //optimistic
  // mutation hook to rename folder (optimistic update)
  const { mutate, isPending } = useMutationData(
    ['rename-folders'],
    (data: { name: string }) => renameFolders(id, data.name),
    'workspace-folders',
    Renamed
  )  
  // get latest optimistic values
  const { latestVariables } = useMutationDataState(['rename-folders'])

  // navigate to folder when clicked
  const handleFolderClick = () => {
    if (onRename) return // disable nav during rename
    router.push(`${pathName}/folder/${id}`)
  }


  // double-click to enter rename mode
  const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()
    e.preventDefault() // optional improvement
    Rename()
    //Rename functionality
  }

  // update folder name when input loses focus
 // ✅ MODIFIED: updateFolderName now checks for duplicate before calling mutate
 const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
  const newName = inputRef.current?.value.trim() || ''

  if (!newName) {
    Renamed()
    return
  }

  if (newName === name) {
    Renamed()
    return
  }

  if (existingFolderNames.includes(newName)) {
    // ✅ if duplicate name found, trigger confirmation modal
    setPendingRename(newName)
    setShowModal(true)
    return
  }

  mutate({ name: newName }) // no duplicate, just rename
}

 // ✅ NEW: if user confirms rename in modal
 const handleConfirmRename = () => {
  mutate({ name: pendingRename })
  setShowModal(false)
  setPendingRename('')
}

 // ✅ NEW: if user cancels rename in modal
 const handleCancelRename = () => {
  if (inputRef.current) inputRef.current.value = name
  Renamed()
  setShowModal(false)
  setPendingRename('')
}



return (
  <>
    <div
      onClick={handleFolderClick}
      ref={folderCardRef}
      className={cn(
        optimistic && 'opacity-60',
        'flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg border-[1px]'
      )}
    >
      <Loader state={isPending}>
        <div className="flex flex-col gap-[1px]">
          {onRename ? (
            <Input
              defaultValue={name}
              onBlur={updateFolderName} // ✅ now runs duplicate check
              autoFocus
              placeholder={name}
              className="border-none text-base w-full outline-none text-neutral-300 bg-transparent p-0"
              ref={inputRef}
            />
          ) : (
            <p
              onClick={(e) => e.stopPropagation()}
              className="text-neutral-300"
              onDoubleClick={handleNameDoubleClick}
            >
              {latestVariables &&
              latestVariables.status === 'pending' &&
              latestVariables.variables.id === id
                ? latestVariables.variables.name
                : name}
            </p>
          )}
          <span className="text-sm text-neutral-500">{count || 0} videos</span>
        </div>
      </Loader>
      <FolderDuotone />
    </div>

    {/* ✅ NEW: Confirmation Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-neutral-900 rounded-lg p-6 text-white w-[350px] space-y-4 shadow-xl">
          <h3 className="text-lg font-semibold">Duplicate Folder Name</h3>
          <p>A folder named <strong>"{pendingRename}"</strong> already exists. Do you want to replace it?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancelRename} // ✅ cancel rename
              className="px-4 py-2 bg-neutral-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRename} // ✅ confirm rename
              className="px-4 py-2 bg-red-600 rounded-md"
            >
              Replace
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)
}

export default Folder



// Double-click triggers rename.

// Input field shows and auto-focuses.

// Blur triggers rename.

// Uses optimistic UI (latestVariables).

// Disables navigation while renaming.

// Loader is shown during rename operation.

// Input styling and Tailwind usage is clean