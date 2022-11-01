const express = require("express");
const app = express();
const { Router } = express;
const path = require("path");
const { receiveMessageOnPort } = require("worker_threads");
const routerProduct = Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//---------------------------------------------------------------------------------
let productos = [];
let msg = { error: "producto no encontrado" };

routerProduct.get("/", (req, res) => {
  res.json(productos);
});
routerProduct.get("/:id", (req, res) => {
  if (productos.indexOf(productos[req.params.id - 1]) === -1) {
    res.json(msg);
  } else {
    res.json(productos[req.params.id - 1]);
  }
});
routerProduct.post("/", (req, res) => {
  if (productos.length > 0) {
    let lastId = productos.reduce(
      (acc, item) => (item.id > acc ? (acc = item.id) : acc),
      0
    );

    let newProduct = {
      id: lastId + 1,
      ...req.body,
    };

    productos.push(newProduct);
    res.json(newProduct);
  } else {
    let newProduct = {
      id: 1,
      ...req.body,
    };

    productos.push(newProduct);
    res.json(newProduct);
  }
});

routerProduct.put("/:id", (req, res) => {
  if (productos.indexOf(productos[req.params.id - 1]) === -1) {
    res.json(msg);
  } else {
    productos[req.params.id - 1].title = req.body.title;
    productos[req.params.id - 1].price = req.body.price;
    productos[req.params.id - 1].thumbnail = req.body.thumbnail;

    res.json(productos[req.params.id - 1]);
  }
});
routerProduct.delete("/:id", (req, res) => {
  productos.splice(req.params.id - 1, 1);
  res.json(productos);
});

//---------------------------------------------------------------------------------
app.use("/api/productos", routerProduct);
//---------------------------------------------------------------------------------

app
  .listen(8080, () => {
    console.log("Servidor corriendo en el puerto 8080");
  })
  .on("error", () => {
    console.log("Ha ocurrido un error");
  });
