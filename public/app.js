const form = document.querySelector("#registration-form");
const nameInput = document.querySelector("#name");
const sectionInput = document.querySelector("#section");
const eventInput = document.querySelector("#event");
const submitButton = document.querySelector("#submit-button");
const refreshButton = document.querySelector("#refresh-button");
const formMessage = document.querySelector("#form-message");
const listMessage = document.querySelector("#list-message");
const registrationList = document.querySelector("#registration-list");

function showMessage(element, message, type = "") {
  element.textContent = message;
  element.className = `message ${type}`;
}

function makeCell(value) {
  const cell = document.createElement("td");
  // textContent safely displays user-provided text without interpreting HTML.
  cell.textContent = value;
  return cell;
}

function renderRegistrations(registrations) {
  registrationList.replaceChildren();

  if (registrations.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-cell";
    cell.textContent = "No registrations yet. Add the first student above.";
    row.appendChild(cell);
    registrationList.appendChild(row);
    return;
  }

  registrations.forEach(registration => {
    const row = document.createElement("tr");
    row.appendChild(makeCell(registration.id));
    row.appendChild(makeCell(registration.name));
    row.appendChild(makeCell(registration.section));
    row.appendChild(makeCell(registration.event));

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.id = registration.id;
    deleteButton.setAttribute("aria-label", `Delete registration ${registration.id}`);
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    registrationList.appendChild(row);
  });
}

async function loadRegistrations() {
  showMessage(listMessage, "Loading registrations...");
  refreshButton.disabled = true;

  try {
    const response = await fetch("/api/events");

    if (!response.ok) {
      throw new Error(`Unable to load registrations (HTTP ${response.status}).`);
    }

    const registrations = await response.json();
    renderRegistrations(registrations);
    showMessage(listMessage, `${registrations.length} registration(s) found.`, "success");
  } catch (error) {
    showMessage(listMessage, error.message, "error");
  } finally {
    refreshButton.disabled = false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const registration = {
    name: nameInput.value.trim(),
    section: sectionInput.value.trim(),
    event: eventInput.value
  };

  if (!registration.name || !registration.section || !registration.event) {
    showMessage(formMessage, "Please complete all fields.", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage(formMessage, "Submitting registration...");

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registration)
    });

    const result = response.status === 204 ? null : await response.json();

    if (!response.ok) {
      throw new Error(result?.error || `Request failed (HTTP ${response.status}).`);
    }

    showMessage(formMessage, `Registration added successfully for ${result.name}.`, "success");
    form.reset();
    await loadRegistrations();
  } catch (error) {
    showMessage(formMessage, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

registrationList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;

  const id = button.dataset.id;
  button.disabled = true;
  showMessage(listMessage, "Deleting registration...");

  try {
    const response = await fetch(`/api/events/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    if (response.status === 404) {
      throw new Error("Registration not found. Refresh the list and try again.");
    }

    if (!response.ok) {
      let result = {};
      try { result = await response.json(); } catch {}
      throw new Error(result.error || `Delete failed (HTTP ${response.status}).`);
    }

    showMessage(formMessage, "Registration deleted successfully.", "success");
    await loadRegistrations();
  } catch (error) {
    showMessage(listMessage, error.message, "error");
  } finally {
    button.disabled = false;
  }
});

refreshButton.addEventListener("click", loadRegistrations);

// Load records when the page first opens.
loadRegistrations();
