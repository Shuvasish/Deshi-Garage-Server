const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();

const port = 4000;
const user = process.env.DB_USER;
const name = process.env.DB_NAME;
const pass = process.env.DB_PASS;
const AdminCol = process.env.DB_COL_ONE;
const ReviewCol = process.env.DB_COL_TWO;
const ServiceCol = process.env.DB_COL_THREE;
const OrderCol = process.env.DB_COL_FOUR;

// console.log(user, name, pass);
// console.log(adminCol, ReviewsCol, ServicesCol);

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri = `mongodb+srv://${user}:${pass}@cluster0.kni9h.mongodb.net/${name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const AdminCollection = client.db(name).collection(AdminCol);
  const ReviewCollection = client.db(name).collection(ReviewCol);
  const ServiceCollection = client.db(name).collection(ServiceCol);
  const OrderCollection = client.db(name).collection(OrderCol);
  // perform actions on the collection object

  // ADD ADMIN
  app.post("/addAdmin", (req, res) => {
    const adminInfo = req.body;
    AdminCollection.insertOne(adminInfo).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(adminInfo);
  });

  //CHECK IsADMIN
  app.get("/isAdmin", (req, res) => {
    const email = req.query.email;
    console.log(email);
    AdminCollection.find({ email }).toArray((err, document) => {
      res.send(document.length > 0);
    });
  });

  // ADD SERVICE
  app.post("/addService", (req, res) => {
    const serviceInfo = req.body;
    ServiceCollection.insertOne(serviceInfo).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(serviceInfo);
  });

  //READ SERVICES
  app.get("/services", (req, res) => {
    ServiceCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  //DELETE SERVICE
  app.delete("/delete/:id", (req, res) => {
    const serviceId = req.params.id;
    console.log(ObjectId(serviceId));
    ServiceCollection.deleteOne({
      _id: ObjectId(serviceId),
    }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  //UPDATE SERVICE
  app.patch("/update/:id", (req, res) => {
    const serviceId = req.params.id;
    const serviceInfo = req.body;
    ServiceCollection.updateOne(
      {
        _id: ObjectId(serviceId),
      },
      {
        $set: serviceInfo,
      }
    ).then((result) => {
      res.send(result.modifiedCount > 0);
    });
    console.log(serviceId);
    console.log(serviceInfo);
    // res.send(serviceId);
  });

  //ADD REVIEW
  app.post("/addReview", (req, res) => {
    const reviewInfo = req.body;
    ReviewCollection.insertOne(reviewInfo).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(reviewInfo);
  });

  //READ REVIEWS
  app.get("/reviews", (req, res) => {
    ReviewCollection.find({}).toArray((err, document) => {
      //   console.log(err);
      res.send(document);
    });
  });

  //ADD ORDER
  app.post("/addOrder", (req, res) => {
    const orderInfo = req.body;
    OrderCollection.insertOne(orderInfo).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(orderInfo);
  });

  //READ ORDERS
  app.post("/orders", (req, res) => {
    const userInfo = req.body.email;
    AdminCollection.find({ email: userInfo }).toArray((err, document) => {
      if (document.length > 0) {
        OrderCollection.find({}).toArray((err, document) => {
          res.send(document);
        });
      } else {
        OrderCollection.find({}).toArray((err, document) => {
          const orders = document.filter((doc) => {
            return doc.data[0].email === userInfo;
          });
          //   console.log(orders, "hoccheki");
          res.send(orders);
        });
      }
    });
    console.log(userInfo);
  });

  //UPDATE ORDER STATUS
  app.patch("/updateOrder/:id", (req, res) => {
    const orderId = req.params.id;
    const orderInfo = req.body;
    OrderCollection.updateOne(
      {
        _id: ObjectId(orderId),
      },
      {
        $set: orderInfo,
      }
    ).then((result) => {
      res.send(result.modifiedCount > 0);
    });
    // console.log(orderId);
    // console.log(orderInfo);
  });

  //Test
  app.get("/", (req, res) => {
    res.send("paichi");
  });
  console.log("connected to db");
  //   client.close();
});

app.listen(process.env.PORT || port, () => {
  console.log("listen on " + port);
});
