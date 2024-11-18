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
  FilterFn,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
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
  onRowClick?: <TData>(data: TData) => void;
  enableRowSelection: boolean;
  onSelectedRowsChange?: <TData>(selectedRows: TData[]) => void;
  stickyColumnCount: number;
  nonClickableColumns: string[];
  defaultPageSize?: number;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const cellValue = String(row.getValue(columnId));
  const tokens = cellValue.split(",").map((token) => token.trim());

  let highestRank: any = null;
  let anyPassed = false;

  // Tokens between commas are considered for fuzzy match because
  // complex objects are expected to be separated by commas
  // This conversion happens in accessorFn in column defini9tion
  tokens.forEach((token) => {
    const itemRank = rankItem(token, value);

    if (!highestRank || itemRank.rank < highestRank.rank) {
      highestRank = itemRank;
    }

    if (itemRank.passed) {
      anyPassed = true;
    }
  });
  addMeta({ highestRank });

  return anyPassed;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  preSelectedFilters = [],
  defaultColumnVisibility = {},
  onRowClick = undefined,
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
    globalFilterFn: fuzzyFilter,
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
    <>
      <DataTableToolbar table={table} filters={filters} />

      <div className="flex-1 h-full overflow-auto border-t border-b border-border">
        <Table>
          <TableHeader className="sticky z-20 top-0 w-full bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "[&:has([role=checkbox])]:pr-2 [&:has([role=checkbox])]:border-none bg-transparent",
                        header.column.getIndex() < stickyColumnCount
                          ? "sticky left-0 font-bold min-w-[200px] bg-card dark:bg-popover/50"
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
                  className={cn(
                    " text-sm",
                    selectedRow === row.index
                      ? "bg-card"
                      : "text-muted-foreground"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        className={cn(
                          "truncate border-e border-border [&:has([role=checkbox])]:pr-2 [&:has([role=checkbox])]:border-none py-1",
                          cell.column.getIndex() < stickyColumnCount
                            ? "sticky left-0 font-semibold bg-card dark:bg-popover/50"
                            : ""
                        )}
                        // This is where the cell should have a shade of color
                        key={cell.id}
                        onClick={(
                          event: React.MouseEvent<HTMLTableCellElement>
                        ) => {
                          // Don't call row click handler when checkbox field(must has id="select") is clicked.
                          if (!nonClickableColumns.includes(cell.column.id)) {
                            if (onRowClick) {
                              onRowClick(row.original);
                            }
                            setSelectedRow(row.index);
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
    </>
  );
}
