export type QuestionLevel = "beginner" | "intermediate" | "advanced";

export type Choice = {
    id: number;
    label: string;
    is_correct: boolean;
};

export type Question = {
    id: number;
    level: QuestionLevel;
    category: string;
    prompt: string;
    explanation: string;
    choices: Choice[];
};