const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on assigned PORT");
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// Models
const Watch = require("./models/watch");
const Strap = require("./models/strap");

// Get specific watch by full reference
app.get("/watches/:reference", (req, res) => {
  const inputref = req.params.reference.toUpperCase();

  Watch.findOne({ reference: { $eq: inputref } })
    .then((watch) => {
      if (!watch) {
        console.log('watch could not be located');
        return res.status(404).json({ message: "Watch not located" });
      } else {
        console.log('watch was received');
        res.status(200).json(watch);
      }
    })
    .catch((err) => {
      console.log("Error retrieving watch", err);
      res.status(500).json({ message: "error retrieving watches" });
    });
});

app.get("/watches/similar/:baseReference", async (req, res) => {
  console.log("🚨 Raw incoming baseRef:", req.params.baseReference);

  const baseRef = req.params.baseReference;
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;

  try {
    let query;
    const isFullRef = baseRef.includes("-") || baseRef.includes(".");

    if (isFullRef) {
      // Force exact match using regex with case-insensitive flag
      query = {
        reference: { $regex: `^${baseRef}$`, $options: "i" }
      };
    } else {
      query = {
        reference: {
          $regex: `^${baseRef}[-.]`,
          $options: "i",
        },
      };
    }

    console.log("🔍 Final query:", JSON.stringify(query));

    const watches = await Watch.find(query).skip(skip).limit(limit);
    res.status(200).json(watches);
  } catch (err) {
    console.error("Error retrieving similar references:", err);
    res.status(500).json({ message: "Error fetching similar references" });
  }
});



// Get watches by prefix (shared base like 116200)
app.get("/watches/prefix/:make/:prefix", (req, res) => {
  const make = req.params.make.toLowerCase();
  const prefix = req.params.prefix;
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;

  Watch.find({
    make: { $regex: `^${make}`, $options: "i" },
    reference: { $regex: `^${prefix}`, $options: "i" },
  })
    .skip(skip)
    .limit(limit)
    .then((watches) => {
      res.status(200).json(watches);
    })
    .catch((err) => {
      console.log("Error fetching prefix-matching watches:", err);
      res.status(500).json({ message: "Error fetching watches" });
    });
});

// Get straps for a given reference or lug_width
app.get("/straps/:reference", (req, res) => {
  console.log("here should be the vals", req.params);
  const straps = req.params;
  let vals = straps.reference;
  let newArray = vals.split(",");

  if (newArray[0].length > 3) {
    Strap.find({ reference: { $in: newArray } })
      .then((strap) => {
        res.status(200).json(strap);
      })
      .catch((err) => {
        console.log("Error retrieving straps", err);
        res.status(500).json({ message: "Error retrieving straps" });
      });
  } else {
    Strap.find({ lug_width: { $in: newArray } })
      .then((strap) => {
        res.status(200).json(strap);
        console.log("Relevant straps were located correctly");
      })
      .catch((err) => {
        console.log("Error retrieving straps", err);
        res.status(500).json({ message: "Error retrieving straps" });
      });
  }
});


//WATCHHUB
// WatchHub: Get a full watch by reference for automatic entry
app.get("/watchhub/fetch-by-reference/:reference", async (req, res) => {
  const inputRef = req.params.reference.toUpperCase();

  try {
    const watch = await Watch.findOne({ reference: inputRef });

    if (!watch) {
      console.log('❌ [WatchHub] Watch not found for reference:', inputRef);
      return res.status(404).json({ message: "Watch not found" });
    }

    console.log('✅ [WatchHub] Watch found:', inputRef);
    res.status(200).json(watch);
  } catch (err) {
    console.error("🔥 [WatchHub] Error retrieving watch:", err);
    res.status(500).json({ message: "Server error while retrieving watch" });
  }
});


// Placeholder endpoint for future use
app.get("/straps/:lug_width", (req, res) => {
  console.log("lug widths: ", req.params);
  const lug_width = req.params;
});

