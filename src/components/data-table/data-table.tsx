import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  DataTableToolbar,
  ToolbarFilter,
} from "@/components/data-table/data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters: ToolbarFilter[];
  preSelectedFilters?: ColumnFiltersState;
  onRowClick: <TData>(data: TData) => void;
  records: TData[];
  enableRowSelection: boolean;
  onSelectedRowsChange?: <TData>(selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  preSelectedFilters = [],
  onRowClick,
  records,
  enableRowSelection = false,
  onSelectedRowsChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRow, setSelectedRow] = React.useState(0);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(preSelectedFilters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  React.useEffect(() => {
    function handleKeyDown(event: { keyCode: number }) {
      if (event.keyCode === 38) {
        // Up arrow
      } else if (event.keyCode === 40) {
        // Down arrow
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table.getRowModel().rows?.length]);

  React.useEffect(() => {
    if (onSelectedRowsChange === undefined) {
      return;
    }

    onSelectedRowsChange(
      table.getSelectedRowModel().flatRows.map((row) => row.original)
    );
  }, [rowSelection]);

  React.useEffect(() => {
    setColumnFilters(preSelectedFilters);
  }, [preSelectedFilters]);

  const assessmentColumns = [
    "inputQuality",
    "problemSeverity",
    "willingnessToPay",
    "tags",
  ];

  const accountColumns = [
    "arr",
    "companyName",
    "companyLocation",
    "plan",
    "signedUpAt",
  ];
  return (
    <div className="relative space-y-1 flex-1">
      <DataTableToolbar table={table} filters={filters} records={records} />

      <div className="relative w-[1620px] overflow-auto border-t border-b">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 border-b border-zinc-600 w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-zinc-100/20">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "border-e border-zinc-200 [&:has([role=checkbox])]:pr-2 [&:has([role=checkbox])]:border-none",
                        header.column.id === "select"
                          ? "bg-white sticky left-0"
                          : ""
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-zinc-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn(
                        "truncate border-e border-zinc-200 [&:has([role=checkbox])]:pr-2 [&:has([role=checkbox])]:border-none py-2",
                        assessmentColumns.includes(cell.column.id)
                          ? "bg-zinc-100/60"
                          : "",
                        accountColumns.includes(cell.column.id)
                          ? "bg-rose-100/40"
                          : "",
                        cell.column.id === "select"
                          ? "bg-white sticky left-0"
                          : ""
                      )}
                      // This is where the cell should have a shade of color
                      key={cell.id}
                      onClick={(
                        event: React.MouseEvent<HTMLTableCellElement>
                      ) => {
                        // Don't call row click handler when checkbox field(must has id="select") is clicked.
                        if (cell.column.id !== "select") {
                          onRowClick(row.original);
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <div className="flex flex-row flex-1 px-3 gap-x-8 pt-12">
        <div className="flex flex-row gap-x-2 items-center text-sm font-medium text-zinc-500">
          <div className="w-2 h-2 bg-red-200 rounded-full"></div>
          Account properties from CRM
        </div>
        <div className="flex flex-row gap-x-2 items-center text-sm font-medium text-zinc-500">
          <div className="w-2 h-2 bg-zinc-300 rounded-full"></div>
          Product experience properties
        </div>
      </div>
    </div>
  );
}
