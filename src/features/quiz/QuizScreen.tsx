import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Question, QuestionLevel } from "../../types/quiz";
import { fetchQuestionsByLevel } from "./api";
import { createAttempt, finishAttempt, insertAnswer } from "../history/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, XCircle, ArrowRight, Trophy, AlertCircle, User } from "lucide-react";
// import { useToast } from "../../hooks/use-toast";

type Props = {
  level: QuestionLevel;
  userId: string | null;
};

type AnswerState = {
  selectedChoiceId: number | null;
  isCorrect: boolean | null;
};

export default function QuizScreen({ level, userId }: Props) {
  const navigate = useNavigate();
  // const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<AnswerState>({
    selectedChoiceId: null,
    isCorrect: null,
  });
  const [results, setResults] = useState<
    { questionId: number; selectedChoiceId: number; isCorrect: boolean }[]
  >([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setIndex(0);
      setAnswer({ selectedChoiceId: null, isCorrect: null });
      setResults([]);
      setAttemptId(null);

      try {
        const qs = await fetchQuestionsByLevel(level);
        console.log('Questions loaded:', {
          level,
          questionCount: qs.length,
          questions: qs.map(q => ({ id: q.id, prompt: q.prompt.substring(0, 50) + '...' }))
        });
        setQuestions(qs);

        if (userId && qs.length > 0) {
          const newAttemptId = await createAttempt({
            userId,
            level,
            totalQuestions: qs.length,
          });
          setAttemptId(newAttemptId);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [level, userId]);

  const current = questions[index];
  const score = useMemo(() => results.filter((r) => r.isCorrect).length, [results]);
  const progress = ((index + (answer.selectedChoiceId ? 1 : 0)) / questions.length) * 100;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">問題を読み込み中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>エラー: {error}</AlertDescription>
      </Alert>
    );
  }

  if (!current) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>このレベルの問題がありません。</AlertDescription>
      </Alert>
    );
  }

  const isAnswered = answer.selectedChoiceId !== null;
  const isLast = index === questions.length - 1;
  const savingEnabled = !!(userId && attemptId);

  const onSelect = async (choiceId: number) => {
    if (isAnswered) return;

    const picked = current.choices.find((c) => c.id === choiceId);
    if (!picked) return;

    const isCorrect = picked.is_correct;

    setAnswer({ selectedChoiceId: choiceId, isCorrect });
    
    const newResult = { questionId: current.id, selectedChoiceId: choiceId, isCorrect };
    setResults((prev) => {
      // Check if this question already has a result to prevent duplicates
      const existingIndex = prev.findIndex(r => r.questionId === current.id);
      let updated;
      if (existingIndex >= 0) {
        // Replace existing result for this question
        updated = [...prev];
        updated[existingIndex] = newResult;
      } else {
        // Add new result
        updated = [...prev, newResult];
      }
      
      console.log('Answer selected:', {
        questionId: current.id,
        choiceId,
        isCorrect,
        previousResults: prev.length,
        newResultsCount: updated.length,
        wasReplacement: existingIndex >= 0
      });
      return updated;
    });

    if (savingEnabled) {
      try {
        await insertAnswer({
          userId: userId!,
          attemptId: attemptId!,
          questionId: current.id,
          choiceId,
          isCorrect,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }
  };

  const onNext = () => {
    if (!isAnswered) return;
    setIndex((i) => i + 1);
    setAnswer({ selectedChoiceId: null, isCorrect: null });
  };

  const onFinish = async () => {
    if (!isAnswered) return;

    // The current answer should already be in the results array from onSelect
    // But let's make sure by checking if it exists and adding it if not
    const currentAnswerExists = results.some(r => r.questionId === current.id);
    let finalResults = results;
    
    if (!currentAnswerExists) {
      const currentResult = { questionId: current.id, selectedChoiceId: answer.selectedChoiceId!, isCorrect: answer.isCorrect! };
      finalResults = [...results, currentResult];
    }
    
    // Calculate final score from all results
    const finalScore = finalResults.filter(r => r.isCorrect).length;
    
    // Debug logging
    console.log('Quiz completion debug:', {
      totalQuestions: questions.length,
      resultsCount: finalResults.length,
      finalScore,
      results: finalResults
    });

    if (!savingEnabled) {
      // Navigate to result page with query params for non-logged in users
      navigate(`/result?score=${finalScore}&total=${questions.length}&level=${level}`);
      return;
    }

    try {
      await finishAttempt({
        userId: userId!,
        attemptId: attemptId!,
        correctCount: finalScore,
      });
      
      navigate(`/result?attemptId=${attemptId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                問題 {index + 1} / {questions.length}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  正解: {score} / {Math.min(results.length, questions.length)}
                </span>
                <Badge variant={savingEnabled ? "default" : "secondary"} className="gap-1">
                  <User className="h-3 w-3" />
                  {savingEnabled ? "保存中" : "未保存"}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {current.prompt}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {current.choices.map((choice, choiceIndex) => {
            const selected = answer.selectedChoiceId === choice.id;
            const showCorrect = isAnswered && choice.is_correct;
            const showWrong = isAnswered && selected && !choice.is_correct;

            return (
              <Button
                key={choice.id}
                variant={
                  showCorrect 
                    ? "default" 
                    : showWrong 
                    ? "destructive" 
                    : selected 
                    ? "secondary" 
                    : "outline"
                }
                className="w-full justify-start text-left h-auto py-4 px-4"
                onClick={() => onSelect(choice.id)}
                disabled={isAnswered}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + choiceIndex)}
                  </div>
                  <span className="flex-1">{choice.label}</span>
                  {showCorrect && <CheckCircle className="h-5 w-5 text-success" />}
                  {showWrong && <XCircle className="h-5 w-5 text-destructive" />}
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Enhanced Explanation Card */}
      {isAnswered && (
        <Card className={answer.isCorrect ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              {answer.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="font-semibold text-lg">
                {answer.isCorrect ? "正解！" : "不正解"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Correct Answer Display */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">正解</h4>
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-success text-success-foreground flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + current.choices.findIndex(c => c.is_correct))}
                  </div>
                  <span className="text-sm font-medium">
                    {current.choices.find(c => c.is_correct)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            {current.explanation && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">解説</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {current.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Your Answer (if incorrect) */}
            {!answer.isCorrect && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">あなたの回答</h4>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + current.choices.findIndex(c => c.id === answer.selectedChoiceId))}
                    </div>
                    <span className="text-sm">
                      {current.choices.find(c => c.id === answer.selectedChoiceId)?.label}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-center">
        {!isLast ? (
          <Button
            onClick={onNext}
            disabled={!isAnswered}
            size="lg"
            className="gap-2"
          >
            次の問題
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onFinish}
            disabled={!isAnswered}
            size="lg"
            className="gap-2"
          >
            <Trophy className="h-4 w-4" />
            結果を見る
          </Button>
        )}
      </div>

      {/* Debug Info (only in development) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground text-center">
          attemptId: {attemptId ?? "-"}
        </div>
      )} */}
    </div>
  );
}
