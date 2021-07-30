const http = require("http");
const Koa = require("koa");
const app = new Koa();
const koaBody = require("koa-body");
const port = process.env.PORT || 7070; // слушаем определённый порт
const cors = require("@koa/cors");
let moment = require("moment");

class Ticket {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.status = false;
    this.created = moment().format("LLL");
    this.description = description;
    this.getTicket.bind(this);
  }
  getTicket() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      created: this.created,
    };
  }
}

app.use(
  koaBody({
    urlencoded: true,
    multipart: true,
  })
);
//app.use(cors());

let tickets = [
  new Ticket(1627493913588, "Тэстовый", " Что то длинное"),
  new Ticket(1627493913457, "Тэстовы222й", " Что то 333длинное"),
];

app.use(async (ctx) => {
  ctx.response.set({
    "Access-Control-Allow-Origin": "*",
  });
  if (ctx.request.method === "POST") {
    const data = JSON.parse(ctx.request.body);
    switch (data.method) {
      case "createTicket":
        tickets.push(new Ticket(genId(), data.name, false, data.description));
        ctx.response.body = { ok: true };
        break;
      case "editTicket":
        tickets.forEach((item) => {
          if (+item.id === +data.id) {
            item.name = data.name;
            item.description = data.description;
            item.status = data.status;
            ctx.response.body = tickets;
          }
        });

        break;
      default:
        ctx.response.status = 404;
        break;
    }
  } else if (ctx.request.method === "GET") {
    const { method } = ctx.request.query;
    ctx.response.body = tickets;
    let { id } = ctx.request.query;
    switch (method) {
      case "allTickets":
        const newTickets = [];
        tickets.forEach((item) => newTickets.push(item.getTicket()));
        ctx.response.body = newTickets;
        break;
      case "ticketById":
        tickets.forEach((item) => {
          if (+item.id === +id) {
            ctx.response.body = item;
          }
        });
        break;
      case "editStatusId":
        tickets.forEach((item) => {
          if (+item.id === +id) {
            item.status = !item.status;
          }
        });

        ctx.response.body = { ok: true };
        break;
      case "ticketDelId":
        const index = tickets.findIndex((item) => {
          if (+item.id === +id) {
            return true;
          }
        });
        tickets.splice([index], 1);

        ctx.response.body = { ok: true };
        break;
      // TODO: обработка остальных методов
      default:
        ctx.response.status = 404;
        break;
    }
  } else {
    ctx.response.status = 404;
    return;
  }
});

const server = http.createServer(app.callback()).listen(port);

function genId() {
  const id = new Date().getTime();
  return id;
}
