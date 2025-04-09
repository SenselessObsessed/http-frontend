import API from "./API";

const api = new API("http://localhost:7070");
// api.getAllTickets(console.log);
// api.getTicketById("2", console.log);
// api.createTicket(
//   {
//     id: "123123123123",
//     name: "Помыть окно",
//     description: "Помыть окно серой тряпкой",
//     status: "false",
//     created: "1744136198000",
//   },
//   console.log,
// );
// api.editTicket({
//   id: "1",
//   name: "Помыть окно",
//   description: "Помыть окно серой тряпкой",
//   status: "false",
//   created: "1744136198000",
// });
// api.deleteTicket("2");

export default class HelpDesc {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static get markup() {
    return `
    <button type="button" class="add-btn">Добавить тикет</button>
    <ul class="tasks"></ul>
    `;
  }

  static get addTaskSelector() {
    return `.add-btn`;
  }

  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;

    const addNewTask = document.querySelector(this.constructor.addTaskSelector);
    window.addEventListener("load", () => {
      const list = document.createElement("ul");
      list.classList.add("tasks");
      api.getAllTickets((tickets) => {
        tickets.forEach((ticket) => {
          let status;
          if (ticket.status === "true") {
            status = "✔";
          } else {
            status = "";
          }
          list.insertAdjacentHTML(
            "beforeend",
            `
            <li class="tasks-task" data-id="${ticket.id}">
              <div class="main-task">
                <div class="done-btn">${status}</div>
                <h2 class="task-text">${ticket.name}</h2>
                <div class="task-date">${ticket.created}</div>
                <div class="edit-btn">✎</div>
                <div class="remove-btn">✘</div>
              </div>
              <div class="description none">${ticket.description}</div>
            </li>
            `,
          );
        });

        const listOnDocument = document.querySelector(".tasks");
        listOnDocument.replaceWith(list);
      });
    });
    document.addEventListener("click", (e) => this.clickOnBody(e));
    addNewTask.addEventListener("click", () => this.onClickAddNewTask());
  }

  onClickAddNewTask() {
    this.parentEl.insertAdjacentHTML(
      "afterbegin",
      `<div class="popover">
				<h2 class="name-popover">Добавить тикет</h2>
				<label for="short-desc">
					<p>Краткое описание</p>
					<input type="text" class="popover-short-desc" />
				</label>
				<label for="all">
					<p>Подробное описание</p>
					<textarea name="all-desc" id="short-desc" class="all-desc"></textarea>
				</label>
				<button class="popover-btn-cancel" type="button">Отмена</button>
				<button class="popover-btn-ok" type="button">Ок</button>
			</div>`,
    );
  }

  clickOnBody(e) {
    if (e.target.classList.contains("popover-btn-cancel")) {
      e.target.closest(".popover").remove();
    }

    if (e.target.classList.contains("popover-btn-ok")) {
      const popover = e.target.closest(".popover");
      const shortDesc = popover.querySelector(".popover-short-desc").value;
      const allDesc = popover.querySelector(".all-desc").value;
      const options = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const today = new Date();
      const formattedDate = today.toLocaleDateString("ru-RU", options);
      const ticket = {
        id: null,
        name: shortDesc,
        description: allDesc,
        status: "false",
        created: formattedDate,
      };
      e.target.closest(".popover").remove();
      api.createTicket(ticket, (res) => {
        const newElement = document.createElement("li");
        newElement.classList.add("tasks-task");
        newElement.dataset.id = res.id;
        newElement.innerHTML = `
        <div class="main-task">
						<div class="done-btn"></div>
						<h2 class="task-text">${shortDesc}</h2>
						<div class="task-date">${formattedDate}</div>
						<div class="edit-btn">✎</div>
						<div class="remove-btn">✘</div>
					</div>
					<div class="description none">${allDesc}</div>
        `;

        document.querySelector(".tasks").append(newElement);
      });
    }

    if (
      !e.target.classList.contains("done-btn") &&
      !e.target.classList.contains("edit-btn") &&
      !e.target.classList.contains("remove-btn")
    ) {
      // XHR = GET desc
      const desc = e.target.closest(".tasks-task");
      if (desc) {
        const descTarget = desc.querySelector(".description");
        descTarget.classList.toggle("none");
        const { id } = desc.dataset;
        api.getTicketById(id, (res) => {
          descTarget.innerText = res.description;
        });
      }
    }

    if (
      e.target.classList.contains("done-btn") &&
      e.target.textContent === "✔"
    ) {
      e.target.textContent = "";
      const task = e.target.closest(".tasks-task");
      const shortDesc = task.querySelector(".task-text").innerText;
      const allDesc = task.querySelector(".description").innerText;
      const formattedDate = task.querySelector(".task-date").innerText;
      const { id } = task.dataset;
      const ticket = {
        id: id,
        name: shortDesc,
        description: allDesc,
        status: "false",
        created: formattedDate,
      };
      api.editTicket(ticket);
    } else if (
      e.target.classList.contains("done-btn") &&
      e.target.textContent === ""
    ) {
      e.target.innerText = "✔";
      const task = e.target.closest(".tasks-task");
      const shortDesc = task.querySelector(".task-text").innerText;
      const allDesc = task.querySelector(".description").innerText;
      const formattedDate = task.querySelector(".task-date").innerText;
      const { id } = task.dataset;
      const ticket = {
        id: id,
        name: shortDesc,
        description: allDesc,
        status: "true",
        created: formattedDate,
      };
      api.editTicket(ticket);
    }

    if (e.target.classList.contains("edit-btn")) {
      const task = e.target.closest(".tasks-task");
      const { id } = task.dataset;
      let status;
      const currentStatus = task.querySelector(".done-btn");
      if (currentStatus.innerText === "") {
        status = "false";
      } else {
        status = "true";
      }
      const shortDesc = task.querySelector(".task-text");
      const allDesc = task.querySelector(".description");
      const formattedTime = task.querySelector(".task-date");
      this.parentEl.insertAdjacentHTML(
        "afterbegin",
        `<div class="popover">
				<h2 class="name-popover">Изменить тикет</h2>
				<label for="short-desc">
					<p>Краткое описание</p>
					<input type="text" class="popover-short-desc" value='${shortDesc.innerText}'/>
				</label>
				<label for="all">
					<p>Подробное описание</p>
					<textarea name="all-desc" id="short-desc" class="all-desc">${allDesc.innerText}</textarea>
				</label>
				<button class="popover-btn-cancel" type="button">Отмена</button>
				<button class="popover-btn-edit" type="button">Ок</button>
			</div>`,
      );
      document
        .querySelector(".popover-btn-edit")
        .addEventListener("click", (e) => {
          const popover = e.target.closest(".popover");
          const popoverShortDesc = popover.querySelector(".popover-short-desc");
          const popoverAllDesc = popover.querySelector(".all-desc");
          shortDesc.innerText = popoverShortDesc.value;
          allDesc.innerText = popoverAllDesc.value;
          popover.remove();
          const ticket = {
            id: id,
            name: popoverShortDesc.value,
            description: popoverAllDesc.value,
            status: status,
            created: formattedTime,
          };
          api.editTicket(ticket);
        });
    }

    if (e.target.classList.contains("remove-btn")) {
      const task = e.target.closest(".tasks-task");
      const { id } = task.dataset;
      this.parentEl.insertAdjacentHTML(
        "afterbegin",
        `<div class="popover popover-delete">
				<h2 class="name-popover">Удалить тикет</h2>
				<p>Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
				<button class="popover-btn-cancel" type="button">Отмена</button>
				<button class="popover-btn-delete" type="button">Ок</button>
			</div>`,
      );

      document
        .querySelector(".popover-btn-delete")
        .addEventListener("click", (e) => {
          const popover = e.target.closest(".popover");
          popover.remove();
          task.remove();
          api.deleteTicket(id);
        });
    }
  }
}
