const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passpoer = require('passport');


const app = express();
const port = 8001;
const cors = require('cors');
app.use(cors());

mongoose.connect(
    "mongodb+srv://wilsonrc99995:acOA0eYaqxHZmVLB@cluster0.dixcpvi.mongodb.net/",
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to database",err);
});

app.listen(port, () => {
    console.log("Server running on port 8001");
});

app.get('/', (req,res) => {
    res.send('<h1>Hello world</h1>')
})


//models required to format data
const Watch = require("./models/watch");
const Strap = require("./models/strap")



app.get("/watches/:reference", (req,res) => {
    const inputref = req.params.reference

    Watch.findOne({reference : {$eq : inputref}})
        .then((watch) => {
            if(watch == null){
                //watch could not be found
                console.log('watch could not be located')
                return res.status(404).json({message: "Watch not located"})
            } else {
                console.log('watch was received');
                console.log(watch);
                res.status(200).json(watch);
            }
        })
        .catch((err) => {
            console.log("Error retrieving watch", err);
            res.status(500).json({message: "error retrieving watches"})
        })
});

//endpoint to get all the straps associated with a watch by id
app.get("/straps/:reference", (req, res) => {
    console.log("here should be the vals" ,req.params);

    //FUDGE TO TAKE THE REQ PARAMS AND TURN INTO ARRAY IN A HACKY WAY
    // NEEDS BETTER FIX
    const straps = req.params;
    let vals = straps.reference;
    let newArray = vals.split(",");

    // CONDITIONAL REQUEST BASED ON LENGTH OF INPUT VALUE
    //TODO SEE IF WE CAN DO THIS MORE ELEGANTLY...
    //IF THE VALUE IS GREATER IN LENGTH THAN 2, WE MUST BE SEARCHING FOR STRAP REFERENCES

    //IF THE VALUE IS 2 DIGITS OR LESS WE MUST BE SEARCHING FOR LUG WIDTH VALUES 


    if (newArray[0].length > 3) {
        Strap.find({ reference: { $in: newArray }})
        .then((strap) => {
  
          //strap.forEach(printjson);
          res.status(200).json(strap);
        })
        .catch((err) => {
          console.log("Error retrieving straps", err);
          res.status(500).json({ message: "Error retrieving straps" });
        });
    } else {
        Strap.find({ lug_width: { $in: newArray }})
        .then((strap) => {
        //   console.log(strap);
          res.status(200).json(strap);
          console.log("Relevant straps were located correctly");
        })
        .catch((err) => {
          console.log("Error retrieving straps", err);
          res.status(500).json({ message: "Error retrieving straps" });
        });
    }

  });

    //endpoint to allow us to retrieve all straps with a matching lug width
    app.get("/straps/:lug_width", (req, res) => {
        console.log("lug widths: ",req.params);
        const lug_width = req.params;
    
      });
    