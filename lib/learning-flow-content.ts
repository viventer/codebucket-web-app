export type LearningFlowItemConfig = {
  icon: string;
  tabLabel: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter?: string;
  description: string;
  storagePath: string;
};

export const LEARNING_FLOW_ITEMS: LearningFlowItemConfig[] = [
  {
    icon: "lightbulb.svg",
    tabLabel: "Poznaj",
    titleBefore: "Zdobywaj wiedzę ",
    titleAccent: "szybciej",
    description:
      "Poznaj nowy temat w maksymalnie kilka minut i szybko przejdź do działania.",
    storagePath: "landing-demo/video-demo.mp4",
  },
  {
    icon: "gamepad.svg",
    tabLabel: "Utrwal",
    titleBefore: "Ucz się ",
    titleAccent: "aktywnie",
    description:
      "Interaktywne ćwiczenia ułatwiają zapamiętywanie nowych zagadnień.",
    storagePath: "landing-demo/exercises-demo.mp4",
  },
  {
    icon: "code.svg",
    tabLabel: "Zastosuj",
    titleBefore: "Wykorzystaj wiedzę ",
    titleAccent: "w praktyce",
    description:
      "Buduj projekty krok po kroku i utrwalaj wiedzę w praktycznym kontekście.",
    storagePath: "landing-demo/project-demo.mp4",
  },
];
