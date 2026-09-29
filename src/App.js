
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import "./App.css";
import { db, auth } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";

function LectureHome() {
  const subjects = [
    "Computer Graphics",
    "Communication Technology",
    "Advanced Networks",
    "Embedded Systems",
    "Selected Labs",
  ];

  const [lectures, setLectures] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "lectures")
        );

        const lecturesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLectures(lecturesData);
      } catch (error) {
        console.error("Error getting lectures:", error);
      }
    };

    fetchLectures();
  }, []);

  const openLecture = (lecture) => {
    window.open(lecture.link, "_blank");
  };

  const copyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      alert("Password copied!");
    } catch (error) {
      alert("Could not copy password.");
    }
  };

  const getSubjectPasswords = (subject) => {
    return lectures.filter(
      (lecture) =>
        lecture.subject === subject &&
        lecture.password
    );
  };

  const subjectLectures = lectures.filter(
    (lecture) =>
      lecture.subject === selectedSubject
  );

  return (
    <div className="app">

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
                      (item, index) => (

                        <div
                          className="password-item"
                          key={item.id}
                        >

                          <div>

                            <strong>
                              {item.lecture ||
                                `Lecture ${index + 1}`}
                            </strong>

                            <div className="password-text">
                              🔑 {item.password}
                            </div>

                          </div>

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

      <div className="container py-5">

        {!selectedSubject ? (

          <>
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
                        setSelectedSubject(subject)
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

            {/* Footer - Subjects Page Only */}

            <footer className="text-center py-5">

              <p className="mb-0 text-muted">
                Made by{" "}
                <strong>Malak Elsharkawy</strong> ❤️
              </p>

            </footer>

          </>

        ) : (

          <>
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

            <div className="row g-4">

              {subjectLectures.length === 0 ? (

                <div className="text-center text-muted py-5">

                  <h4>
                    📚 No lectures yet
                  </h4>

                  <p>
                    No lectures have been added yet.
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
                          {lecture.lecture ||
                            lecture.title}
                        </h5>

                        <button
                          className="btn btn-success w-100"
                          onClick={() =>
                            openLecture(lecture)
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

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LectureHome />}
        />

        <Route
          path="/admin"
          element={
            user ? <Admin /> : <AdminLogin />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

