import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import { fetchAttemptDetail } from "../features/history/api";
import { 
  Trophy, 
  Target, 
  RotateCcw, 
  Home, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  BookOpen
} from "lucide-react";

type Props = {
  userId: string | null;
};

type QuizResult = {
  score: number;
  total: number;
  percentage: number;
  level: string;
  attemptId?: number;
};

const levelLabels: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

const getScoreColor = (percentage: number) => {
  if (percentage >= 80) return "text-success";
  if (percentage >= 60) return "text-warning";
  return "text-destructive";
};

const getScoreBadge = (percentage: number) => {
  if (percentage >= 90) return { variant: "default" as const, label: "優秀" };
  if (percentage >= 80) return { variant: "secondary" as const, label: "良好" };
  if (percentage >= 60) return { variant: "outline" as const, label: "合格" };
  return { variant: "destructive" as const, label: "要復習" };
};

export default function ResultPage({ userId }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get result data from URL params or attempt ID
    const attemptId = searchParams.get("attemptId");
    const score = searchParams.get("score");
    const total = searchParams.get("total");
    const level = searchParams.get("level");

    if (attemptId && userId) {
      (async () => {
        try {
          setLoading(true);
          const detail = await fetchAttemptDetail({
            userId,
            attemptId: parseInt(attemptId),
          });
          const scoreNum = detail.attempt.correct_count ?? 0;
          const totalNum = detail.attempt.total_questions ?? 0;
          const percentage =
            totalNum > 0 ? Math.round((scoreNum / totalNum) * 100) : 0;

          setResult({
            score: scoreNum,
            total: totalNum,
            percentage,
            level: detail.attempt.level,
            attemptId: parseInt(attemptId),
          });
        } catch (e) {
          setResult(null);
        } finally {
          setLoading(false);
        }
      })();
    } else if (score && total && level) {
      // Use URL params for non-logged in users
      const scoreNum = parseInt(score);
      const totalNum = parseInt(total);
      const percentage = Math.round((scoreNum / totalNum) * 100);
      
      setResult({
        score: scoreNum,
        total: totalNum,
        percentage,
        level,
      });
      setLoading(false);
    } else {
      // No valid data, redirect to home
      navigate("/");
    }
  }, [searchParams, userId, navigate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="結果を読み込み中..."
          showBackButton
          backTo="/"
        />
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">結果を処理中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="結果が見つかりません"
          showBackButton
          backTo="/"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            結果データが見つかりませんでした。もう一度試験を受けてください。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const scoreBadge = getScoreBadge(result.percentage);

  return (
    <div className="space-y-6">
      <PageHeader
        title="試験結果"
        subtitle={`${levelLabels[result.level] || result.level}レベル`}
        showBackButton
        backTo="/"
      />

      {/* Main Result Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">お疲れさまでした！</CardTitle>
          <CardDescription>
            試験が完了しました。結果をご確認ください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}>
                {result.score} / {result.total}
              </div>
              <div className={`text-2xl font-semibold ${getScoreColor(result.percentage)}`}>
                {result.percentage}%
              </div>
              <Badge variant={scoreBadge.variant} className="text-sm px-3 py-1">
                {scoreBadge.label}
              </Badge>
            </div>
            
            <Progress value={result.percentage} className="h-3 max-w-md mx-auto" />
          </div>

          {/* Performance Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
              <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
              <div className="text-lg font-semibold text-success">{result.score}</div>
              <div className="text-sm text-muted-foreground">正解数</div>
            </div>
            
            <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <XCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
              <div className="text-lg font-semibold text-destructive">{result.total - result.score}</div>
              <div className="text-sm text-muted-foreground">不正解数</div>
            </div>
            
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-semibold text-primary">{result.percentage}%</div>
              <div className="text-sm text-muted-foreground">正答率</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            学習アドバイス
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.percentage >= 90 ? (
            <div className="space-y-2">
              <p className="text-success font-medium">素晴らしい成績です！</p>
              <p className="text-sm text-muted-foreground">
                この調子で上級レベルにも挑戦してみましょう。継続的な学習で更なるスキルアップを目指せます。
              </p>
            </div>
          ) : result.percentage >= 80 ? (
            <div className="space-y-2">
              <p className="text-primary font-medium">良好な成績です！</p>
              <p className="text-sm text-muted-foreground">
                基本的な理解はできています。間違えた問題を復習して、さらに理解を深めましょう。
              </p>
            </div>
          ) : result.percentage >= 60 ? (
            <div className="space-y-2">
              <p className="text-warning font-medium">合格ラインです。</p>
              <p className="text-sm text-muted-foreground">
                基礎は身についていますが、まだ改善の余地があります。復習を重ねて確実な知識を身につけましょう。
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-destructive font-medium">復習が必要です。</p>
              <p className="text-sm text-muted-foreground">
                基礎から見直しましょう。間違えた問題を中心に復習し、理解を深めることが重要です。
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          ホームに戻る
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate(`/quiz?level=${result.level}`)}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          もう一度挑戦
        </Button>
        
        {userId && result.attemptId && (
          <Button
            variant="outline"
            onClick={() => navigate("/review")}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            間違いを復習
          </Button>
        )}
      </div>

      {/* Login Prompt for Non-logged Users */}
      {!userId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ログインすると結果が保存され、間違えた問題の復習機能が利用できます。
          </AlertDescription>
        </Alert>
      )}

      {/* Debug Info */}
      {/* {process.env.NODE_ENV === 'development' && result.attemptId && (
        <div className="text-xs text-muted-foreground text-center">
          attemptId: {result.attemptId}
        </div>
      )} */}
    </div>
  );
}
