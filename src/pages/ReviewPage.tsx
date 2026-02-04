import { PageHeader } from "../components/layout/PageHeader";
import { Alert, AlertDescription } from "../components/ui/alert";
import { User } from "lucide-react";
import ReviewQuiz from "../features/review/ReviewQuiz";

type Props = {
  userId: string | null;
};

export default function ReviewPage({ userId }: Props) {
  if (!userId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="間違い見直し"
          subtitle="最新の間違いを復習"
          showBackButton
          backTo="/"
        />
        
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            間違い見直し機能を利用するにはログインが必要です。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="間違い見直し"
        subtitle="最新の間違いを復習して理解を深めましょう"
        showBackButton
        backTo="/"
      />
      
      <ReviewQuiz userId={userId} />
    </div>
  );
}
