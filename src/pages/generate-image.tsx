/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ImgModels, ImgResult, imgModels } from "../utils/types";
import generateImage from "../utils/hf_img";
import '../styles/image.css';

type GeneratedImg = {
  censored: boolean;
  model: string;
  img: string;
} | null;

export default function GenerateImage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const dimension = [
  //   {
  //     name: 'square',
  //     ratio: 1/1,
  //     width: 1024,
  //     height: 1024,
  //   },
  //   {
  //     name: 'portrait',
  //     ratio: 9/16,
  //     width: 576,
  //     height: 1024,
  //   },
  //   {
  //     name: 'landscape',
  //     ratio: 16/9,
  //     windth: 1024,
  //     height: 576,
  //   },
  // ];

  const [modelLoaded, setModelLoaded] = useState(false);
  const [models, setModels] = useState([] as string[]);
  const [selectedModel, setSelectedModel] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [resultsLoadCounter, setResultsLoadCounter] = useState(-1);
  const [resultsLoaded, setResultsLoaded] = useState(true);
  const [results, setResults] = useState([] as ImgResult[]);
  const [errorMessage, setErrorMessage] = useState("");

  function loadModel() {
    if (modelLoaded) return;
    setModels(imgModels);
    setModelLoaded(true);
  }

  async function generate(e: any) {
    e.preventDefault();
    if (resultsLoadCounter > -1) return;
    let intvl;
    try {
      setErrorMessage("");
      setResults([]);
      setResultsLoaded(false);

      let i = 0;
      setResultsLoadCounter(0);
      intvl = setInterval(() => {
        i += 1;
        setResultsLoadCounter(i);
      }, 1000);

      const res = await generateImage(
        {
          prompt,
          model: models[selectedModel] as ImgModels,
          amount: 4,
        },
        setResults,
        setResultsLoaded
      );
      
      if (res.code != 200) {
        setErrorMessage(res.data.message ?? "");
      }
    } catch (err) {
      setErrorMessage(`Error: ${err}`);
    } finally {
      setResultsLoaded(true);
      clearInterval(intvl);
      setResultsLoadCounter(-1);
    }
  }

  function downloadImg(url: string) {
    const dowloadTag = document.createElement("a");
    dowloadTag.href = url;
    dowloadTag.download = "image.jpg";
    dowloadTag.click();
    dowloadTag.remove();
  }

  useEffect(() => {
    loadModel();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main>
        <div className="generator-form">
          <h1 className="title">Lets Generate Image</h1>
          <div className="model-selection">
            <label htmlFor="model">Select Generation Model</label>
            <select
              name="model"
              id="model"
              onChange={(el) => setSelectedModel(Number(el.target.value))}
              value={selectedModel}
            >
              {models.map((el, i) =>
                selectedModel == i ? (
                  <option key={i} value={i}>
                    {el}
                  </option>
                ) : (
                  <option key={i} value={i}>
                    {el}
                  </option>
                )
              )}
            </select>
          </div>
          <form className="input-form" onSubmit={generate}>
            <label htmlFor="prompt"></label>
            <input
              type="text"
              name="prompt"
              id="prompt"
              placeholder="Write prompt..."
              onChange={(e) => setPrompt(e.target.value)}
            />
            {resultsLoadCounter > -1 ? (
              <button type="submit" disabled>
                Loading
              </button>
            ) : (
              <button type="submit">Generate</button>
            )}
          </form>
        </div>
        <div className="img-results">
          {!resultsLoaded ? (
            <div className="img-loading">
              <div className="spinner"></div>
              <p>{resultsLoadCounter} S</p>
            </div>
          ) : errorMessage.length > 1 ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
            results.map((el: GeneratedImg, i) => {
              if (el == null) {
                return (
                  <div className="img-container" key={i}>
                    <p className="img-label">SERVER ERROR</p>
                  </div>
                );
              } else if (el.censored) {
                return (
                  <div className="img-container" key={i}>
                    <p className="img-label">CENSORED</p>
                  </div>
                );
              }

              return (
                <div className="img-container" key={i}>
                  <img
                    src={el.img}
                    alt={`${prompt} [${i + 1}]`}
                    loading="lazy"
                  />
                  <div className="img-tooltip">
                    <svg
                      onClick={() => downloadImg(el.img)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="download-img-btn"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
