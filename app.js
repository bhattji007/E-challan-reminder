import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userSchema from './models/userSchema.js';
import Mail from './api/mail.js';
import cors from 'cors';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000; // Use PORT from environment if available

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Challan'
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => console.error("MongoDB connection error:", err));

app.post('/api', async (req, res) => {
  try {
    const { email, vehicle } = req.body;
    const formattedVehicle = vehicle.toUpperCase();

    if (formattedVehicle.length !== 10) {
      res.status(405).json({ message: 'Invalid vehicle number length', code: 405 });
      return;
    }

    const existingData = await userSchema.findOne({ email, vehicle: formattedVehicle });

    if (!existingData) {
      const newData = await userSchema.create({ email, vehicle: formattedVehicle });
      const response = await Mail(formattedVehicle, email);

      if (response === 'Email sent successfully!') {
        res.status(201).json({ message: 'Email sent successfully!', code: 201 });
      } else if (response === 'No pending challans.') {
        res.status(202).json({ message: 'No pending challans.', code: 202 });
      } else if (response === 'Challan details not found.') {
        res.status(203).json({ message: 'Challan details not found.', code: 203 });
      } else {
        res.status(301).json({ message: 'Failed to send email.', code: 301 });
      }
    } else {
      res.status(403).json({ message: 'User and vehicle already exist.', code: 403 });
    }
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ message: 'Internal server error', code: 500 });
  }
});

async function myFunction() {
  try {
    const data = await userSchema.find();
    console.log("Function executed!");

    const map = data.map(async (item) => {
      console.log(item.vehicle, item.email);
      await Mail(item.vehicle, item.email);
    });

    await Promise.all(map);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function scheduleFunction(intervalInHours, asyncFunc) {
  const millisecondsPerHour = 60 * 60 * 1000;
  const intervalInMilliseconds = intervalInHours * millisecondsPerHour;

  async function wrapper() {
    try {
      await asyncFunc();
    } catch (error) {
      console.error("Error in scheduled function:", error);
    }
  }

  wrapper();
  setInterval(wrapper, intervalInMilliseconds);
}

const intervalHours = 1;
scheduleFunction(intervalHours, myFunction);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
