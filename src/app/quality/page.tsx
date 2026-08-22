import { Suspense } from "react";
import { QualityPageClient } from "@/components/quality/QualityPageClient";

export default function QualityPage() {
  return (
    <Suspense>
      <QualityPageClient />
    </Suspense>
  );
}
