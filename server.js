import express from 'express';
import { Pages, tryCatchMiddle } from './pageIndex.mjs';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';

// import { resolver } from './applicationFiles/customGraphql/resolver.mjs';
// import { schema } from './applicationFiles/customGraphql/schema.mjs';
// import { graphqlHTTP } from "express-graphql"


const app = express();
const port = 3000;
const address = "0.0.0.0";
const upload = multer();


// Middleware to handle request and response
app.use(express.json({ limit: '50mb' })); // To handle JSON payloads in POST requests
// app.use(express.text()); // To handle JSON payloads in POST requests
// app.use(express.raw()); // To handle JSON payloads in POST requests
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(upload.none());
// app.use(bodyParser.json());


// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(cookieParser());
app.use(cors("*"))
app.use((req,res,next)=>{
  console.log(req.url)
  next()
})

// app.post("/graphql",graphqlHTTP({
//   schema:schema,
//   rootValue: resolver,
// }))

// app.get("/",(req,res)=>{
//   res.statusCode = 200
//   res.json({'response':'This is agriniri backend server'});
// })

// app.post("/login",(req,res)=>{
//   res.statusCode = 200
//   // console.log(req.params)
//   console.log(req.body)
//   // console.log(req.bodyParser)
//   // console.log(req.query)
//   // console.log(req.json)
  
//   res.json({'response':'in here'})
// })

// Example route to handle all requests
app.all('*', (req, res) => {
  try {
    // console.log(req.url);
    res.setHeader('Content-Type', 'application/json');


    // Try-catch middleware
    tryCatchMiddle(req, res, Pages);
  } catch (e) {
    console.log(e);
    res.status(500).json({ response: `Some error came up >> ${e}` });
  }
});

// Start the server
app.listen(port, address, () => {
  console.log(`Server running at http://${address}:${port}/`);
});


