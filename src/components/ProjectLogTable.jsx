import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../services/api";

// Tampilkan tabel log proyek dengan navigasi bulan
const ProjectLogTableWithMonthNav = () => {
  const [projects, setProjects]                 = useState([]);
  const [searchPic, setSearchPic]               = useState("");
  const [searchProject, setSearchProject]       = useState("");
  const [searchRepo, setSearchRepo]             = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [monthOffset, setMonthOffset]           = useState(0);
  const [isSearchClicked, setIsSearchClicked]   = useState(false);

  const currentDate  = new Date();
  const displayDate  = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
  const displayMonth = displayDate.getMonth();
  const displayYear  = displayDate.getFullYear();
  const monthName    = displayDate.toLocaleString("default", { month: "long" }).toUpperCase();

  useEffect(() => {
    api.get("/users")
      .then((res) => {
        const mapped = res.data.map((user) => ({
          pic   :  user.name,
          nama  : user.email,
          repo  : `https://jsonplaceholder.typicode.com/users/${user.id}`,
          log   : {},
        }));
        setProjects(mapped);
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err);
      });
  }, []);

  const generateDates = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates       = [];
    for (let day      = 1; day <= daysInMonth; day++) {
      const dd        = String(day).padStart(2, "0");
      const mm        = String(month + 1).padStart(2, "0");
      dates.push({ full: `${year}-${mm}-${dd}`, day: dd });
    }
    return dates;
  };

  const dates = generateDates(displayYear, displayMonth);

  // Biar bisa di Ceklis
  const handleCheckboxChange  = (projectIndex, dateKey) => {
    const updated             = [...filteredProjects];
    const currentLog          = updated[projectIndex].log || {};
    currentLog[dateKey]       = !currentLog[dateKey];
    updated[projectIndex].log = currentLog;
    setFilteredProjects(updated);
  };
// Mencari berdasarkan inputannya
  const handleSearch      = () => {
    const result          = projects.filter((proj) => {
      const matchPic      = proj.pic?.toLowerCase().includes(searchPic.toLowerCase());
      const matchProject  = proj.nama?.toLowerCase().includes(searchProject.toLowerCase());
      const matchRepo     = proj.repo?.toLowerCase().includes(searchRepo.toLowerCase());
      return matchPic && matchProject && matchRepo;
    });
    setFilteredProjects(result);
    setIsSearchClicked(true);
  };

  const exportToExcel = () => {
    const rows  = filteredProjects.map((proj, i) => {
      const row = {
        No: i + 1,
        "Nama PIC": proj.pic || "",
        "Nama Project": proj.nama,
        "Link Repo": proj.repo,
      };
      dates.forEach((date) => {
        row[date.full] = proj.log?.[date.full] ? "✓" : "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Log Projects");
    XLSX.writeFile(wb, "StyledLogProjects.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const head = [["No", "PIC", "Nama Project", "Link Repo", ...dates.map((d) => d.day)]];
    const body = filteredProjects.map((proj, i) => [
      i + 1,
      proj.pic || "",
      proj.nama,
      proj.repo,
      ...dates.map((date) => (proj.log?.[date.full] ? "✓" : "")),
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

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Laporan Project</h4>
        <Link to="/edit/new" className="btn btn-outline-success">Create</Link>
      </div>

      <div className="row g-2 mb-2">
        <div className="col-md">
          <input
            type="text"
            className="form-control"
            placeholder="Cari Nama PIC"
            value={searchPic}
            onChange={(e) => setSearchPic(e.target.value)}
          />
        </div>
        <div className="col-md">
          <input
            type="text"
            className="form-control"
            placeholder="Cari Nama Project"
            value={searchProject}
            onChange={(e) => setSearchProject(e.target.value)}
          />
        </div>
        <div className="col-md">
          <input
            type="text"
            className="form-control"
            placeholder="Cari Link Repo"
            value={searchRepo}
            onChange={(e) => setSearchRepo(e.target.value)}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="d-flex gap-2 flex-wrap mb-3">
        <button className="btn btn-success" onClick={exportToExcel}>Export Excel</button>
        <button className="btn btn-danger" onClick={exportToPDF}>Export PDF</button>
      </div>
      
      {isSearchClicked && (
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table table-bordered table-sm text-center align-middle">
            <thead className="table-light sticky-top">
              <tr>
                <th className="bg-white sticky-start" rowSpan="2">No</th>
                <th className="bg-white sticky-start" rowSpan="2">Nama PIC</th>
                <th className="bg-white sticky-start" rowSpan="2">Nama Project</th>
                <th className="bg-white sticky-start" rowSpan="2">Link Repo</th>
                <th colSpan={dates.length}>
                  <div className="d-flex justify-content-center align-items-center gap-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setMonthOffset(monthOffset - 1)}
                    >
                      ←
                    </button>
                    <strong>{monthName} {displayYear}</strong>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setMonthOffset(monthOffset + 1)}
                    >
                      →
                    </button>
                  </div>
                </th>
              </tr>
              <tr>
                {dates.map((date) => (
                  <th key={date.full} style={{ minWidth: "30px", fontSize: "11px" }}>{date.day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => (
                  <tr key={idx}>
                    <td className="bg-white sticky-start">{idx + 1}</td>
                    <td className="bg-white sticky-start">
                      <Link to={`/edit/${idx+1}`}>{project.pic}</Link>
                    </td>
                    <td className="bg-white sticky-start">{project.nama}</td>
                    <td className="bg-white sticky-start">
                      <a href={project.repo} target="_blank" rel="noreferrer">
                        {new URL(project.repo).hostname}
                      </a>
                    </td>
                    {dates.map((date) => (
                      <td key={date.full}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={project.log?.[date.full] || false}
                          onChange={() => handleCheckboxChange(idx, date.full)}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4 + dates.length} className="text-center text-muted">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectLogTableWithMonthNav;