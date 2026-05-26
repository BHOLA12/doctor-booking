import { redirect } from "next/navigation";

export default function RegisterHospitalRedirect() {
  redirect("/register?role=HOSPITAL");
}
