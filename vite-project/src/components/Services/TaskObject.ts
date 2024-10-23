export interface Task{
    id?: string;
    name: string;
    description: string;
    isCompleted?: boolean;
    priority: number;
    difficulty: string;
    dueDate: string;
    creationDate?: string;
    estimatedTime: number;
}