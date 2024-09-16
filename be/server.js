import express from "express"; // set "type": "module" in package.json
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors(
    // {
    //     origin: [
    //         "http://localhost:3000",
    //         "http://localhost:3001",
    //         "http://localhost:3002",
    //         "http://localhost:5000",
    //         "http://localhost:8000",
    //         "http://localhost:8080",
    //     ],
    // }
));
app.use(express.json());

// Kết nối tới MongoDB
mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const scoreSchema = new mongoose.Schema({
    name: String,
    size: Number,
    clicks: Number,
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/save-score', async (req, res) => {
    const { name, size, clicks } = req.body;
    const newScore = new Score({ name, size, clicks });
    await newScore.save();
    res.status(201).send('Score saved');
});

// API để lấy 9 kỷ lục click ít nhất của mỗi size (2-10)
app.get('/get-top-scores', async (req, res) => {
    try {
        const topScores = {};

        // Lặp qua từng size từ 2 đến 10 để lấy top 9 kỷ lục ít nhất
        for (let size = 2; size <= 10; size++) {
            const scores = await Score.find({ size })
                .sort({ clicks: 1 }) // Sắp xếp theo số lần click tăng dần
                .limit(9); // Lấy tối đa 9 kết quả

            topScores[size] = scores;
        }

        res.json(topScores); // Trả về kỷ lục của từng size
    } catch (error) {
        console.error('Error fetching top scores:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
