import { Exercise } from '@/types';

export const exercises: Exercise[] = [
  {
    id: 'relaxed_jaw',
    titleEn: 'Relaxed Jaw Position',
    titlePt: 'Posição de Descanso da Mandíbula',
    descriptionEn: 'Reduces basal tension and trains relaxation posture',
    descriptionPt: 'Reduz tensão basal e treina postura de relaxamento',
    duration: 100, // 10 reps x 10s each
    stepsEn: [
      'Sit with your spine straight',
      'Gently touch your tongue to the roof of your mouth, behind your upper teeth',
      'Keep your teeth slightly apart and lips closed',
      'Hold this position for 10 seconds',
      'Relax and repeat (10 repetitions total)',
    ],
    stepsPt: [
      'Sente-se com a coluna ereta',
      'Toque a língua suavemente no céu da boca, atrás dos dentes superiores',
      'Deixe os dentes ligeiramente separados e os lábios fechados',
      'Mantenha essa posição por 10 segundos',
      'Relaxe e repita (10 repetições no total)',
    ],
    steps: [],
    icon: '😌',
    difficulty: 'easy',
  },
  {
    id: 'jaw_stretch',
    titleEn: 'Jaw Stretch',
    titlePt: 'Alongamento de Abertura',
    descriptionEn: 'Promotes stretching of masticatory muscles and improves opening range',
    descriptionPt: 'Promove alongamento dos músculos mastigatórios e melhora amplitude de abertura',
    duration: 75, // 5 reps x (10s hold + 5s rest)
    stepsEn: [
      'Sit up straight',
      'Slowly open your mouth to a comfortable point (without pain)',
      'Hold for 10 seconds',
      'Close slowly and relax for 5 seconds',
      'Repeat 5 times',
    ],
    stepsPt: [
      'Sente-se ereto',
      'Abra a boca lentamente até um ponto confortável (sem dor)',
      'Segure por 10 segundos',
      'Feche devagar e relaxe por 5 segundos',
      'Repita 5 vezes',
    ],
    steps: [],
    icon: '😮',
    difficulty: 'easy',
  },
  {
    id: 'tongue_press',
    titleEn: 'Tongue Press',
    titlePt: 'Pressão da Língua',
    descriptionEn: 'Helps improve tongue position and reduce excessive closing tension',
    descriptionPt: 'Ajuda a melhorar posição da língua e reduzir tensão de fechamento excessivo',
    duration: 60, // 10 reps x ~6s each
    stepsEn: [
      'Place your tongue on the roof of your mouth',
      'Slowly open your mouth while keeping your tongue in that position',
      'Hold for 5 seconds',
      'Close gently',
      'Repeat 10 times',
    ],
    stepsPt: [
      'Com a língua no céu da boca',
      'Abra a boca lentamente mantendo a língua nessa posição',
      'Segure por 5 segundos',
      'Feche suavemente',
      'Repita 10 vezes',
    ],
    steps: [],
    icon: '👅',
    difficulty: 'easy',
  },
  {
    id: 'side_to_side',
    titleEn: 'Side-to-Side Movements',
    titlePt: 'Mobilidade Lateral',
    descriptionEn: 'Loosens tense muscles and improves lateral mobility',
    descriptionPt: 'Solta músculos tensos e melhora mobilidade lateral',
    duration: 60, // 20 reps (10 each side) x ~3s each
    stepsEn: [
      'Sit comfortably',
      'Slowly move your jaw to the left',
      'Return to center',
      'Slowly move your jaw to the right',
      'Repeat 10 times for each side',
    ],
    stepsPt: [
      'Sente-se confortavelmente',
      'Desloque a mandíbula lentamente para a esquerda',
      'Retorne ao centro',
      'Desloque a mandíbula lentamente para a direita',
      'Repita 10 vezes para cada lado',
    ],
    steps: [],
    icon: '↔️',
    difficulty: 'easy',
  },
  {
    id: 'jaw_resistance',
    titleEn: 'Jaw Resistance',
    titlePt: 'Exercício de Resistência Suave',
    descriptionEn: 'Strengthens and improves control of jaw muscles',
    descriptionPt: 'Fortalece e melhora controle dos músculos mandibulares',
    duration: 50, // 5 reps x ~10s each
    stepsEn: [
      'Place your thumb under your chin',
      'Press lightly while slowly opening your mouth against this resistance',
      'Hold for 5 seconds',
      'Relax and close your mouth',
      'Repeat 5 times',
    ],
    stepsPt: [
      'Coloque o polegar sob o queixo',
      'Pressione levemente enquanto abre a boca lentamente contra essa resistência',
      'Segure por 5 segundos',
      'Relaxe e feche a boca',
      'Repita 5 vezes',
    ],
    steps: [],
    icon: '💪',
    difficulty: 'medium',
  },
  {
    id: 'jaw_massage',
    titleEn: 'Myofascial Jaw Massage',
    titlePt: 'Massagem Miofascial da Mandíbula',
    descriptionEn: 'Releases accumulated tension, improves circulation and reduces pain',
    descriptionPt: 'Libera tensão acumulada, melhora circulação e reduz dor',
    duration: 90, // 60s massage + time for setup
    stepsEn: [
      'Place your fingertips on your jaw muscles (near the front of your ears)',
      'Apply a warm compress before massage for greater relaxation (optional)',
      'Make gentle circular movements for 30-60 seconds',
      'Repeat on both sides',
      'Finish with light pressure and release',
    ],
    stepsPt: [
      'Coloque as pontas dos dedos sobre os músculos da mandíbula (perto da frente das orelhas)',
      'Aplique compressa morna antes da massagem para maior relaxamento (opcional)',
      'Faça movimentos circulares leves por 30-60 segundos',
      'Repita nos dois lados',
      'Finalize com leve pressão e solte',
    ],
    steps: [],
    icon: '💆',
    difficulty: 'medium',
  },
  {
    id: 'deep_breathing',
    titleEn: 'Deep Breathing / General Relaxation',
    titlePt: 'Respiração Profunda / Relaxamento Geral',
    descriptionEn: 'Reduces stress, which is one of the biggest triggers of bruxism',
    descriptionPt: 'Reduz estresse, que é um dos maiores gatilhos de bruxismo',
    duration: 300, // 5 minutes
    stepsEn: [
      'Find a comfortable position',
      'Inhale through your nose for 4 seconds',
      'Hold for 4 seconds',
      'Exhale slowly through your mouth for 4 seconds',
      'Continue for 5 minutes',
    ],
    stepsPt: [
      'Encontre uma posição confortável',
      'Inspire pelo nariz por 4 segundos',
      'Segure por 4 segundos',
      'Expire lentamente pela boca por 4 segundos',
      'Continue por 5 minutos',
    ],
    steps: [],
    icon: '🧘',
    difficulty: 'easy',
  },
];

export const getExercise = (id: string): Exercise | undefined => {
  return exercises.find((ex) => ex.id === id);
};

export const getExercisesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Exercise[] => {
  return exercises.filter((ex) => ex.difficulty === difficulty);
};
