const express = require("express");
const RequestParser = require("./utils/requestParser");
const app = express();
const port = process.env.PORT || 9090;
// middlewares
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

// home route
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// main route
app.post("/main", async (req, res) => {
  // setting time_stamp
  const request_start_timestamp = Date.now();
  // getting and validating request body
  const { command } = req.body;
  if (!command) {
    return res.status(400).json(errGen("command must be provided"));
  }
  // parsing request data from command
  const { data: reqData, err: reqErr } = new RequestParser(command).process();
  if (reqErr) {
    return res.status(400).json(errGen(reqErr));
  }
  // creating url
  const url = new URL(reqData.URL);
  // adding query if present
  if (reqData.QUERY) {
    const arr = Object.keys(reqData.QUERY);
    arr.forEach((key) => {
      url.searchParams.set(key, reqData.QUERY[key]);
    });
  }
  // setting fetch options
  let options = { method: reqData.HTTP };
  if (reqData.BODY) {
    options.body = reqData.BODY;
  }
  if (reqData.HEADERS) {
    options.headers = reqData.HEADERS;
  }
  // fetching data
  try {
    const first = await fetch(url, options);
    const second = await first.json();
    const request_stop_timestamp = Date.now();
    const duration = request_stop_timestamp - request_start_timestamp;
    const result = {};
    result.request = {
      query: reqData?.QUERY || {},
      body: reqData?.BODY || {},
      headers: reqData?.HEADERS || {},
      full_url: url,
    };
    result.response = {
      http_status: first.status,
      duration,
      request_start_timestamp,
      request_stop_timestamp,
      response_data: second,
    };
    res.status(200).json(result);
  } catch (error) {
    res.json(errGen(error.message)).status(400);
  }
});


const command =
  "HTTP [method] | URL [URL value] | HEADERS [header json value] | QUERY [query value json] | BODY [body value json]";
const secondCommand = `HTTP GET | URL https://dummyjson.com/quotes/3 | QUERY {"refid": 1920933}`;


app.listen(port, () => console.log(`Running on PORT: ${port}`));

