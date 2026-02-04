import { useEffect, useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target,
  AlertCircle,
  User,
  BarChart3
} from "lucide-react";

type Props = {
  userId: string | null;
};

type AttemptHistory = {
  id: number;
  level: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: string;
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

const getScoreColor = (percentage: number) => {
  if (percentage >= 80) return "text-success";
  if (percentage >= 60) return "text-warning";
  return "text-destructive";
};

export default function HistoryPage({ userId }: Props) {
  const [history, setHistory] = useState<AttemptHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // TODO: Fetch actual history from API
    // For now, show mock data
    setTimeout(() => {
      setHistory([
        {
          id: 1,
          level: "beginner",
          score: 8,
          total: 10,
          percentage: 80,
          createdAt: "2024-02-04T10:30:00Z",
        },
        {
          id: 2,
          level: "intermediate",
          score: 6,
          total: 10,
          percentage: 60,
          createdAt: "2024-02-03T15:45:00Z",
        },
        {
          id: 3,
          level: "beginner",
          score: 9,
          total: 10,
          percentage: 90,
          createdAt: "2024-02-02T09:15:00Z",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [userId]);

  if (!userId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="学習履歴"
          subtitle="過去の試験結果を確認"
          showBackButton
          backTo="/"
        />
        
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            学習履歴を確認するにはログインが必要です。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="学習履歴"
          subtitle="過去の試験結果を確認"
          showBackButton
          backTo="/"
        />
        
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">履歴を読み込み中...</p>
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
          title="学習履歴"
          subtitle="過去の試験結果を確認"
          showBackButton
          backTo="/"
        />
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>エラー: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalAttempts = history.length;
  const averageScore = totalAttempts > 0 
    ? Math.round(history.reduce((sum, h) => sum + h.percentage, 0) / totalAttempts)
    : 0;
  const bestScore = totalAttempts > 0 
    ? Math.max(...history.map(h => h.percentage))
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="学習履歴"
        subtitle="過去の試験結果を確認"
        showBackButton
        backTo="/"
      />

      {history.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">履歴がありません</h3>
                <p className="text-muted-foreground">
                  まだ試験を受けていません。最初の試験を受けてみましょう。
                </p>
              </div>
              <Button onClick={() => window.location.href = "/"}>
                試験を受ける
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalAttempts}</div>
                    <div className="text-sm text-muted-foreground">総受験回数</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Target className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">{averageScore}%</div>
                    <div className="text-sm text-muted-foreground">平均正答率</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">{bestScore}%</div>
                    <div className="text-sm text-muted-foreground">最高得点</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                受験履歴
              </CardTitle>
              <CardDescription>
                過去の試験結果一覧
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={levelColors[attempt.level]}>
                          {levelLabels[attempt.level] || attempt.level}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(attempt.createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-semibold ${getScoreColor(attempt.percentage)}`}>
                          {attempt.score} / {attempt.total}
                        </div>
                        <div className={`text-sm ${getScoreColor(attempt.percentage)}`}>
                          {attempt.percentage}%
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        詳細
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
