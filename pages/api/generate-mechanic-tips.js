import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { make, model, year, issue } = req.body;
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(make, model, year, issue),
    temperature: 0,
    max_tokens: 3000,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(make, model, year, issue) {
  return `What are the top 10 causes for ${issue} on a ${make} ${model} ${year}? Under each cause describe in detail why that was chosen and how it can be checked. Return in a report format, with these sections: Car Details (Make, model, year, engine, oil type & capacity, oil filter, transmission, tranmission oil tyoe & capacity, windshield wiper sizes, weight, dimensions, tire size), Issue Sumarization, Causes, Additional Suggestions. If the issue does not make sense, indicate why and do not generate a report. Reutrn everything in HTML.`;
}
