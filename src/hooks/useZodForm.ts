import { UseMutateFunction } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { z, ZodSchema } from "zod";

// CHANGE #1: Make the whole function generic with <T extends ZodSchema>
const useZodForm = <T extends ZodSchema>(
  // CHANGE #2: Use the generic type T for the schema
  schema: T,
  // CHANGE #3: Type the mutation's variables with the inferred schema shape
  mutation: UseMutateFunction<any, Error, z.infer<T>, unknown>,
  // CHANGE #4: Type the default values with the inferred schema shape
  defaultValues?: z.infer<T>
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
    // CHANGE #5: Pass the inferred shape to useForm
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onFormSubmit = handleSubmit(async (values) => mutation(values));

  return { register, watch, reset, onFormSubmit, errors };
};

export default useZodForm;
