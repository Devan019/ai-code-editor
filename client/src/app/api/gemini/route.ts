import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// const sempleTest = "```json\n{\n  \"html\": \"<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n    <meta charset=\\\"UTF-8\\\">\\n    <meta name=\\\"viewport\\\" content=\\\"width=device-width, initial-scale=1.0\\\">\\n    <title>Dark Mode Toggle</title>\\n    <style>\\n        /* CSS will be injected here by the application */\\n    </style>\\n</head>\\n<body data-theme=\\\"light\\\">\\n    <button id=\\\"theme-toggle\\\">Toggle Dark Mode</button>\\n    <h1>Hello</h1>\\n    <p>This is some content to demonstrate the dark mode.</p>\\n    <script>\\n        /* JavaScript will be injected here by the application */\\n    </script>\\n</body>\\n</html>\",\n  \"css\": \":root {\\n    --background-color: #ffffff;\\n    --text-color: #333333;\\n    --button-bg: #eeeeee;\\n    --button-text: #333333;\\n}\\n\\nbody[data-theme=\\\"dark\\\"] {\\n    --background-color: #333333;\\n    --text-color: #eeeeee;\\n    --button-bg: #555555;\\n    --button-text: #eeeeee;\\n}\\n\\nbody {\\n    font-family: Arial, sans-serif;\\n    background-color: var(--background-color);\\n    color: var(--text-color);\\n    transition: background-color 0.3s ease, color 0.3s ease;\\n    margin: 20px;\\n    padding-top: 60px; /* Space for the toggle button */\\n}\\n\\nh1, p {\\n    color: var(--text-color);\\n}\\n\\n#theme-toggle {\\n    position: absolute;\\n    top: 20px;\\n    right: 20px;\\n    padding: 10px 15px;\\n    border: none;\\n    border-radius: 5px;\\n    cursor: pointer;\\n    background-color: var(--button-bg);\\n    color: var(--button-text);\\n    font-size: 16px;\\n    transition: background-color 0.3s ease, color 0.3s ease;\\n}\\n\\n#theme-toggle:hover {\\n    opacity: 0.9;\\n}\",\n  \"js\": \"document.addEventListener('DOMContentLoaded', () => {\\n    const themeToggle = document.getElementById('theme-toggle');\\n    const body = document.body;\\n\\n    // Function to set the theme\\n    const setTheme = (theme) => {\\n        body.setAttribute('data-theme', theme);\\n        localStorage.setItem('theme', theme);\\n    };\\n\\n    // Check for saved theme in localStorage on page load\\n    const savedTheme = localStorage.getItem('theme');\\n    if (savedTheme) {\\n        setTheme(savedTheme);\\n    } else {\\n        // Default to light mode if no theme is saved\\n        setTheme('light');\\n    }\\n\\n    // Toggle theme on button click\\n    themeToggle.addEventListener('click', () => {\\n        const currentTheme = body.getAttribute('data-theme');\\n        const newTheme = currentTheme === 'light' ? 'dark' : 'light';\\n        setTheme(newTheme);\\n    });\\n});\"\n}\n```"

export async function POST(req: NextRequest) {
  try {
    const { prompt, code } = await req.json();

    const newPrompt = `
You are a code generator.
Generate the output strictly in JSON format with three fields: "html", "css", "js".
Do not include explanations or extra text outside the JSON.
Prompt/Task: ${prompt}
Additional Code (if provided): ${code || ""}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: newPrompt }] }],
    });

    if(!response.text) {
      throw new Error("No response text");
    }

    const text = response.text.trim().replace("```json","").replace("```","").trim();
    const json = JSON.parse(text);
    return NextResponse.json(json);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
