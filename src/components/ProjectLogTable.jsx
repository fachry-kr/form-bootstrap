import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProjectLogTable = () => {
  const [projects, setProjects] = useState(() => {
    const stored = localStorage.getItem("projects");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const generateDates = () => {
    const start = new Date("2025-06-16");
    const end = new Date("2025-07-15");
    const dates = [];
    while (start <= end) {
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, "0");
      const dd = String(start.getDate()).padStart(2, "0");
      dates.push(`${yyyy}-${mm}-${dd}`);
      start.setDate(start.getDate() + 1);
    }
    return dates;
  };

  const dates = generateDates();

  const handleCheckboxChange = (projectIndex, date) => {
    const updated = [...projects];
    const currentLog = updated[projectIndex].log || {};
    currentLog[date] = !currentLog[date];
    updated[projectIndex].log = currentLog;
    setProjects(updated);
  };

  const exportToExcel = () => {
    const rows = filteredProjects.map((proj, i) => {
      const row = {
        No: i + 1,
        "Nama PIC": proj.pic || "",
        "Nama Project": proj.nama,
        "Link Repo": proj.repo,
      };
      dates.forEach((date) => {
        row[date] = proj.log?.[date] ? "✓" : "";
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = 4; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell_address]) continue;
        ws[cell_address].s = {
          alignment: { horizontal: "center" },
          font: { color: { rgb: "000000" } },
        };
      }
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Log Projects");
    XLSX.writeFile(wb, "StyledLogProjects.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const head = [["No", "PIC", "Nama Project", "Link Repo", ...dates.map((d) => d.slice(8))]];
    const body = filteredProjects.map((proj, i) => [
      i + 1,
      proj.pic || "",
      proj.nama,
      proj.repo,
      ...dates.map((date) => (proj.log?.[date] ? "X" : "")),
    ]);
    autoTable(doc, {
      head,
      body,
      startY: 20,
      styles: { fontSize: 6 },
      headStyles: { fillColor: [240, 240, 240] },
    });
    doc.save("LogProjects.pdf");
  };

  const saveToBackend = async () => {
    try {
      const response = await fetch("https://your-api-url.com/save-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
      });
      if (response.ok) {
        alert("Data berhasil dikirim ke backend!");
      } else {
        alert("Gagal menyimpan ke backend.");
      }
    } catch (error) {
      alert("Terjadi error saat menyimpan ke backend.");
      console.error(error);
    }
  };

  const filteredProjects = projects.filter((proj) => {
    const matchSearch =
      proj.pic?.toLowerCase().includes(search.toLowerCase()) ||
      proj.nama?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "" || proj.repo?.endsWith(filter);
    return matchSearch && matchFilter;
  });

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <h4 className="mb-0">Log Project Git</h4>
        <Link to="/edit/new" className="btn btn-outline-success">Create</Link>
      </div>

      <div className="d-flex gap-2 flex-wrap mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Cari Nama PIC atau Project"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Semua</option>
          <option value=".com">.com</option>
          <option value=".org">.org</option>
        </select>
        <button className="btn btn-success" onClick={exportToExcel}>Export Excel</button>
        <button className="btn btn-danger" onClick={exportToPDF}>Export PDF</button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-sm text-center align-middle">
          <thead className="table-light sticky-top">
            <tr>
              <th>No</th>
              <th>Nama PIC</th>
              <th>Nama Project</th>
              <th>Link Repo</th>
              {dates.map((date) => {
                const d = new Date(date);
                return (
                  <th key={date} style={{ minWidth: "40px", fontSize: "11px" }}>
                    {d.getDate()}<br />{d.toLocaleString("default", { month: "short" }).toUpperCase()}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td>{idx + 1}</td>
                  <td>
                    <Link to={`/edit/${idx}`}>{project.pic || "-"}</Link>
                  </td>
                  <td>{project.nama}</td>
                  <td>
                    <a href={project.repo} target="_blank" rel="noopener noreferrer">Repo</a>{" "}
                    <button
                      className="btn btn-sm btn-link text-primary"
                      onClick={() =>
                        setSelectedProjectIndex(idx === selectedProjectIndex ? null : idx)
                      }
                    >
                      🗓️
                    </button>
                  </td>
                  {dates.map((date) => (
                    <td key={date}>{project.log?.[date] ? "X" : ""}</td>
                  ))}
                </tr>
                {selectedProjectIndex === idx && (
                  <tr>
                    <td colSpan={4 + dates.length} className="bg-light">
                      <div className="d-flex flex-wrap gap-2">
                        {dates.map((date) => (
                          <div key={date} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`checkbox-${idx}-${date}`}
                              checked={project.log?.[date] || false}
                              onChange={() => handleCheckboxChange(idx, date)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`checkbox-${idx}-${date}`}
                            >
                              {date}
                            </label>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4 + dates.length} className="text-end">
                Total Projects: {filteredProjects.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ProjectLogTable;
