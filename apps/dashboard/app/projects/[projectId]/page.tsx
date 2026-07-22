import AppShell from "../../../components/layout/AppShell";
import ProjectDetailHome from "../../../features/projects/ProjectDetailHome";

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;

  return (
    <AppShell>
      <ProjectDetailHome projectId={projectId} />
    </AppShell>
  );
}