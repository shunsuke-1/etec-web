import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { fetchAttemptDetail } from "../features/history/api";
import { Calendar, CheckCircle, XCircle, AlertCircle, User } from "lucide-react";

type Props = {
  userId: string | null;
};

const levelLabels: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

const levelColors: Record<string, "default" | "secondary" | "destructive"> = {
  beginner: "default",
  intermediate: "secondary",
  advanced: "destructive",
};

export default function HistoryDetailPage({ userId }: Props) {
  const { attemptId } = useParams();
  const parsedAttemptId = useMemo(() => Number(attemptId), [attemptId]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<{
    attempt: {
      id: number;
      level: string;
      correct_count: number | null;
      total_questions: number;
      created_at: string;
      finished_at: string | null;
    };
    items: {
      questionId: number;
      prompt: string;
      explanation: string | null;
      selectedChoiceLabel: string;
      correctChoiceLabel: string;
      isCorrect: boolean;
    }[];
  } | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    if (!Number.isFinite(parsedAttemptId)) {
      setError("履歴IDが不正です。");
      setLoading(false);
      return;
    }

    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAttemptDetail({
          userId,
          attemptId: parsedAttemptId,
        });
        if (!active) return;
        setDetail(res);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userId, parsedAttemptId]);

  if (!userId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="履歴詳細"
          subtitle="受験結果の詳細を確認"
          showBackButton
          backTo="/history"
        />
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>履歴の詳細を確認するにはログインが必要です。</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="履歴詳細"
          subtitle="受験結果の詳細を確認"
          showBackButton
          backTo="/history"
        />
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">詳細を読み込み中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="履歴詳細"
          subtitle="受験結果の詳細を確認"
          showBackButton
          backTo="/history"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>エラー: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="履歴詳細"
          subtitle="受験結果の詳細を確認"
          showBackButton
          backTo="/history"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>履歴が見つかりません。</AlertDescription>
        </Alert>
      </div>
    );
  }

  const score = detail.attempt.correct_count ?? 0;
  const total = detail.attempt.total_questions ?? 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="履歴詳細"
        subtitle="受験結果の詳細を確認"
        showBackButton
        backTo="/history"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            受験結果
          </CardTitle>
          <CardDescription>受験の概要</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant={levelColors[detail.attempt.level] ?? "default"}>
              {levelLabels[detail.attempt.level] ?? detail.attempt.level}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(detail.attempt.finished_at ?? detail.attempt.created_at).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="text-lg font-semibold">
            {score} / {total}（{percentage}%）
          </div>
        </CardContent>
      </Card>

      {detail.items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">詳細データがありません。</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {detail.items.map((item, index) => (
            <Card key={`${item.questionId}-${index}`}>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">問題 {index + 1}</CardTitle>
                  <Badge variant={item.isCorrect ? "default" : "destructive"} className="gap-1">
                    {item.isCorrect ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {item.isCorrect ? "正解" : "不正解"}
                  </Badge>
                </div>
                <CardDescription>{item.prompt}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">あなたの回答:</span>{" "}
                  <span>{item.selectedChoiceLabel}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">正解:</span>{" "}
                  <span>{item.correctChoiceLabel}</span>
                </div>
                {item.explanation && (
                  <div className="text-sm text-muted-foreground">{item.explanation}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
