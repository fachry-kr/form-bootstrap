import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({
    pic: "",
    nama: "",
    repo: "",
    log: {},
  });

  // Biar bisa diedit
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(stored);

    if (id !== "new" && stored[id]) {
      setProject(stored[id]);
    }
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...projects];

    if (id === "new") {
      updated.push(project);
    } else {
      updated[id] = project;
    }

    localStorage.setItem("projects", JSON.stringify(updated));
    alert("Project berhasil disimpan!");
    navigate("/");
  };

  const handleDelete = () => {
    if (window.confirm("Yakin ingin menghapus project ini?")) {
      const updated = [...projects];
      updated.splice(id, 1);
      localStorage.setItem("projects", JSON.stringify(updated));
      alert("Project berhasil dihapus!");
      navigate("/");
    }
  };

  // Tampilan form untuk edit atau buat project baru
  return (
    <div className="container mt-5">
      <h3>{id === "new" ? "Create Project" : "Edit Project"}</h3>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow bg-light">
        <div className="mb-3">
          <label className="form-label">Nama PIC</label>
          <input
            type="text"
            className="form-control"
            name="pic"
            value={project.pic}
            onChange={handleChange}
            required
            placeholder="Contoh: Budi"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nama Project</label>
          <input
            type="text"
            className="form-control"
            name="nama"
            value={project.nama}
            onChange={handleChange}
            required
            placeholder="Contoh: Backend App Monitoring"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Link Repository</label>
          <input
            type="text"
            className="form-control"
            name="repo"
            value={project.repo}
            onChange={handleChange}
            required
            placeholder="Contoh: https://bitbucket.org/repo-name"
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Simpan</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Batal
          </button>
          {id !== "new" && (
            <button
              type="button"
              className="btn btn-danger ms-auto"
              onClick={handleDelete}
            >
              Hapus
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProject;
