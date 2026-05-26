import { redirect } from "next/navigation";

export default function RegisterDoctorRedirect() {
  redirect("/register?role=DOCTOR");
}
