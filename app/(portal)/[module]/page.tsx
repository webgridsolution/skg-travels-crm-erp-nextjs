import { notFound } from "next/navigation";
import {
  getCurrentUser,
  hasPermission,
  databaseConfigured,
} from "@/lib/server/auth";
import {
  getBranches,
  getModuleRows,
  moduleKey,
  modules,
} from "@/lib/server/resources";
import { ResourceTable } from "@/components/resource-table";
export default async function ModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ module: slug }, { q }] = await Promise.all([params, searchParams]);
  const key = moduleKey(slug);
  if (!key) notFound();
  const user = await getCurrentUser();
  if (!user) notFound();
  const definition = modules[key];
  if (!hasPermission(user, definition.permission)) notFound();
  const [rows, branches] = await Promise.all([
    getModuleRows(user, key, q ?? ""),
    getBranches(user),
  ]);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OPERATIONS / DIRECTORY</div>
          <h1>{definition.title}</h1>
          <p>{definition.description}</p>
        </div>
      </div>
      <form className="resource-search-row" action={`/${key}`}>
        <div className="search-control">
          <span>⌕</span>
          <input
            name="q"
            defaultValue={q}
            placeholder={`Search ${definition.title.toLowerCase()}…`}
          />
        </div>
        <button className="btn btn-light">Search</button>
      </form>
      <ResourceTable
        moduleKey={key}
        definition={definition}
        rows={rows}
        canCreate={Boolean(
          databaseConfigured() &&
          definition.createPermission &&
          hasPermission(user, definition.createPermission),
        )}
        canEdit={Boolean(
          databaseConfigured() &&
          definition.updatePermission &&
          hasPermission(user, definition.updatePermission),
        )}
        canArchive={Boolean(
          databaseConfigured() &&
          definition.deletePermission &&
          hasPermission(user, definition.deletePermission),
        )}
        branches={branches}
        search={q ?? ""}
        permissions={
          databaseConfigured()
            ? [
                ...user.permissions,
                ...(user.roles.includes("Super Admin") ? ["*"] : []),
              ]
            : []
        }
        demo={!databaseConfigured()}
      />
    </>
  );
}
