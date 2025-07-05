import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/agent", async (req, res) => {
  const { question } = req.body;

  // Şehirleri ve iş kelimelerini listeliyoruz
  const cities = ["Ankara", "İstanbul", "İzmir", "Bursa", "Antalya", "Konya", "Eskişehir", ];
  const keywordsList = ["yazılım", "mühendis", "frontend", "backend", "python", "react", "java", "tester", "sistem", "network"];

  let location = "Türkiye"; // varsayılan
  let keywords = "developer"; // varsayılan

  // Soru içinde geçen şehir varsa onu al
  for (const city of cities) {
    if (question.toLowerCase().includes(city.toLowerCase())) {
      location = city;
      break;
    }
  }

  // Soru içinde geçen iş kelimesi varsa onu al
  for (const word of keywordsList) {
    if (question.toLowerCase().includes(word.toLowerCase())) {
      keywords = word;
      break;
    }
  }
  //aşşağıda ki gerekli yerleri(env) kendi özel bilgilerinizle doldurmanız gereklidir.
  const url = `${process.env.CAREERJET_API_URL}?affid=${process.env.CAREERJET_AFFID}&locale_code=${process.env.CAREERJET_LOCALE}&user_ip=${process.env.CAREERJET_USER_IP}&user_agent=${process.env.CAREERJET_USER_AGENT}&keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}&page=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const firstJob = data.jobs?.[0];

    if (!firstJob) {
      return res.json({ answer: "Herhangi bir iş ilanı bulunamadı." });
    }

    const answer = `İlk iş ilanı: ${firstJob.title} - ${firstJob.company} - ${firstJob.locations} - ${firstJob.url}`;
    return res.json({ answer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Bir hata oluştu." });
  }
});

app.listen(3000, () => {
  console.log("Server çalışıyor 🚀");
});
