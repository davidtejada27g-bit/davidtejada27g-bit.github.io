/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import * as anime from "animejs";
import "./App.css";

function App() {
  const demoRef = useRef(null);
  const squareRef = useRef(null);

  const [unlocked, setUnlocked] = useState(false);
  const [squarePos, setSquarePos] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Target area (heart) in the center-right
  const target = { x: 80, y: 0, r: 40 }; // relative to center

  // Sample questions
  const questions = [
    {
      text: "¿Es usted una chismosa vieja que puso a su novio a hacerle una pagina porque lo vio en un tiktok ?",
      options: ["Si", "No"],
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHJmenZjb2t3bnhsd3lmM2lobHplZWh2ZWRhcXdja2VhdXF5OHpxcSZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/gKHGnB1ml0moQdjhEJ/giphy.gif",
    },
    {
      text: "¿Prefiere chocolates o flores?",
      options: ["Chocolates", "Flores"],
      gif: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bWdramU2bTdlaXh2MjlsdDc4NXg0a3lrM2ZoYjB5Nm95Zmc5ODN0eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DxqLrg8cINwnS/giphy.gif",
    },
    {
      text: "Elija el color (racista)",
      options: ["Blanco", "Negro"],
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzMwNWRkOW94cmdocG5jMDlwbHNoMjUwejhua252bTU5aDFwdDQ0NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QxcSqRe0nllClKLMDn/giphy.gif",
    },
    {
      text: "Elija un color",
      options: ["Rojo", "Amarillo", "Rosado"],
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTRkcjNrb3p0dWZuZmdpbzQ1MHliNWVxbGd0YzY4YWZkcDBhMWR2MiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FnIOl9UZmHF8C3NTtc/giphy.gif",
    },
    {
      text: "¿The Weeknd es infinitamente superior a Harry Styles?",
      options: ["Obvio", "No, te equivocas"],
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTRkcjNrb3p0dWZuZmdpbzQ1MHliNWVxbGd0YzY4YWZkcDBhMWR2MiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Spq2koF9hi9qmOOavS/giphy.gif",
    },
    {
      text: "Elija una comida",
      options: ["Pasta", "Tacos", "Hamburguesa", "Mi novio"],
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHBrNWJrZ2hic2N4NHB0ODlhZ200aHY3ZG00aDN4Z2hubXA5aXZzMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/12uXi1GXBibALC/giphy.gif",
    },
  ];

  const [liarMode, setLiarMode] = useState(false);
  // Track the actual path of questions shown (indices)
  const [questionPath, setQuestionPath] = useState([0]);

  const handleOptionClick = (option) => {
    // Si es la primera pregunta y elige 'No', activar liarMode
    if (step === 0 && option === "No" && !liarMode) {
      setLiarMode(true);
      return;
    }

    let newPath = [...questionPath];
    let nextStep = step + 1;

    if (step === 0) {
      // Siempre mostrar la segunda pregunta después de la primera
      newPath.push(1);
      nextStep = 1;
    } else if (step === 1) {
      // Después de la segunda pregunta, depende de la respuesta
      if (option === questions[1].options[0]) {
        newPath.push(2); // tercera pregunta
        nextStep = 2;
      } else {
        newPath.push(3); // cuarta pregunta
        nextStep = 3;
      }
    } else if (
      (step === 2 && questionPath[2] === 2) ||
      (step === 3 && questionPath[2] === 3)
    ) {
      // Después de la 3ra o 4ta, siempre la 5ta
      newPath.push(4);
      nextStep = 4;
    } else if (step === 4) {
      // Después de la 5ta, siempre la 6ta
      newPath.push(5);
      nextStep = 5;
    } else if (step === 5) {
      // Ya terminó
      nextStep = 5;
    }

    setAnswers([...answers, option]);
    setQuestionPath(newPath);

    // Determinar si es la última pregunta respondida
    let isLast = false;
    if (step === 5) {
      isLast = true;
    }
    if (isLast) {
      setShowCelebration(true);
    } else {
      setStep(nextStep);
    }
  };

  useEffect(() => {
    const $demo = demoRef.current;
    const $square = squareRef.current;
    if (!$demo || !$square) return;
    let bounds = $demo.getBoundingClientRect();
    const refreshBounds = () => (bounds = $demo.getBoundingClientRect());
    // Use animejs createAnimatable and utils.clamp
    const createAnimatable =
      anime.createAnimatable ||
      (anime.default && anime.default.createAnimatable);
    const utils = anime.utils || (anime.default && anime.default.utils);
    if (!createAnimatable || !utils) return;
    const animatableSquare = createAnimatable($square, {
      x: 500,
      y: 500,
      ease: "out(3)",
    });
    const onMouseMove = (e) => {
      const { width, height, left, top } = bounds;
      const squareW = 60;
      const squareH = 60;
      const hw = width / 2;
      const hh = height / 2;
      // Limitar para que el centro del cuadro no salga del área visible
      const minX = -hw + squareW / 2;
      const maxX = hw - squareW / 2;
      const minY = -hh + squareH / 2;
      const maxY = hh - squareH / 2;
      let x = e.clientX - left - hw;
      let y = e.clientY - top - hh;
      x = utils.clamp(x, minX, maxX);
      y = utils.clamp(y, minY, maxY);
      animatableSquare.x(x);
      animatableSquare.y(y);
      setSquarePos({ x, y });
    };
    window.addEventListener("mousemove", onMouseMove);
    $demo.addEventListener("scroll", refreshBounds);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      $demo.removeEventListener("scroll", refreshBounds);
    };
  }, []);

  // Unlock questions if square is in target area
  useEffect(() => {
    if (!unlocked) {
      const dx = squarePos.x - target.x;
      const dy = squarePos.y - target.y;
      if (Math.sqrt(dx * dx + dy * dy) < target.r) {
        setUnlocked(true);
      }
    }
  }, [squarePos, unlocked]);

  return (
    <>
      {!unlocked && (
        <div
          ref={demoRef}
          className="docs-demo is-active"
          style={{
            position: "relative",
            height: 300,
            border: "1px solid #ccc",
            marginBottom: 24,
            background: "#fff0f6",
          }}
        >
          {/* Heart target area */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(${target.x}px, ${target.y}px)`,
              width: target.r * 2,
              height: target.r * 2,
              marginLeft: -target.r,
              marginTop: -target.r,
              pointerEvents: "none",
              zIndex: 1,
              display: unlocked ? "none" : "block",
            }}
          >
            <span
              style={{
                fontSize: 40,
                color: "#ff69b4",
                filter: "drop-shadow(0 0 6px #fff)",
              }}
            >
              ❤️
            </span>
          </div>
          <div
            ref={squareRef}
            className="square"
            style={{
              width: 60,
              height: 60,
              background: "#ff69b4",
              borderRadius: 12,
              position: "absolute",
              left: "50%",
              top: "50%",
              zIndex: 2,
            }}
          />
        </div>
      )}
      <div className="card" style={{ marginBottom: 24, position: "relative" }}>
        {!unlocked ? (
          <div>
            <h2>
              Mueve el cuadro al <span style={{ color: "#ff69b4" }}>❤️</span>{" "}
              para desbloquear las preguntas
            </h2>
          </div>
        ) : !showCelebration ? (
          <div>
            <div
              key={step}
              id="question-gif"
              style={{
                width: "100%",
                maxWidth: 420,
                height: 220,
                margin: "0 auto 16px",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 12px 30px rgba(255, 105, 180, 0.35)",
                background: "#ffe4ec",
              }}
            >
              <img
                src={questions[step].gif}
                alt="gif"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {liarMode && step === 0 ? (
              <h2 style={{ color: "#ff3333" }}>Mentirosa 😡</h2>
            ) : (
              <h2>{questions[step].text}</h2>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 16,
              }}
            >
              {(liarMode && step === 0
                ? questions[step].options.filter((o) => o === "Si")
                : questions[step].options
              ).map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className="play-again-btn"
                  style={{
                    padding: "12px 24px",
                    fontSize: 18,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    background: "#000000",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s, border 0.2s",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            id="valentine-card"
            style={{
              background: "linear-gradient(135deg, #ffe4ec, #ffd1dc)",
              borderRadius: 24,
              padding: 32,
              maxWidth: 600,
              margin: "40px auto",
              boxShadow: "0 20px 40px rgba(255, 105, 180, 0.25)",
              textAlign: "center",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                marginBottom: 16,
                background: "linear-gradient(90deg, #ff4d8d, #ff85a2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ¡Yaaay felicidades, haz sido invitada a ser mi San Valentín :3! 🎉
            </h2>

            <p style={{ color: "#a63a6b", marginBottom: 24 }}>
              Aquí te dejo un recap de tus respuestas (recuerda mandárselo a tu
              novio):
            </p>

            <ul
              style={{
                textAlign: "left",
                margin: "0 auto",
                display: "inline-block",
                padding: 0,
                listStyle: "none",
              }}
            >
              {answers.map((a, i) => {
                const qIdx = questionPath[i];
                if (qIdx === undefined) return null;

                if (
                  questions[qIdx].text ===
                    "¿The Weeknd es infinitamente superior a Harry Styles?" &&
                  a === questions[qIdx].options[1]
                ) {
                  return (
                    <li
                      key={i}
                      className="answer-item"
                      style={{
                        marginBottom: 12,
                        background: "#fff0f6",
                        padding: "10px 14px",
                        borderRadius: 12,
                        color: "#7a1f45",
                      }}
                    >
                      💗 {questions[qIdx].text}{" "}
                      <b>Sí pero soy rebelde y quiero decir que no</b>
                    </li>
                  );
                }

                return (
                  <li
                    key={i}
                    className="answer-item"
                    style={{
                      marginBottom: 12,
                      background: "#fff0f6",
                      padding: "10px 14px",
                      borderRadius: 12,
                      color: "#7a1f45",
                    }}
                  >
                    💕 {questions[qIdx].text} <b>{a}</b>
                  </li>
                );
              })}
            </ul>

            <div
              style={{
                marginTop: 28,
                fontSize: 18,
                color: "#b03060",
                fontWeight: 500,
              }}
            >
              ¡Nos vemos el 14!
            </div>

            <div id="hearts" style={{ marginTop: 12, fontSize: 36 }}>
              💖✨🌹
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="play-again-btn"
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          padding: "8px 18px",
          fontSize: 16,
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "#fff",
          color: "#888",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s, border 0.2s",
        }}
      >
        Yaaay quiero volver a jugar :33
      </button>
    </>
  );
}

export default App;
