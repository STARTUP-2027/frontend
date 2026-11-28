import CoursePlayerPage from "../../../src/app/learn/CoursePlayerPage";

export function generateStaticParams() {
  return [
    { courseId: "ai-agents-masterclass" },
    { courseId: "fullstack-react-nextjs" },
    { courseId: "rust-systems" },
    { courseId: "cloud-devops-k8s" },
    { courseId: "cybersecurity-zero-trust" },
    { courseId: "design-systems-tailwindcss" },
    { courseId: "python-core-data-structures" },
    { courseId: "nextjs-fullstack-architecture" },
    { courseId: "docker-kubernetes-gitops" },
  ];
}

export default function LearnCoursePage() {
  return <CoursePlayerPage />;
}
