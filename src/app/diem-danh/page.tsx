import { Suspense } from "react";
import { AttendanceCanvas } from "@/components/pages/attendance";

export default function AttendancePage() {
  return (
    <Suspense>
      <AttendanceCanvas />
    </Suspense>
  );
}
