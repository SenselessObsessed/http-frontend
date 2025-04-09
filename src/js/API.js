export default class API {
  constructor(url) {
    this.url = url;
  }

  getAllTickets(callback) {
    const xhr = new XMLHttpRequest();
    const urlSearch = new URLSearchParams();
    urlSearch.append("method", "allTickets");
    xhr.addEventListener("load", (e) => {
      callback(JSON.parse(e.target.response));
    });
    xhr.open("GET", `${this.url}/?${urlSearch}`);
    xhr.send();
  }

  getTicketById(id, callback) {
    const xhr = new XMLHttpRequest();
    const urlSearch = new URLSearchParams();
    urlSearch.append("method", "ticketById");
    urlSearch.append("id", id);
    xhr.addEventListener("load", (e) => {
      callback(JSON.parse(e.target.response));
    });
    xhr.open("GET", `${this.url}/?${urlSearch}`);
    xhr.send();
  }

  createTicket(ticket, callback) {
    const xhr = new XMLHttpRequest();
    const urlSearch = new URLSearchParams(ticket);
    xhr.addEventListener("load", (e) => {
      callback(JSON.parse(e.target.response));
    });
    xhr.open("POST", `${this.url}/?method=createTicket`);
    xhr.send(urlSearch);
  }

  editTicket(ticket) {
    const xhr = new XMLHttpRequest();
    const urlSearch = new URLSearchParams(ticket);
    xhr.open("PUT", `${this.url}`);
    xhr.send(urlSearch);
  }

  deleteTicket(id) {
    const xhr = new XMLHttpRequest();
    const urlSearch = new URLSearchParams();
    urlSearch.append("method", "removeTicket");
    urlSearch.append("id", id);
    xhr.open("DELETE", `${this.url}/?${urlSearch}`);
    xhr.send();
  }
}
