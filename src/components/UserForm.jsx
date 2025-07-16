import React, { useState, useEffect } from "react";

const UserForm = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState(user);

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
// apa yang diinputkan user
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="card card-body mb-4" onSubmit={handleSubmit}>
      <h5>{user.id ? "Edit User" : "Tambah User"}</h5>
      <div className="row mb-2">
        <div className="col-md-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Nama"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="form-control"
            placeholder="Username"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Email"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            className="form-control"
            placeholder="Website"
            required
          />
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">Simpan</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
};

export default UserForm;
