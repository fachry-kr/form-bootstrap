import React, { useEffect, useState } from "react";
import UserForm from "./UserForm";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWeb, setFilterWeb] = useState("all");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setOriginalUsers(data);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterUsers(term, filterWeb);
  };

  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFilterWeb(filter);
    filterUsers(searchTerm, filter);
  };

  const filterUsers = (term, filter) => {
    let filtered = [...originalUsers];
    if (term) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term)
      );
    }
    if (filter !== "all") {
      filtered = filtered.filter(user =>
        user.website.endsWith(filter)
      );
    }
    setUsers(filtered);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Hapus user ini?");
    if (confirmed) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      setOriginalUsers(updated);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleAddNew = () => {
    setEditingUser({ id: null, name: "", username: "", email: "", website: "" });
  };

  const handleSave = (user) => {
    let updatedUsers;
    if (user.id) {
      updatedUsers = users.map(u => (u.id === user.id ? user : u));
    } else {
      user.id = Date.now();
      updatedUsers = [...users, user];
    }
    setUsers(updatedUsers);
    setOriginalUsers(updatedUsers);
    setEditingUser(null);
  };

  return (
    <div className="container mt-5">
      <h3>Daftar Pengguna</h3>

      <div className="d-flex gap-3 mb-3 flex-wrap">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Cari nama..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select className="form-select w-auto" value={filterWeb} onChange={handleFilterChange}>
          <option value="all">Semua Website</option>
          <option value=".com">.com</option>
          <option value=".org">.org</option>
          <option value=".net">.net</option>
        </select>
        <button className="btn btn-success" onClick={handleAddNew}>+ Tambah User</button>
      </div>

      {editingUser && (
        <UserForm user={editingUser} onSave={handleSave} onCancel={() => setEditingUser(null)} />
      )}

      <table className="table table-bordered table-sm text-center">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Username</th>
            <th>Email</th>
            <th>Website</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <a href={`https://${u.website}`} target="_blank" rel="noreferrer">{u.website}</a>
              </td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(u)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
