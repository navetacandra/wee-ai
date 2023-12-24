import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <main className="landing-page">
      <h1 className="site-title">Wee AI</h1>
      <p>
        Wee AI provide AI Tools for everyone. Wee AI use API from{" "}
        <a href="https://huggingface.co" target="_blank">
          Huggingface
        </a>{" "}
        for Image Generation and{" "}
        <a href="https://deepinfra.com" target="_blank">
          Deepinfra
        </a>{" "}
        for ChatAI.
      </p>
      <p>
        Wee AI allows you to select an AI Model to use. So you can choose an AI
        model that you think is good to use.
      </p>
      <h2>Try Now</h2>
      <div className="ai-menus">
        <Link to="/chat">Chat AI</Link>
        <Link to="/image">Image Generator</Link>
      </div>
    </main>
  );
}
