import React, { useState } from "react";
import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";

function Admin() {
  const subjects = [
    "Computer Graphics",
    "Communication Technology",
    "Advanced Networks",
    "Embedded Systems",
    "Selected Labs",
  ];

  const [subject, setSubject] = useState("Computer Graphics");
  const [lecture, setLecture] = useState("");
  const [link, setLink] = useState("");
  const [password, setPassword] = useState("");

  const addLecture = async (e) => {
    e.preventDefault();

    if (!lecture.trim() || !link.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "lectures"), {
        subject: subject,
        lecture: lecture,
        link: link,
        password: password,
      });

      alert("Lecture added successfully!");

      setLecture("");
      setLink("");
      setPassword("");
    } catch (error) {
      console.error("Error adding lecture:", error);
      alert("Could not add lecture");
    }
  };

  return (
    <div className="container py-5">

      <h1 className="mb-4">📚 Lecture Manager - Admin</h1>

      <div className="card shadow-sm">
        <div className="card-body">

          <h4 className="mb-4">
            ➕ Add New Lecture
          </h4>

          <form onSubmit={addLecture}>

            <div className="mb-3">
              <label className="form-label">
                Subject
              </label>

              <select
                className="form-select"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
              >
                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Lecture
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="e.g. Lecture 2"
                value={lecture}
                onChange={(e) =>
                  setLecture(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Lecture Link
              </label>

              <input
                type="url"
                className="form-control"
                placeholder="Paste lecture link"
                value={link}
                onChange={(e) =>
                  setLink(e.target.value)
                }
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Password
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Lecture
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}

export default Admin;