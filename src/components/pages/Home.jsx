import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "../ui/Table";
import SortIcon from '@mui/icons-material/Sort';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const mockData = Array.from({ length: 57 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? "Admin" : "User",
}));

const columns = [
  { key: "id", header: "ID", sortable: true, icon: <SortIcon fontSize="small" /> },
  { key: "name", header: "Name", sortable: true, icon: <PersonIcon fontSize="small" /> },
  { key: "email", header: "Email", icon: <EmailIcon fontSize="small" /> },
  { key: "role", header: "Role", sortable: true, icon: <AdminPanelSettingsIcon fontSize="small" /> },
];

const statusOptions = [
  { value: "__ALL__", label: "Status" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];
const roleOptions = [
  { value: "__ALL__", label: "Type" },
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
];

export default function Home() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sort, setSort] = useState({ key: "id", direction: "asc" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [role, setRole] = useState("__ALL__");
  const [status, setStatus] = useState("__ALL__");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = mockData;
      if (search) {
        filtered = filtered.filter(
          (row) =>
            row.name.toLowerCase().includes(search.toLowerCase()) ||
            row.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (role && role !== "__ALL__") {
        filtered = filtered.filter((row) => row.role === role);
      }
      if (status && status !== "__ALL__") {
        // For demo, randomly assign status to rows
        filtered = filtered.filter((row, i) => (status === "public" ? i % 2 === 0 : i % 2 !== 0));
      }
      if (sort?.key) {
        filtered = [...filtered].sort((a, b) => {
          if (a[sort.key] < b[sort.key]) return sort.direction === "asc" ? -1 : 1;
          if (a[sort.key] > b[sort.key]) return sort.direction === "asc" ? 1 : -1;
          return 0;
        });
      }
      setTotal(filtered.length);
      setData(filtered.slice((page - 1) * pageSize, page * pageSize));
      setLoading(false);
    }, 400);
  }, [page, pageSize, sort, search, role, status]);

  // Row selection logic
  const handleRowSelect = (row, checked) => {
    setSelectedRows((prev) =>
      checked ? [...prev, row] : prev.filter((r) => r.id !== row.id)
    );
  };
  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? data : []);
  };

  // Bulk export selected
  const handleExportSelected = () => {
    if (!selectedRows.length) return;
    const exportCols = columns;
    const csv = [
      exportCols.map((col) => col.header),
      ...selectedRows.map((row) => exportCols.map((col) => row[col.key]))
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-rows.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filters = [
    {
      key: "role",
      label: "Type",
      options: roleOptions,
      value: role,
      onChange: setRole,
    },
    {
      key: "status",
      label: "Status",
      options: statusOptions,
      value: status,
      onChange: setStatus,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home - Table Demo</h1>
      <div className="mb-2 flex gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportSelected}
          disabled={selectedRows.length === 0}
        >
          Export Selected
        </Button>
        <span className="text-xs text-muted-foreground">
          {selectedRows.length} row(s) selected
        </span>
      </div>
      <Table
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onSortChange={(key, direction) => {
          setSort({ key, direction });
          setPage(1);
        }}
        sort={sort}
        search={search}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        rowSelection
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        filters={filters}
        footerContent={<span>Showing {data.length} of {total} results</span>}
        paginationDelta={2}
      />
    </div>
  );
}