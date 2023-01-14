import Head from "next/head";
import React from "react";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function onSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }
    setLoading(true);
    setResult("");
    const response = await fetch("/api/generate-mechanic-tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ make, model, year, issue }),
      });
  
    const data = await response.json();
    setResult(data.result.replaceAll("\n", "<br />"));
    setLoading(false);
  }

  const handleRecommendationClick = async (recommendation) => {
    setLoading(true);
    setDetails("");
    const response = await fetch(`/api/generate-mechanic-recommendation-details?recommendation=${recommendation}`);
    const data = await response.json();
    setDetails(data.result);
    setLoading(false);
  };

// the rest of the code goes here

  return (
    <div>
      <Head>
        <title>Car Mechanic Recommendations</title>
        <link rel="icon" href="/car.png" />
      </Head>

      <main className={styles.main}>
        <h3>Car Mechanic Recommendations 🚗 🔧</h3>
        <form onSubmit={onSubmit}>
          <label>Make</label>
          <input
            type="text"
            name="make"
            placeholder="Enter the make of your car"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />

          <label>Model</label>
          <input
            type="text"
            name="model"
            placeholder="Enter the model of your car"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <label>Year</label>
          <input
            type="number"
            name="year"
            placeholder="Enter the year of your car"
            value={year}
            onChange={(e) => setYear(Number.parseInt(e.target.value))}
          />

          <label>Issue Description</label>
          <textarea 
            rows="5" 
            cols="50"
            type="text"
            name="issue"
            placeholder="Enter a description of the issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            onBlur={(e) => {
              if(e.target.value.length < 100 || e.target.value.length > 500){
                alert("Issue Description should be between 100 and 500 characters");
              }
            }}
          />
          <input type="submit" value="Generate Recommendations" />
        </form>
        {loading && (
          <div>
            <h3>Searching for recommendations 🚗 🔧</h3>
            <img src="/loading.webp" className={styles.loading} />
          </div>
        )}
        <div
          className={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </main>
    </div>
  );
}
         
