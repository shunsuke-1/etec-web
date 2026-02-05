import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  ArrowLeft,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { fetchAttemptDetail } from "../features/history/api";

type Props = {
  userId: string | null;
};

type ExplanationItem = {
  questionId: number;
  prompt: string;
  explanation: string | null;
  selectedChoiceLabel: string;
  correctChoiceLabel: string;
  isCorrect: boolean;
};

type AttemptDetail = {
  id: number;
  level: string;
  correct_count: number | null;
  total_questions: number;
  created_at: string;
  finished_at: string | null;
};

const levelLabels: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級", 
  advanced: "上級",
};

export default function ExplanationPage({ userId }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [items, setItems] = useState<ExplanationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const attemptId = searchParams.get("attemptId");
    
    if (!attemptId || !userId) {
      navigate("/");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const result = await fetchAttemptDetail({
          userId,
          attemptId: parseInt(attemptId),
        });
        
        setAttempt(result.attempt);
        setItems(result.items);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, userId, navigate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="解説を読み込み中..."
          showBackButton
          backTo="/"
        />
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">解説を読み込み中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="解説が見つかりません"
          showBackButton
          backTo="/"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "解説データが見つかりませんでした。"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const incorrectItems = items.filter(item => !item.isCorrect);
  const correctItems = items.filter(item => item.isCorrect);

  return (
    <div className="space-y-6">
      <PageHeader
        title="解説・復習"
        subtitle={`${levelLabels[attempt.level] || attempt.level}レベル - ${attempt.correct_count}/${attempt.total_questions}問正解`}
        showBackButton
        backTo={`/result?attemptId=${attempt.id}`}
      />

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            学習サマリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <div className="font-semibold text-destructive">{incorrectItems.length}問</div>
                <div className="text-sm text-muted-foreground">復習が必要</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <div className="font-semibold text-success">{correctItems.length}問</div>
                <div className="text-sm text-muted-foreground">正解済み</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incorrect Answers Section */}
      {incorrectItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <h2 className="text-xl font-semibold">間違えた問題の解説</h2>
            <Badge variant="destructive">{incorrectItems.length}問</Badge>
          </div>
          
          {incorrectItems.map((item, index) => (
            <Card key={item.questionId} className="border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  問題
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{item.prompt}</p>
                </div>

                {/* Your Answer */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">あなたの回答</h4>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm">{item.selectedChoiceLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">正解</h4>
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">{item.correctChoiceLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      解説
                    </h4>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Correct Answers Section (Collapsible) */}
      {correctItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <h2 className="text-xl font-semibold">正解した問題の解説</h2>
            <Badge variant="secondary">{correctItems.length}問</Badge>
          </div>
          
          {correctItems.map((item, index) => (
            <Card key={item.questionId} className="border-success/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-success text-success-foreground flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  問題
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{item.prompt}</p>
                </div>

                {/* Correct Answer */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">正解（あなたの回答）</h4>
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">{item.correctChoiceLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      解説
                    </h4>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => navigate(`/result?attemptId=${attempt.id}`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          結果に戻る
        </Button>
        
        <Button
          onClick={() => navigate(`/quiz?level=${attempt.level}`)}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          もう一度挑戦
        </Button>
      </div>
    </div>
  );
}