// import React, { useState } from "react";
// import { db } from "./firebase";
// import { addDoc, collection } from "firebase/firestore";

// function Admin() {
//   const subjects = [
//     "Computer Graphics",
//     "Communication Technology",
//     "Advanced Networks",
//     "Embedded Systems",
//     "Selected Labs",
//   ];

//   const [subject, setSubject] = useState("Computer Graphics");
//   const [lecture, setLecture] = useState("");
//   const [link, setLink] = useState("");
//   const [password, setPassword] = useState("");

//   const addLecture = async (e) => {
//     e.preventDefault();

//     if (!lecture.trim() || !link.trim() || !password.trim()) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "lectures"), {
//         subject: subject,
//         lecture: lecture,
//         link: link,
//         password: password,
//       });

//       alert("Lecture added successfully!");

//       setLecture("");
//       setLink("");
//       setPassword("");
//     } catch (error) {
//       console.error("Error adding lecture:", error);
//       alert("Could not add lecture");
//     }
//   };

//   return (
//     <div className="container py-5">

//       <h1 className="mb-4">📚 Lecture Manager - Admin</h1>

//       <div className="card shadow-sm">
//         <div className="card-body">

//           <h4 className="mb-4">
//             ➕ Add New Lecture
//           </h4>

//           <form onSubmit={addLecture}>

//             <div className="mb-3">
//               <label className="form-label">
//                 Subject
//               </label>

//               <select
//                 className="form-select"
//                 value={subject}
//                 onChange={(e) =>
//                   setSubject(e.target.value)
//                 }
//               >
//                 {subjects.map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="mb-3">
//               <label className="form-label">
//                 Lecture
//               </label>

//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="e.g. Lecture 2"
//                 value={lecture}
//                 onChange={(e) =>
//                   setLecture(e.target.value)
//                 }
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">
//                 Lecture Link
//               </label>

//               <input
//                 type="url"
//                 className="form-control"
//                 placeholder="Paste lecture link"
//                 value={link}
//                 onChange={(e) =>
//                   setLink(e.target.value)
//                 }
//               />
//             </div>

//             <div className="mb-4">
//               <label className="form-label">
//                 Password
//               </label>

//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) =>
//                   setPassword(e.target.value)
//                 }
//               />
//             </div>

//             <button
//               type="submit"
//               className="btn btn-primary"
//             >
//               Add Lecture
//             </button>

//           </form>

//         </div>
//       </div>

//     </div>
//   );
// }

// export default Admin;

import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";

import {
  addDoc,
  collection,
  getDocs,
  deleteField,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { signOut } from "firebase/auth";

function Admin() {
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

  const [subject, setSubject] = useState("Computer Graphics");
  const [doctor, setDoctor] = useState("Yasmin");
  const [lecture, setLecture] = useState("");
  const [link, setLink] = useState("");
  const [password, setPassword] = useState("");

  const [lectures, setLectures] = useState([]);

  const [selectedSubject, setSelectedSubject] =
    useState(null);

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const [editingId, setEditingId] = useState(null);

  const [editSubject, setEditSubject] =
    useState("");

  const [editDoctor, setEditDoctor] =
    useState("");

  const [editLecture, setEditLecture] =
    useState("");

  const [editLink, setEditLink] =
    useState("");

  const [editPassword, setEditPassword] =
    useState("");

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "lectures")
      );

      const data = querySnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setLectures(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubjectChange = (value) => {
    setSubject(value);

    const subjectDoctors = doctors[value] || [];

    if (subjectDoctors.length > 0) {
      setDoctor(subjectDoctors[0]);
    } else {
      setDoctor("");
    }
  };

  const addLecture = async (e) => {
    e.preventDefault();

    if (!lecture || !link) {
      alert("Please enter lecture name and link.");
      return;
    }

    try {
      const newLecture = {
        subject,
        lecture,
        link,
        password,
      };

      if (doctors[subject]) {
        newLecture.doctor = doctor;
      }

      await addDoc(
        collection(db, "lectures"),
        newLecture
      );

      alert("Lecture added successfully!");

      setLecture("");
      setLink("");
      setPassword("");

      await fetchLectures();
    } catch (error) {
      console.error(error);
      alert("Error adding lecture.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);

    setEditSubject(item.subject || "");

    setEditDoctor(item.doctor || "");

    setEditLecture(
      item.lecture || item.title || ""
    );

    setEditLink(item.link || "");

    setEditPassword(item.password || "");
  };

  const cancelEdit = () => {
    setEditingId(null);

    setEditSubject("");
    setEditDoctor("");
    setEditLecture("");
    setEditLink("");
    setEditPassword("");
  };

  const handleEditSubjectChange = (value) => {
    setEditSubject(value);

    const subjectDoctors = doctors[value] || [];

    if (subjectDoctors.length > 0) {
      setEditDoctor(subjectDoctors[0]);
    } else {
      setEditDoctor("");
    }
  };

  const saveEdit = async (id) => {
    if (!editLecture || !editLink) {
      alert("Please enter lecture name and link.");
      return;
    }

    try {
      const updatedData = {
        subject: editSubject,
        lecture: editLecture,
        link: editLink,
        password: editPassword,
      };

      if (doctors[editSubject]) {
        updatedData.doctor = editDoctor;
      } else {
        updatedData.doctor = deleteField();
      }

      await updateDoc(
        doc(db, "lectures", id),
        updatedData
      );

      alert("Lecture updated successfully!");

      cancelEdit();

      await fetchLectures();
    } catch (error) {
      console.error(error);
      alert("Error updating lecture.");
    }
  };

  const deletePassword = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the password?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await updateDoc(
        doc(db, "lectures", id),
        {
          password: deleteField(),
        }
      );

      alert("Password deleted successfully!");

      await fetchLectures();
    } catch (error) {
      console.error(error);
      alert("Error deleting password.");
    }
  };

  const deleteLecture = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lecture completely?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "lectures", id)
      );

      alert("Lecture deleted successfully!");

      await fetchLectures();
    } catch (error) {
      console.error(error);
      alert("Error deleting lecture.");
    }
  };

  const changeDoctor = async (item) => {
    const subjectDoctors =
      doctors[item.subject] || [];

    if (subjectDoctors.length === 0) {
      alert(
        "This subject does not have doctors."
      );
      return;
    }

    const currentDoctor =
      item.doctor || "";

    const newDoctor = window.prompt(
      `Enter doctor name:\n${subjectDoctors.join(
        " / "
      )}`,
      currentDoctor
    );

    if (!newDoctor) {
      return;
    }

    if (!subjectDoctors.includes(newDoctor)) {
      alert(
        "Please enter one of the available doctors."
      );
      return;
    }

    try {
      await updateDoc(
        doc(db, "lectures", item.id),
        {
          doctor: newDoctor,
        }
      );

      alert("Doctor changed successfully!");

      await fetchLectures();
    } catch (error) {
      console.error(error);
      alert("Error changing doctor.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const subjectLectures = lectures.filter(
    (item) =>
      item.subject === selectedSubject
  );

  const selectedDoctorLectures =
    subjectLectures.filter(
      (item) =>
        item.doctor === selectedDoctor
    );

  const subjectDoctors =
    doctors[selectedSubject] || [];

  const openSubject = (subjectName) => {
    setSelectedSubject(subjectName);
    setSelectedDoctor(null);
  };

  const backToSubjects = () => {
    setSelectedSubject(null);
    setSelectedDoctor(null);
  };

  const backToDoctors = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>⚙️ Admin Panel</h1>

          <p className="text-muted mb-0">
            Manage lectures and passwords
          </p>
        </div>

        <button
          className="btn btn-danger"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* ADD LECTURE */}

      <div className="card shadow-sm mb-5">
        <div className="card-body">

          <h3 className="mb-4">
            ➕ Add Lecture
          </h3>

          <form onSubmit={addLecture}>

            <div className="row g-3">

              <div className="col-md-6">

                <label className="form-label">
                  Subject
                </label>

                <select
                  className="form-select"
                  value={subject}
                  onChange={(e) =>
                    handleSubjectChange(
                      e.target.value
                    )
                  }
                >
                  {subjects.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>

              </div>

              {doctors[subject] && (
                <div className="col-md-6">

                  <label className="form-label">
                    Doctor
                  </label>

                  <select
                    className="form-select"
                    value={doctor}
                    onChange={(e) =>
                      setDoctor(e.target.value)
                    }
                  >
                    {doctors[subject].map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          Dr. {item}
                        </option>
                      )
                    )}
                  </select>

                </div>
              )}

              <div className="col-md-6">

                <label className="form-label">
                  Lecture Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={lecture}
                  onChange={(e) =>
                    setLecture(e.target.value)
                  }
                  placeholder="Example: Lecture 1"
                />

              </div>

              <div className="col-md-6">

                <label className="form-label">
                  Lecture Link
                </label>

                <input
                  type="url"
                  className="form-control"
                  value={link}
                  onChange={(e) =>
                    setLink(e.target.value)
                  }
                  placeholder="https://..."
                />

              </div>

              <div className="col-md-6">

                <label className="form-label">
                  Password
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Optional"
                />

              </div>

              <div className="col-12">

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  ➕ Add Lecture
                </button>

              </div>

            </div>

          </form>

        </div>
      </div>

      {/* SUBJECTS */}

      {!selectedSubject ? (
        <>
          <h3 className="mb-4">
            📚 Subjects
          </h3>

          <div className="row g-4">

            {subjects.map((item) => {

              const count =
                lectures.filter(
                  (lecture) =>
                    lecture.subject === item
                ).length;

              return (
                <div
                  className="col-md-6 col-lg-4"
                  key={item}
                >

                  <div
                    className="folder"
                    onClick={() =>
                      openSubject(item)
                    }
                  >

                    <div className="folder-icon">
                      📁
                    </div>

                    <div>
                      <h5>{item}</h5>

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
          {/* BACK */}

          <button
            className="btn btn-outline-secondary mb-4"
            onClick={backToSubjects}
          >
            ← Back to Subjects
          </button>

          <h2 className="mb-4">
            📁 {selectedSubject}
          </h2>

          {/* SUBJECT HAS DOCTORS */}

          {subjectDoctors.length > 0 ? (

            selectedDoctor ? (

              <>
                <button
                  className="btn btn-outline-secondary mb-4"
                  onClick={backToDoctors}
                >
                  ← Back to Doctors
                </button>

                <h3 className="mb-4">
                  👩‍🏫 Dr. {selectedDoctor}
                </h3>

                {selectedDoctorLectures.length ===
                0 ? (

                  <div className="text-center text-muted py-5">
                    <h4>
                      📚 No lectures yet
                    </h4>
                  </div>

                ) : (

                  <div className="row g-4">

                    {selectedDoctorLectures.map(
                      (item) => (

                        <div
                          className="col-md-6 col-lg-4"
                          key={item.id}
                        >

                          {editingId ===
                          item.id ? (

                            <div className="card shadow-sm">

                              <div className="card-body">

                                <h5 className="mb-3">
                                  ✏️ Edit Lecture
                                </h5>

                                <div className="mb-3">

                                  <label className="form-label">
                                    Subject
                                  </label>

                                  <select
                                    className="form-select"
                                    value={
                                      editSubject
                                    }
                                    onChange={(e) =>
                                      handleEditSubjectChange(
                                        e.target.value
                                      )
                                    }
                                  >

                                    {subjects.map(
                                      (item) => (
                                        <option
                                          key={item}
                                          value={item}
                                        >
                                          {item}
                                        </option>
                                      )
                                    )}

                                  </select>

                                </div>

                                {doctors[
                                  editSubject
                                ] && (

                                  <div className="mb-3">

                                    <label className="form-label">
                                      Doctor
                                    </label>

                                    <select
                                      className="form-select"
                                      value={
                                        editDoctor
                                      }
                                      onChange={(e) =>
                                        setEditDoctor(
                                          e.target.value
                                        )
                                      }
                                    >

                                      {doctors[
                                        editSubject
                                      ].map(
                                        (item) => (
                                          <option
                                            key={item}
                                            value={
                                              item
                                            }
                                          >
                                            Dr. {item}
                                          </option>
                                        )
                                      )}

                                    </select>

                                  </div>

                                )}

                                <div className="mb-3">

                                  <label className="form-label">
                                    Lecture Name
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      editLecture
                                    }
                                    onChange={(e) =>
                                      setEditLecture(
                                        e.target.value
                                      )
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
                                    value={
                                      editLink
                                    }
                                    onChange={(e) =>
                                      setEditLink(
                                        e.target.value
                                      )
                                    }
                                  />

                                </div>

                                <div className="mb-3">

                                  <label className="form-label">
                                    Password
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      editPassword
                                    }
                                    onChange={(e) =>
                                      setEditPassword(
                                        e.target.value
                                      )
                                    }
                                  />

                                </div>

                                <div className="d-flex gap-2">

                                  <button
                                    className="btn btn-success"
                                    onClick={() =>
                                      saveEdit(
                                        item.id
                                      )
                                    }
                                  >
                                    💾 Save
                                  </button>

                                  <button
                                    className="btn btn-secondary"
                                    onClick={
                                      cancelEdit
                                    }
                                  >
                                    Cancel
                                  </button>

                                </div>

                              </div>

                            </div>

                          ) : (

                            <div className="card shadow-sm">

                              <div className="card-body">

                                <div className="mb-3">
                                  <h5>
                                    {item.lecture ||
                                      item.title}
                                  </h5>

                                  <p className="text-muted mb-1">
                                    👩‍🏫 Dr.{" "}
                                    {item.doctor ||
                                      "Not assigned"}
                                  </p>

                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    🔗 Open Lecture
                                  </a>
                                </div>

                                <div className="mb-3">

                                  {item.password ? (

                                    <div>
                                      🔐{" "}
                                      <strong>
                                        {
                                          item.password
                                        }
                                      </strong>
                                    </div>

                                  ) : (

                                    <div className="text-muted">
                                      🔒 No password
                                    </div>

                                  )}

                                </div>

                                <div className="d-flex flex-wrap gap-2">

                                  <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() =>
                                      startEdit(
                                        item
                                      )
                                    }
                                  >
                                    ✏️ Edit
                                  </button>

                                  <button
                                    className="btn btn-info btn-sm"
                                    onClick={() =>
                                      changeDoctor(
                                        item
                                      )
                                    }
                                  >
                                    👩‍🏫 Change Doctor
                                  </button>

                                  {item.password && (
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={() =>
                                        deletePassword(
                                          item.id
                                        )
                                      }
                                    >
                                      🔒 Delete Password
                                    </button>
                                  )}

                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      deleteLecture(
                                        item.id
                                      )
                                    }
                                  >
                                    🗑️ Delete Lecture
                                  </button>

                                </div>

                              </div>

                            </div>

                          )}

                        </div>

                      )
                    )}

                  </div>

                )}

              </>

            ) : (

              <div className="row g-4">

                {subjectDoctors.map((item) => {

                  const count =
                    lectures.filter(
                      (lecture) =>
                        lecture.subject ===
                          selectedSubject &&
                        lecture.doctor === item
                    ).length;

                  return (
                    <div
                      className="col-md-6 col-lg-4"
                      key={item}
                    >

                      <div
                        className="folder"
                        onClick={() =>
                          setSelectedDoctor(
                            item
                          )
                        }
                      >

                        <div className="folder-icon">
                          👩‍🏫
                        </div>

                        <div>
                          <h5>
                            Dr. {item}
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
                })}

              </div>

            )

          ) : (

            /* SUBJECT WITHOUT DOCTORS */

            <div className="row g-4">

              {subjectLectures.length === 0 ? (

                <div className="text-center text-muted py-5">

                  <h4>
                    📚 No lectures yet
                  </h4>

                </div>

              ) : (

                subjectLectures.map((item) => (

                  <div
                    className="col-md-6 col-lg-4"
                    key={item.id}
                  >

                    {editingId === item.id ? (

                      <div className="card shadow-sm">

                        <div className="card-body">

                          <h5 className="mb-3">
                            ✏️ Edit Lecture
                          </h5>

                          <div className="mb-3">

                            <label className="form-label">
                              Subject
                            </label>

                            <select
                              className="form-select"
                              value={editSubject}
                              onChange={(e) =>
                                handleEditSubjectChange(
                                  e.target.value
                                )
                              }
                            >

                              {subjects.map(
                                (subjectItem) => (
                                  <option
                                    key={
                                      subjectItem
                                    }
                                    value={
                                      subjectItem
                                    }
                                  >
                                    {subjectItem}
                                  </option>
                                )
                              )}

                            </select>

                          </div>

                          {doctors[
                            editSubject
                          ] && (

                            <div className="mb-3">

                              <label className="form-label">
                                Doctor
                              </label>

                              <select
                                className="form-select"
                                value={editDoctor}
                                onChange={(e) =>
                                  setEditDoctor(
                                    e.target.value
                                  )
                                }
                              >

                                {doctors[
                                  editSubject
                                ].map(
                                  (doctorItem) => (
                                    <option
                                      key={
                                        doctorItem
                                      }
                                      value={
                                        doctorItem
                                      }
                                    >
                                      Dr.{" "}
                                      {
                                        doctorItem
                                      }
                                    </option>
                                  )
                                )}

                              </select>

                            </div>

                          )}

                          <div className="mb-3">

                            <label className="form-label">
                              Lecture Name
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={
                                editLecture
                              }
                              onChange={(e) =>
                                setEditLecture(
                                  e.target.value
                                )
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
                              value={editLink}
                              onChange={(e) =>
                                setEditLink(
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div className="mb-3">

                            <label className="form-label">
                              Password
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={
                                editPassword
                              }
                              onChange={(e) =>
                                setEditPassword(
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div className="d-flex gap-2">

                            <button
                              className="btn btn-success"
                              onClick={() =>
                                saveEdit(
                                  item.id
                                )
                              }
                            >
                              💾 Save
                            </button>

                            <button
                              className="btn btn-secondary"
                              onClick={
                                cancelEdit
                              }
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      </div>

                    ) : (

                      <div className="card shadow-sm">

                        <div className="card-body">

                          <h5>
                            {item.lecture ||
                              item.title}
                          </h5>

                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            🔗 Open Lecture
                          </a>

                          <div className="my-3">

                            {item.password ? (

                              <div>
                                🔐{" "}
                                <strong>
                                  {
                                    item.password
                                  }
                                </strong>
                              </div>

                            ) : (

                              <div className="text-muted">
                                🔒 No password
                              </div>

                            )}

                          </div>

                          <div className="d-flex flex-wrap gap-2">

                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() =>
                                startEdit(
                                  item
                                )
                              }
                            >
                              ✏️ Edit
                            </button>

                            {item.password && (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                  deletePassword(
                                    item.id
                                  )
                                }
                              >
                                🔒 Delete Password
                              </button>
                            )}

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                deleteLecture(
                                  item.id
                                )
                              }
                            >
                              🗑️ Delete Lecture
                            </button>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                ))

              )}

            </div>

          )}

        </>
      )}

    </div>
  );
}

export default Admin;

