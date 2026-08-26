import { MainContainer } from "@/components/MainContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ContactFieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

export function ContactPageSkeleton() {
  return (
    <MainContainer className="items-center gap-8 sm:gap-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="items-center">
            <Skeleton className="h-8 w-56" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <ContactFieldSkeleton />
              <ContactFieldSkeleton />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainContainer>
  );
}
