

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const projectsGrid = document.getElementById("projectsGrid");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

// 1. Mobile navigation
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// 2. Load projects from FastAPI backend
async function loadProjects() {
  if (!projectsGrid) return;

  try {
    const response = await fetch("/api/projects");

    if (!response.ok) {
      throw new Error("Could not load projects");
    }

    const projects = await response.json();
    projectsGrid.replaceChildren();

    projects.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "project-card";

      const number = document.createElement("div");
      number.className = "project-number";
      number.textContent = `0${index + 1} / PROJECT`;

      const title = document.createElement("h3");
      title.textContent = project.title || "Untitled Project";

      const description = document.createElement("p");
      description.textContent = project.description || "";

      const techList = document.createElement("div");
      techList.className = "tech-list";

      (project.tech || []).forEach((technology) => {
        const tag = document.createElement("span");
        tag.textContent = technology;
        techList.appendChild(tag);
      });

      const link = document.createElement("a");
      link.className = "project-link";
      link.href = project.github || "#";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "GitHub profile ↗";

      card.append(number, title, description, techList, link);
      projectsGrid.appendChild(card);
    });

    if (projects.length === 0) {
      projectsGrid.textContent = "No projects available yet.";
    }
  } catch (error) {
    projectsGrid.textContent =
      "Projects could not load. Please check that the server is running.";
    console.error("Projects error:", error);
  }
}

// 3. Submit contact form to FastAPI
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.textContent = "Sending message...";
    formStatus.className = "form-status";

    const formData = new FormData(contactForm);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(result.detail)
          ? result.detail.map((item) => item.msg).join(", ")
          : result.detail || "Please check the form and try again.";

        throw new Error(detail);
      }

      formStatus.textContent =
        result.message || "Message sent successfully!";
      formStatus.className = "form-status success";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent =
        error.message || "Could not send the message.";
      formStatus.className = "form-status error";
      console.error("Contact form error:", error);
    }
  });
}

// Start loading projects
loadProjects();
