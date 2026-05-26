import { redirect } from "next/navigation";

export default function RegisterLabRedirect() {
  redirect("/register?role=PATHOLOGIST");
}
