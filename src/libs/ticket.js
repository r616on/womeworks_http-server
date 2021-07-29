import moment from "moment";

export default class Ticket {
  constructor(id, name, status, description) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.created = moment().format("LLL");
    this.description = description;
  }
  getTicket() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      created: this.created,
    };
  }
  getTicketFull() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      created: this.created,
      description: this.description,
    };
  }
}
