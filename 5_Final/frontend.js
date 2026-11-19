const server_url = "http://127.0.0.1:3002";

function showToast(message, type = "success") {
  const toastElement = document.getElementById("app-toast");
  document.getElementById("toast-message").textContent = message;
  toastElement.classList.toggle("text-bg-danger", type === "danger");
  toastElement.classList.toggle("text-bg-success", type === "success");
  bootstrap.Toast.getOrCreateInstance(toastElement).show();
}

function setLoading() {
  document.getElementById("students-list").innerHTML = '<div class="empty-state"><div class="spinner-border text-primary" role="status"></div></div>';
  document.getElementById("record-count").textContent = "Loading records...";
}

function escapeHtml(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}

function studentRow(student) {
  return `<tr id="${student.id}">
    <td><span class="id-badge">#${escapeHtml(student.id)}</span></td>
    <td class="fw-semibold" id="lastname_${student.id}">${escapeHtml(student.lastname)}</td>
    <td id="firstname_${student.id}">${escapeHtml(student.firstname)}</td>
    <td id="emailaddr_${student.id}"><a class="email-link" href="mailto:${escapeHtml(student.emailaddr)}">${escapeHtml(student.emailaddr)}</a></td>
    <td><div class="d-flex justify-content-end gap-2">
      <button class="btn btn-sm btn-edit" type="button" onclick="student_edit(this)" title="Edit student"><i class="bi bi-pencil"></i><span class="d-none d-xl-inline ms-1">Edit</span></button>
      <button class="btn btn-sm btn-delete" type="button" onclick="student_delete(this)" title="Delete student"><i class="bi bi-trash"></i><span class="d-none d-xl-inline ms-1">Delete</span></button>
    </div></td>
  </tr>`;
}

function renderTable(students) {
  document.getElementById("students-list").innerHTML = students.length
    ? `<table class="table align-middle mb-0"><thead><tr><th>ID</th><th>Last name</th><th>First name</th><th>Email address</th><th class="text-end">Actions</th></tr></thead><tbody>${students.map(studentRow).join("")}</tbody></table>`
    : '<div class="empty-state"><i class="bi bi-person-x"></i><h3 class="h6 mt-3">No students found</h3><p class="text-secondary mb-0">Add a student or refresh the directory.</p></div>';
  document.getElementById("record-count").textContent = `${students.length} ${students.length === 1 ? "record" : "records"}`;
}

async function get_students() {
  setLoading();
  try {
    const response = await fetch(`${server_url}/api/students`);
    if (!response.ok) throw new Error("The backend returned an error.");
    renderTable(await response.json());
  } catch (error) {
    document.getElementById("students-list").innerHTML = '<div class="empty-state"><i class="bi bi-cloud-slash"></i><h3 class="h6 mt-3">Could not load students</h3><p class="text-secondary mb-0">Make sure the API server is running on port 3002.</p></div>';
    document.getElementById("record-count").textContent = "Connection unavailable";
  }
}

async function select_single() {
  const input = document.getElementById("single-student");
  const id = input.value.trim();
  if (!id) return showToast("Enter a student ID.", "danger");
  try {
    const response = await fetch(`${server_url}/api/students/${encodeURIComponent(id)}`);
    if (response.status === 404) return showToast(`Student ${id} was not found.`, "danger");
    if (!response.ok) throw new Error("Could not fetch the student.");
    const result = await response.json();
    const student = Array.isArray(result) ? result[0] : result;
    renderTable([student]);
  } catch (error) {
    showToast(error.message || "Student not found.", "danger");
  } finally {
    input.value = "";
  }
}

function student_edit(button) {
  const row = button.closest("tr");
  const id = row.id;
  const lastname = document.getElementById(`lastname_${id}`).textContent;
  const firstname = document.getElementById(`firstname_${id}`).textContent;
  const email = document.getElementById(`emailaddr_${id}`).textContent;
  row.innerHTML = `<td><span class="id-badge">#${escapeHtml(id)}</span></td>
    <td><input class="form-control form-control-sm" id="lastname_${id}" value="${escapeHtml(lastname)}" required /></td>
    <td><input class="form-control form-control-sm" id="firstname_${id}" value="${escapeHtml(firstname)}" required /></td>
    <td><input class="form-control form-control-sm" id="emailaddr_${id}" type="email" value="${escapeHtml(email)}" required /></td>
    <td><div class="d-flex justify-content-end gap-2"><button class="btn btn-sm btn-success" type="button" onclick="submit_edits(this)"><i class="bi bi-check-lg"></i><span class="d-none d-xl-inline ms-1">Save</span></button><button class="btn btn-sm btn-light border" type="button" onclick="get_students()"><i class="bi bi-x-lg"></i></button></div></td>`;
  document.getElementById(`lastname_${id}`).focus();
}

async function submit_edits(button) {
  const id = button.closest("tr").id;
  const body = {
    lastname: document.getElementById(`lastname_${id}`).value.trim(),
    firstname: document.getElementById(`firstname_${id}`).value.trim(),
    emailaddr: document.getElementById(`emailaddr_${id}`).value.trim()
  };
  if (!body.lastname || !body.firstname || !body.emailaddr) return showToast("Complete all student fields.", "danger");
  try {
    const response = await fetch(`${server_url}/api/students/${encodeURIComponent(id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error(await response.text());
    showToast("Student updated.");
    await get_students();
  } catch (error) {
    showToast(error.message || "Could not update the student.", "danger");
  }
}

async function student_delete(button) {
  const id = button.closest("tr").id;
  if (!confirm(`Delete student #${id}?`)) return;
  try {
    const response = await fetch(`${server_url}/api/students/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) throw new Error(await response.text());
    showToast("Student deleted.");
    await get_students();
  } catch (error) {
    showToast(error.message || "Could not delete the student.", "danger");
  }
}

async function submit_new() {
  const body = {
    firstname: document.getElementById("firstname_new").value.trim(),
    lastname: document.getElementById("lastname_new").value.trim(),
    emailaddr: document.getElementById("emailaddr_new").value.trim()
  };
  if (!body.firstname || !body.lastname || !body.emailaddr) return showToast("Complete all student fields.", "danger");
  try {
    const response = await fetch(`${server_url}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error(await response.text());
    document.getElementById("new-student-form").reset();
    bootstrap.Collapse.getOrCreateInstance(document.getElementById("addStudent")).hide();
    showToast("Student created.");
    await get_students();
  } catch (error) {
    showToast(error.message || "Could not create the student.", "danger");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("new-student-form").addEventListener("submit", event => {
    event.preventDefault();
    submit_new();
  });
  get_students();
});
