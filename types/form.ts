type Form = {
  name: string;
  description: string;
  themeColorId?: number;
  fontId?: number;
  formType?: string;
  assessmentQuestionOptions: AssessmentQuestionOptions[];
};
type AssessmentQuestionOptions = {
  assessmentContent?: string;
  questionOptionContents?: string[];
  assessmentType?: string;
  required?: boolean;
};
export type { Form, AssessmentQuestionOptions };
