import "dotenv/config"
import express from 'express';
import sequelize from "./db.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import "./models/index.js"
import router from "./routes/index.js"
import errorHandler from "./middleware/ErrorHandlingMiddleware.js"

const PORT = process.env.PORT;
const app = express();

app.set("trust proxy", true); // На будущее, если я успею поставить за Cloudflare

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.use(errorHandler) // Замыкающий, обработчик ошибок.


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e)
    }
}

await start()