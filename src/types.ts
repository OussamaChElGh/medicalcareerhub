export interface Option {
  id: string;
  text: string;
  sigil: string;
  alignment: string; // The medical archetype this supports
}

export interface Question {
  id: number;
  label: string;
  text: string;
  options: Option[];
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  alternatives: string[];
  rationale: string;
  hogwartsHouse: 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin';
}

export interface BlogPost {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
}

export type QuizType = 'QUICK' | 'EXTENSIVE';

export type Scene = 'HOME' | 'SELECTION' | 'PAYMENT' | 'QUIZ' | 'REVEAL' | 'THINK' | 'RESULT' | 'BLOG';
