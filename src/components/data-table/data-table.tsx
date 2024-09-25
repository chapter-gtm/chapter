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
  defaultColumnVisibility?: VisibilityState;
  onRowClick: <TData>(data: TData) => void;
  enableRowSelection: boolean;
  onSelectedRowsChange?: <TData>(selectedRows: TData[]) => void;
  stickyColumnCount: number;
  nonClickableColumns: string[];
  defaultPageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  preSelectedFilters = [],
  defaultColumnVisibility = {},
  onRowClick,
  enableRowSelection = false,
  onSelectedRowsChange,
  stickyColumnCount = 0,
  nonClickableColumns = [],
  defaultPageSize = 20,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRow, setSelectedRow] = React.useState(0);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
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
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
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

  return (
    <div className="space-y-1">
      <DataTableToolbar table={table} filters={filters} />

      <div className="flex overflow-x-auto border-t border-b border-border">
        <Table className="min-w-full text-sm">
          <TableHeader className="sticky top-0 border-b border-border w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-accent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "border-e border-border [&:has([role=checkbox])]:pr-2 [&:has([role=checkbox])]:border-none",
                        header.column.getIndex() < stickyColumnCount
                          ? "sticky left-0 bg-card font-bold"
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
                  className="hover:bg-red-300"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        className={cn(
                          "truncate border-e border-border [&:has([role=checkbox])]:pr-2 [&:has([role=checkbox])]:border-none py-1",
                          cell.column.getIndex() < stickyColumnCount
                            ? "sticky left-0 font-semibold"
                            : ""
                        )}
                        // This is where the cell should have a shade of color
                        key={cell.id}
                        onClick={(
                          event: React.MouseEvent<HTMLTableCellElement>
                        ) => {
                          // Don't call row click handler when checkbox field(must has id="select") is clicked.
                          if (!nonClickableColumns.includes(cell.column.id)) {
                            onRowClick(row.original);
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
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
    </div>
  );
}
