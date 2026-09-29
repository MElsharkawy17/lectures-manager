
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

  const doctors = {
    "Computer Graphics": ["Yasmin", "Wafaa"],
    "Communication Technology": ["Saeed", "Reham"],
    "Advanced Networks": ["Shimaa", "Saeed"],
    "Embedded Systems": ["Yasmin", "Asmaa"],
  };

  const [lectures, setLectures] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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
    } catch (error) {
      console.error("Could not copy password:", error);
    }
  };

  const subjectLectures = lectures.filter(
    (lecture) => lecture.subject === selectedSubject
  );

  const subjectDoctors = doctors[selectedSubject] || [];

  const hasDoctors = subjectDoctors.length > 0;

  const getDoctorLectures = (doctor) => {
    return subjectLectures.filter(
      (lecture) =>
        lecture.doctor?.trim() === doctor
    );
  };

  const getSubjectLectureCount = (subject) => {
    const subjectDoctors = doctors[subject] || [];

    if (subjectDoctors.length === 0) {
      return lectures.filter(
        (lecture) =>
          lecture.subject === subject
      ).length;
    }

    return lectures.filter(
      (lecture) =>
        lecture.subject === subject &&
        subjectDoctors.includes(
          lecture.doctor?.trim()
        )
    ).length;
  };

  const totalSubjectLectures = hasDoctors
    ? subjectLectures.filter((lecture) =>
        subjectDoctors.includes(
          lecture.doctor?.trim()
        )
      ).length
    : subjectLectures.length;

  const backToSubjects = () => {
    setSelectedSubject(null);
    setSelectedDoctor(null);
  };

  const openSubject = (subject) => {
    setSelectedSubject(subject);
    setSelectedDoctor(null);
  };

  return (
    <div className="app">

      <nav className="navbar navbar-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">
            📚 My Lecture Manager
          </span>
        </div>
      </nav>

      <div className="container py-5">

        {!selectedSubject ? (
          <>
            <div className="text-center mb-5">

              <h1> My Lectures</h1>

              <p className="text-muted">
                All your lectures in one place
              </p>

            </div>

            <div className="row g-4">

              {subjects.map((subject) => {

                const count =
                  getSubjectLectureCount(subject);

                return (
                  <div
                    className="col-md-6 col-lg-4"
                    key={subject}
                  >

                    <div
                      className="folder"
                      onClick={() =>
                        openSubject(subject)
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

            <footer className="text-center py-5">

              <p className="mb-0 text-muted">

                Made by{" "}
                <strong>
                  Malak Elsharkawy
                </strong>{" "}
                ❤️

              </p>

            </footer>

          </>
        ) : (

          <>
            <button
              className="btn btn-outline-secondary mb-4"
              onClick={backToSubjects}
            >
              ← Back to Subjects
            </button>

            <div className="mb-4">

              <h2>
                📁 {selectedSubject}
              </h2>

              <p className="text-muted">

                {totalSubjectLectures}{" "}
                {totalSubjectLectures === 1
                  ? "Lecture"
                  : "Lectures"}

              </p>

            </div>

            {hasDoctors ? (

              selectedDoctor ? (

                <>
                  <button
                    className="btn btn-outline-secondary mb-4"
                    onClick={() =>
                      setSelectedDoctor(null)
                    }
                  >
                    ← Back to Doctors
                  </button>

                  <div className="mb-4">

                    <h3>
                      Dr. {selectedDoctor}
                    </h3>

                    <p className="text-muted">

                      {
                        getDoctorLectures(
                          selectedDoctor
                        ).length
                      }{" "}
                      {
                        getDoctorLectures(
                          selectedDoctor
                        ).length === 1
                          ? "Lecture"
                          : "Lectures"
                      }

                    </p>

                  </div>

                  <div className="row g-4">

                    {getDoctorLectures(
                      selectedDoctor
                    ).length === 0 ? (

                      <div className="text-center text-muted py-5">

                        <h4>
                          📚 No lectures yet
                        </h4>

                        <p>
                          No lectures have been
                          added for this doctor yet.
                        </p>

                      </div>

                    ) : (

                      getDoctorLectures(
                        selectedDoctor
                      ).map((lecture) => (

                        <div
                          className="col-md-6 col-lg-4"
                          key={lecture.id}
                        >

                          <div className="lecture-card">

                            <h5>
                              {lecture.lecture ||
                                lecture.title}
                            </h5>

                            <button
                              className="btn btn-success w-100 mb-3"
                              onClick={() =>
                                openLecture(
                                  lecture
                                )
                              }
                            >
                              🔗 Open Lecture
                            </button>

                            {lecture.password ? (

                              <div className="d-flex align-items-center justify-content-between gap-2">

                                <div className="border rounded px-3 py-2 flex-grow-1">

                                  <strong>
                                    {
                                      lecture.password
                                    }
                                  </strong>

                                </div>

                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    copyPassword(
                                      lecture.password
                                    )
                                  }
                                >
                                  Copy
                                </button>

                              </div>

                            ) : (

                              <div className="text-muted text-center">
                                🔒 No password
                              </div>

                            )}

                          </div>

                        </div>

                      ))

                    )}

                  </div>

                </>

              ) : (

                <div className="row g-4">

                  {subjectDoctors.map(
                    (doctor) => {

                      const count =
                        getDoctorLectures(
                          doctor
                        ).length;

                      return (
                        <div
                          className="col-md-6 col-lg-4"
                          key={doctor}
                        >

                          <div
                            className="folder"
                            onClick={() =>
                              setSelectedDoctor(
                                doctor
                              )
                            }
                          >

                           

                            <div>

                              <h5>
                                Dr. {doctor}
                              </h5>

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
                    }
                  )}

                </div>

              )

            ) : (

              <div className="row g-4">

                {subjectLectures.length === 0 ? (

                  <div className="text-center text-muted py-5">

              

                    <p>
                      No lectures have been
                      added yet.
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

                          

                          <h5>
                            {lecture.lecture ||
                              lecture.title}
                          </h5>

                          <button
                            className="btn btn-success w-100 mb-3"
                            onClick={() =>
                              openLecture(
                                lecture
                              )
                            }
                          >
                            🔗 Open Lecture
                          </button>

                          {lecture.password ? (

                            <div className="d-flex align-items-center justify-content-between gap-2">

                              <div className="border rounded px-3 py-2 flex-grow-1">

                                🔐{" "}
                                <strong>
                                  {
                                    lecture.password
                                  }
                                </strong>

                              </div>

                              <button
                                className="btn btn-primary"
                                onClick={() =>
                                  copyPassword(
                                    lecture.password
                                  )
                                }
                              >
                                📋 Copy
                              </button>

                            </div>

                          ) : (

                            <div className="text-muted text-center">
                              🔒 No password
                            </div>

                          )}

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            )}

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

    const unsubscribe =
      onAuthStateChanged(
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
            user ? (
              <Admin />
            ) : (
              <AdminLogin />
            )
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;
