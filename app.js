const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const bcrypt = require("bcrypt");
const userCollection = require("./mongo");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {
  // Handle GET request
});

// Checking credentials from login page
app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const name = user.name;
        const loginResponse = {
          name: name,
          status: true,
        };
        res.json(loginResponse);
      } else {
        res.json({
          status: false,
        });
      }
    } else {
      res.json({
        status: false,
      });
    }
  } catch (e) {
    res.json("There is some error");
  }
});

// Inserting user data to database from signup page
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const emailExists = await userCollection.findOne({ email: email });

    if (emailExists) {
      res.json({ status: false });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        name: name,
        email: email,
        password: hashedPassword,
      };

      res.json({ status: true });
      await collection.insertMany([userData]);
    }
  } catch (e) {
    res.json("There is some error");
  }
});

app.listen(5000, () => {
  console.log("Backend running at port number 5000");
});


// Handle user logout
app.post("/logout", (req, res) => {
    res.json({ status: true });
  });