import { createFileRoute } from "@tanstack/react-router";
import { MenuApp } from "@/components/MenuApp";

export const Route = createFileRoute("/mesa/$hash")({
  component: MesaPage,
});

function MesaPage() {
  const { hash } = Route.useParams();
  return <MenuApp hash={hash} />;
}
