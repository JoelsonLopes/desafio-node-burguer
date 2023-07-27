const express = require("express");
const uuid = require("uuid");

const bodyParser = require("body-parser");

const port = 3005;
const app = express();
app.use(bodyParser.json());
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex((user) => user.id === id);
  if (index < 0) {
    return response.status(404).json({ error: "Order not found" });
  }

  request.orderIndex = index;
  request.orderId = id;

  next();
};

//    RequestMethodUrl
const reqdMethUrl = (request, response, next) => {
  console.log("Request URL:", request.originalUrl);
  console.log("Request Type:", request.method);

  next();
};

app.get("/orders", reqdMethUrl, (request, response) => {
  return response.json(orders);
});

app.post("/orders", reqdMethUrl, (request, response) => {
  const { order, clientName, price, status } = request.body;
  const users = { id: uuid.v4(), order, clientName, price, status };

  orders.push(users);

  return response.status(201).json(users);
});

app.put("/orders/:id", checkOrderId, reqdMethUrl, (request, response) => {
  const { order, clientName, price, status } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  const updateOrder = { id, order, clientName, price, status };

  orders[index] = updateOrder;

  return response.json(updateOrder);
});

app.delete("/orders/:id", checkOrderId, reqdMethUrl, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);

  return response.status(204).json();
});

app.listen(port, () => {
  console.log(`🍔 Server started on port ${port} 🤤`);
});
