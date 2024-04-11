import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import "../../styles.css"

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
