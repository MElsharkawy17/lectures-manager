import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const subjects = [
    "Computer Graphics",
    "Communication Technology",
    "Advanced Networks",
    "Embedded Systems",
    "Selected Labs",
  ];

  // Lectures
  const [lectures, setLectures] = useState(() => {
    const saved = localStorage.getItem("lectures");
    return saved ? JSON.parse(saved) : [];
  });

  // Passwords
  const [passwords, setPasswords] = useState(() => {
    const saved = localStorage.getItem("lecturePasswords");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedSubject, setSelectedSubject] = useState(null);

  const [showPasswords, setShowPasswords] =
    useState(false);

  const [showAddPassword, setShowAddPassword] =
    useState(false);

  const [passwordSubject, setPasswordSubject] =
    useState("Computer Graphics");

  const [newPassword, setNewPassword] = useState("");

  // Lecture Form
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureLink, setLectureLink] = useState("");

  // Save Lectures
  useEffect(() => {
    localStorage.setItem(
      "lectures",
      JSON.stringify(lectures)
    );
  }, [lectures]);

  // Save Passwords
  useEffect(() => {
    localStorage.setItem(
      "lecturePasswords",
      JSON.stringify(passwords)
    );
  }, [passwords]);

  // =========================
  // ADD LECTURE
  // =========================

  const addLecture = (e) => {
    e.preventDefault();

    if (
      !lectureTitle.trim() ||
      !lectureLink.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    const newLecture = {
      id: Date.now(),
      subject: selectedSubject,
      title: lectureTitle,
      link: lectureLink,
    };

    setLectures([...lectures, newLecture]);

    setLectureTitle("");
    setLectureLink("");
  };

  // =========================
  // OPEN LECTURE
  // =========================

  const openLecture = (lecture) => {
    window.open(lecture.link, "_blank");
  };

  // =========================
  // ADD PASSWORD
  // =========================

  const addPassword = (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      alert("Please enter password");
      return;
    }

    const subjectPasswords = passwords.filter(
      (item) => item.subject === passwordSubject
    );

    const lectureNumber =
      subjectPasswords.length + 1;

    const newPasswordItem = {
      id: Date.now(),
      subject: passwordSubject,
      lectureNumber: lectureNumber,
      password: newPassword,
    };

    setPasswords([
      ...passwords,
      newPasswordItem,
    ]);

    setNewPassword("");
    setShowAddPassword(false);
  };

  // =========================
  // COPY PASSWORD
  // =========================

  const copyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      alert("Password copied!");
    } catch (error) {
      alert("Could not copy password.");
    }
  };

  // =========================
  // DELETE PASSWORD
  // =========================

  const deletePassword = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this password?"
    );

    if (!confirmed) return;

    const passwordToDelete = passwords.find(
      (item) => item.id === id
    );

    if (!passwordToDelete) return;

    const subject = passwordToDelete.subject;

    const updatedPasswords = passwords.filter(
      (item) => item.id !== id
    );

    let number = 1;

    const reorderedPasswords =
      updatedPasswords.map((item) => {
        if (item.subject === subject) {
          const updatedItem = {
            ...item,
            lectureNumber: number,
          };

          number++;

          return updatedItem;
        }

        return item;
      });

    setPasswords(reorderedPasswords);
  };

  // =========================
  // GET SUBJECT PASSWORDS
  // =========================

  const getSubjectPasswords = (subject) => {
    return passwords.filter(
      (item) => item.subject === subject
    );
  };

  // =========================
  // SUBJECT LECTURES
  // =========================

  const subjectLectures = lectures.filter(
    (lecture) =>
      lecture.subject === selectedSubject
  );

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar navbar-dark">
        <div className="container">

          <span className="navbar-brand fw-bold">
            📚 My Lecture Manager
          </span>

          <button
            className="btn btn-light"
            onClick={() =>
              setShowPasswords(!showPasswords)
            }
          >
            🔐 Passwords
          </button>

        </div>
      </nav>

      {/* =========================
          PASSWORD SIDEBAR
      ========================= */}

      {showPasswords && (
        <>
          <div
            className="password-overlay"
            onClick={() =>
              setShowPasswords(false)
            }
          ></div>

          <div className="password-sidebar">

            <div className="password-header">

              <h4>🔐 Passwords</h4>

              <button
                className="btn-close"
                onClick={() =>
                  setShowPasswords(false)
                }
              ></button>

            </div>

            {/* ADD PASSWORD BUTTON */}

            <button
              className="btn btn-primary w-100 mb-4"
              onClick={() =>
                setShowAddPassword(
                  !showAddPassword
                )
              }
            >
              ➕ Add Password
            </button>

            {/* ADD PASSWORD FORM */}

            {showAddPassword && (
              <div className="password-add-card">

                <h6 className="mb-3">
                  Add New Password
                </h6>

                <form onSubmit={addPassword}>

                  <label className="form-label">
                    Subject
                  </label>

                  <select
                    className="form-select mb-3"
                    value={passwordSubject}
                    onChange={(e) =>
                      setPasswordSubject(
                        e.target.value
                      )
                    }
                  >
                    {subjects.map((subject) => (
                      <option
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </option>
                    ))}
                  </select>

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter password..."
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                  >
                    Save Password
                  </button>

                </form>

              </div>
            )}

            {/* PASSWORD LIST */}

            {subjects.map((subject) => {

              const subjectPasswords =
                getSubjectPasswords(subject);

              return (
                <div
                  className="password-subject"
                  key={subject}
                >

                  <h6>
                    📁 {subject}
                  </h6>

                  {subjectPasswords.length === 0 ? (
                    <p className="text-muted small">
                      No passwords yet
                    </p>
                  ) : (
                    subjectPasswords.map(
                      (item) => (
                        <div
                          className="password-item"
                          key={item.id}
                        >

                          <div>
                            <strong>
                              Lecture{" "}
                              {item.lectureNumber}
                            </strong>

                            <div className="password-text">
                              🔑 {item.password}
                            </div>
                          </div>

                          <div className="d-flex gap-2">

                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                copyPassword(
                                  item.password
                                )
                              }
                            >
                              📋
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                deletePassword(
                                  item.id
                                )
                              }
                            >
                              🗑️
                            </button>

                          </div>

                        </div>
                      )
                    )
                  )}

                </div>
              );
            })}

          </div>
        </>
      )}

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="container py-5">

        {!selectedSubject ? (
          <>
            {/* HOME */}

            <div className="text-center mb-5">

              <h1>📚 My Lectures</h1>

              <p className="text-muted">
                All your lectures in one place
              </p>

            </div>

            <div className="row g-4">

              {subjects.map((subject) => {

                const count =
                  lectures.filter(
                    (lecture) =>
                      lecture.subject === subject
                  ).length;

                return (
                  <div
                    className="col-md-6 col-lg-4"
                    key={subject}
                  >

                    <div
                      className="folder"
                      onClick={() =>
                        setSelectedSubject(
                          subject
                        )
                      }
                    >

                      <div className="folder-icon">
                        📁
                      </div>

                      <div>

                        <h5>{subject}</h5>

                        <p>
                          {count}{" "}
                          {count === 1
                            ? "Lecture"
                            : "Lectures"}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          </>
        ) : (
          <>
            {/* SUBJECT PAGE */}

            <button
              className="btn btn-outline-secondary mb-4"
              onClick={() =>
                setSelectedSubject(null)
              }
            >
              ← Back to Subjects
            </button>

            <div className="mb-4">

              <h2>
                📁 {selectedSubject}
              </h2>

              <p className="text-muted">
                {subjectLectures.length}{" "}
                {subjectLectures.length === 1
                  ? "Lecture"
                  : "Lectures"}
              </p>

            </div>

            {/* ADD LECTURE */}

            <div className="card shadow-sm add-card mb-5">

              <div className="card-body">

                <h4 className="mb-4">
                  ➕ Add Lecture
                </h4>

                <form onSubmit={addLecture}>

                  <div className="row g-3">

                    <div className="col-12">

                      <label className="form-label">
                        Lecture Title
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Lecture 1"
                        value={lectureTitle}
                        onChange={(e) =>
                          setLectureTitle(
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <div className="col-12">

                      <label className="form-label">
                        Lecture Link
                      </label>

                      <input
                        type="url"
                        className="form-control"
                        placeholder="Paste lecture link here..."
                        value={lectureLink}
                        onChange={(e) =>
                          setLectureLink(
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <div className="col-12">

                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Add Lecture
                      </button>

                    </div>

                  </div>

                </form>

              </div>

            </div>

            {/* LECTURES */}

            <div className="row g-4">

              {subjectLectures.length === 0 ? (

                <div className="text-center text-muted py-5">

                  <h4>
                    📚 No lectures yet
                  </h4>

                  <p>
                    Add your first lecture above.
                  </p>

                </div>

              ) : (

                subjectLectures.map(
                  (lecture) => (

                    <div
                      className="col-md-6 col-lg-4"
                      key={lecture.id}
                    >

                      <div className="lecture-card">

                        <div className="lecture-icon">
                          🔗
                        </div>

                        <h5>
                          {lecture.title}
                        </h5>

                        <button
                          className="btn btn-success w-100"
                          onClick={() =>
                            openLecture(
                              lecture
                            )
                          }
                        >
                          🔗 Open Lecture
                        </button>

                      </div>

                    </div>

                  )
                )

              )}

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default App;