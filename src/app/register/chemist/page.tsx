import { redirect } from "next/navigation";

export default function RegisterChemistRedirect() {
  redirect("/register?role=PHARMACY");
}
