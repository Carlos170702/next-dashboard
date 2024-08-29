"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.number().gt(0, {
    message: "Amount must be greater than 0.",
  }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select a status.",
  }),
  date: z.string(),
});

export type State = {
  error?: {
    costumerId?: string;
    amount?: string;
    status?: string;
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

//* Create function
export const createInvoice = async (
  preventState: State,
  formData: FormData
) => {
  const validateFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: Number(formData.get("amount")),
    status: formData.get("status"),
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
      message: "Validation Error: Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validateFields.data;

  const amountToCent = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountToCent}, ${status}, ${date})
    `;
  } catch {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices/");
};

//* Update function
export async function updateInvoice(
  id: string,
  preventState: State,
  formData: FormData
) {
  const validateFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: Number(formData.get("amount")),
    status: formData.get("status"),
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
      message: "Validation Error: Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validateFields.data;

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Invoice.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

//* Delete function
export const deleteInvoice = async (id: string) => {
  throw new Error("Not Implemented");

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Invoice.",
    };
  }
};
