import { createFileRoute } from "@tanstack/react-router";
import { MenuApp } from "@/components/MenuApp";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    mesa: typeof search.mesa === "string" ? search.mesa : undefined,
  }),
  component: Home,
});

function Home() {
  const { mesa } = Route.useSearch();
  return <MenuApp hash={mesa} />;
}
