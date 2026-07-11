require("dotenv").config()
const express = require("express")
const app = express()
const accountRouter = require("./routers/AccountRouter")
const orderRouter = require("./routers/OrderRouter")
const productRouter = require("./routers/ProductRouter")
const mongoose = require("mongoose")
const cors = require("cors")
const rateLimit = require('express-rate-limit')

const port = process.env.PORT || 8080
const db = process.env.DB || "mongodb://localhost:27017/lab0809"
const host = process.env.HOST || "http://localhost:"

app.use(express.urlencoded())
app.use(express.json())
app.use(cors())

app.use("/api/account", accountRouter)
app.use("/api/orders", orderRouter)
app.use("/api/products", productRouter)


const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use('/api/', apiLimiter)

mongoose.connect(host, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Connect successfully");
		app.listen(port, () => { console.log(host + port) })
	})
	.catch((err) => {
		console.log("Connection fail");
		console.log(err);
	});
