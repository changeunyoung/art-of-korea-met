"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type FormData = {
  age_group: string;
  gender: string;
  region: string;
  is_korean: string;
  met_visits: string;
  korea_gallery_visits: string;
  korean_art_familiarity: string;
  korean_history_familiarity: string;
  galleries_neutral_before: string;
  artwork_influence: string;
  view_changed: string;
  exhibition_meaning: string;
  perspective_part: string;
  additional_thoughts: string;
};

const initial: FormData = {
  age_group: "",
  gender: "",
  region: "",
  is_korean: "",
  met_visits: "",
  korea_gallery_visits: "",
  korean_art_familiarity: "",
  korean_history_familiarity: "",
  galleries_neutral_before: "",
  artwork_influence: "",
  view_changed: "",
  exhibition_meaning: "",
  perspective_part: "",
  additional_thoughts: "",
};

function SliderPillGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: keyof FormData;
  options: string[];
  value: string;
  onChange: (name: keyof FormData, val: string) => void;
}) {
  const selectedIdx = value ? options.indexOf(value) : -1;

  return (
    <div style={{ marginTop: "12px" }}>
      {/* Pill buttons — aligned to slider ends */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        {options.map((opt, i) => {
          const selected = i === selectedIdx;
          const isFirst = i === 0;
          const isLast = i === options.length - 1;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(name, opt)}
              style={{
                padding: "6px 12px",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: selected ? "#1C2B3A" : "transparent",
                color: selected ? "#fffacb" : "#1C2B3A",
                fontFamily: "var(--font-sans), monospace",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                letterSpacing: "0.02em",
                textShadow: selected ? "0px 2px 8px rgba(28,43,58,0.45)" : "none",
                textAlign: "center",
                flex: "1 1 0",
              }}
            >
              {opt === "Not familiar at all"
                ? <><span>Not familiar</span><br /><span>at all</span></>
                : opt}
            </button>
          );
        })}
      </div>

      {/* Slider */}
      <div style={{ position: "relative", padding: "4px 0" }}>
        <input
          className="survey-slider"
          type="range"
          min={0}
          max={options.length - 1}
          step={1}
          value={selectedIdx >= 0 ? selectedIdx : 0}
          onChange={(e) => onChange(name, options[Number(e.target.value)])}
          onMouseDown={() => { if (selectedIdx < 0) onChange(name, options[0]); }}
          style={{
            width: "100%",
            background: `linear-gradient(to right, #a0b4c8 0%, #a0b4c8 ${selectedIdx >= 0 ? (selectedIdx / (options.length - 1)) * 100 : 0}%, #1C2B3A22 ${selectedIdx >= 0 ? (selectedIdx / (options.length - 1)) * 100 : 0}%, #1C2B3A22 100%)`,
          }}
        />
        {/* Tick marks */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          {options.map((_, i) => (
            <div key={i} style={{ width: 1, height: 5, backgroundColor: "#1C2B3A44" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: keyof FormData;
  options: string[];
  value: string;
  onChange: (name: keyof FormData, val: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontFamily: "var(--font-sans), monospace",
            fontSize: "13px",
            color: "#1C2B3A",
            opacity: 0.85,
            textShadow: value === opt ? "0px 2px 10px rgba(28,43,58,0.45), 0px 0px 20px rgba(28,43,58,0.15)" : "none",
            transition: "text-shadow 0.15s ease",
          }}
        >
          <span style={{ width: 32, height: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {value === opt ? (
              <img
                src="/images/logo/foot.webp"
                alt=""
                style={{ width: 32, height: 32, objectFit: "contain", filter: "drop-shadow(0px 1px 3px rgba(200,168,0,0.5))", transform: "rotate(180deg)" }}
              />
            ) : (
              <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #1C2B3A33", display: "block" }} />
            )}
          </span>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(name, opt)}
            style={{ display: "none" }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function Question({
  number,
  label,
  children,
  required = true,
}: {
  number?: number;
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <p style={{
        fontFamily: "var(--font-sans), monospace",
        fontSize: "15px",
        fontWeight: 700,
        color: "#1C2B3A",
        marginBottom: "4px",
      }}>
        {number !== undefined ? `${number}. ` : ""}{label}
        {required && <span style={{ color: "#c8a800", marginLeft: 4 }}>*</span>}
      </p>
      {children}
    </div>
  );
}

function SectionHeader({ part, title }: { part: string; title: string }) {
  return (
    <div style={{ marginBottom: "28px", paddingBottom: "12px", borderBottom: "1px solid #1C2B3A22" }}>
      <p style={{
        fontFamily: "var(--font-sans), monospace",
        fontSize: "11px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#c8a800",
        marginBottom: "4px",
      }}>{part}</p>
      <h2 style={{
        fontFamily: "var(--font-display), Montserrat, sans-serif",
        fontSize: "20px",
        fontWeight: 800,
        color: "#1C2B3A",
      }}>{title}</h2>
    </div>
  );
}

export default function SurveyPage() {
  const [form, setForm] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("survey_submitted") === "true") {
      setAlreadySubmitted(true);
    }
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const thresholdScrollY = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!submitRef.current || !videoRef.current) return;
      const rect = submitRef.current.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const videoHeight = videoRef.current.offsetWidth; // rotated 90deg so width becomes height

      let targetTop: number;
      if (rect.top <= mid + 100) {
        if (thresholdScrollY.current === null) {
          thresholdScrollY.current = window.scrollY;
        }
        targetTop = mid - (window.scrollY - thresholdScrollY.current);
      } else {
        thresholdScrollY.current = null;
        targetTop = mid;
      }

      // Clamp: bird bottom (targetTop + videoHeight/2) must not exceed submit button top
      const maxTop = rect.top - videoHeight / 2;
      const clampedTop = Math.min(targetTop, maxTop);

      videoRef.current.style.top = `${clampedTop}px`;
      videoRef.current.style.transform = `translateY(-50%) scaleX(-1) rotate(90deg)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const set = (name: keyof FormData, val: string) =>
    setForm((prev) => ({ ...prev, [name]: val }));

  const requiredFields: (keyof FormData)[] = [
    "age_group", "gender", "region", "is_korean",
    "met_visits", "korea_gallery_visits", "korean_art_familiarity", "korean_history_familiarity",
    "galleries_neutral_before", "view_changed", "exhibition_meaning",
    "perspective_part",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = requiredFields.filter((k) => !form[k]);
    if (missing.length > 0) {
      setError("Please answer all required questions before submitting.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: dbErr } = await supabase.from("responses").insert([form]);
    setLoading(false);
    if (dbErr) {
      setError("Something went wrong. Please try again.");
      console.error(dbErr);
    } else {
      localStorage.setItem("survey_submitted", "true");
      setSubmitted(true);
    }
  };

  if (alreadySubmitted) {
    return (
      <div style={{ backgroundColor: "#fffacb", minHeight: "100vh", marginTop: "-80px", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>✓</div>
          <h1 style={{ fontFamily: "var(--font-display), Montserrat, sans-serif", fontSize: "32px", fontWeight: 800, color: "#1C2B3A", marginBottom: "12px" }}>
            Already Submitted
          </h1>
          <p style={{ fontFamily: "var(--font-sans), monospace", fontSize: "15px", color: "#1C2B3A", opacity: 0.7, lineHeight: 1.8 }}>
            You have already completed this survey.<br />Thank you for your participation!
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ backgroundColor: "#fffacb", minHeight: "100vh", marginTop: "-80px", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🙏</div>
          <h1 style={{ fontFamily: "var(--font-display), Montserrat, sans-serif", fontSize: "32px", fontWeight: 800, color: "#1C2B3A", marginBottom: "12px" }}>
            Thank You!
          </h1>
          <p style={{ fontFamily: "var(--font-sans), monospace", fontSize: "14px", color: "#1C2B3A", opacity: 0.7, lineHeight: 1.7, maxWidth: "400px", margin: "0 auto" }}>
            Your response has been recorded. Your feedback helps improve this research project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#fffacb", minHeight: "100vh", marginTop: "-80px", paddingTop: "80px", position: "relative" }}>
      {/* Walking bird — fixed to left of content area */}
      <video
        ref={videoRef}
        src="/videos/walkingbird.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          left: "calc(50% - 470px)",
          top: "50%",
          width: 180,
          opacity: 0.75,
          pointerEvents: "none",
          zIndex: 1,
          transform: "translateY(-50%) scaleX(-1) rotate(90deg)",
          animation: "birdFadeIn 1.8s ease forwards",
          maskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 75%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 75%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Header — centered on full page */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 32px" }}>
        <p style={{ fontFamily: "var(--font-sans), monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8a800", marginBottom: "8px", textAlign: "center" }}>
          Visitor Survey
        </p>
        <div style={{ width: "100%", marginBottom: "8px" }}>
          <svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", overflow: "visible" }}>
            <defs>
              <path id="survey-arc" d="M 20,90 Q 350,30 680,90">
                <animate
                  attributeName="d"
                  values="M 20,90 Q 350,30 680,90; M 20,90 Q 350,18 680,90; M 20,90 Q 350,30 680,90"
                  dur="6s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  keyTimes="0;0.5;1"
                />
              </path>
            </defs>
            <text
              fill="#1C2B3A"
              fontFamily="var(--font-borel), Borel, cursive"
              fontSize="58"
              fontWeight="bold"
              textAnchor="middle"
              style={{ filter: "drop-shadow(2px 4px 10px rgba(28,43,58,0.25))" }}
            >
              <textPath href="#survey-arc" startOffset="50%">Share Your Perspective</textPath>
            </text>
          </svg>
        </div>
        <p style={{ fontFamily: "var(--font-sans), monospace", fontSize: "13px", color: "#1C2B3A", opacity: 0.7, lineHeight: 1.8, textAlign: "center" }}>
          Thank you for participating in this survey. Survey responses will be used for research purposes only and will be analyzed anonymously.
        </p>
      </div>

      {/* Form — uses flex so content is centered in space to the right of the bird */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 40px 80px" }}>
        <div style={{ maxWidth: 680, width: "100%", position: "relative", zIndex: 2, backgroundColor: "#fffacb" }}>
        <form onSubmit={handleSubmit}>
          {/* Part 1 */}
          <div style={{ marginBottom: "48px" }}>
            <SectionHeader part="Part 1" title="Demographics" />

            <Question number={1} label="Age Group">
              <RadioGroup name="age_group" value={form.age_group} onChange={set}
                options={["Under 18", "18–24", "25–34", "35–49", "50–64", "65+"]} />
            </Question>

            <Question number={2} label="Gender">
              <RadioGroup name="gender" value={form.gender} onChange={set}
                options={["Female", "Male", "Another identity", "Prefer not to say"]} />
            </Question>

            <Question number={3} label="Country / Region">
              <RadioGroup name="region" value={form.region} onChange={set}
                options={["North America", "Europe", "East Asia", "Southeast Asia", "South Asia", "Latin America", "Africa", "Oceania", "Other"]} />
            </Question>

            <Question number={4} label="Do you identify as Korean?">
              <RadioGroup name="is_korean" value={form.is_korean} onChange={set}
                options={["Yes", "No", "Prefer not to say"]} />
            </Question>
          </div>

          {/* Part 2 */}
          <div style={{ marginBottom: "48px" }}>
            <SectionHeader part="Part 2" title="Museum Experience" />

            <Question number={5} label="How many times have you visited The Metropolitan Museum of Art?">
              <SliderPillGroup name="met_visits" value={form.met_visits} onChange={set}
                options={["0 times", "1 time", "2–5 times", "6–10 times", "More than 10 times"]} />
            </Question>

            <Question number={6} label="How many times have you visited Art of Korea at The Metropolitan Museum of Art?">
              <SliderPillGroup name="korea_gallery_visits" value={form.korea_gallery_visits} onChange={set}
                options={["0 times", "1 time", "2–5 times", "6–10 times", "More than 10 times"]} />
            </Question>

            <Question number={7} label="How familiar are you with Korean art?">
              <SliderPillGroup name="korean_art_familiarity" value={form.korean_art_familiarity} onChange={set}
                options={["Not familiar at all", "Slightly familiar", "Moderately familiar", "Very familiar", "Expert"]} />
            </Question>

            <Question number={8} label="How familiar are you with Korean history and culture?">
              <SliderPillGroup name="korean_history_familiarity" value={form.korean_history_familiarity} onChange={set}
                options={["Not familiar at all", "Slightly familiar", "Moderately familiar", "Very familiar", "Expert"]} />
            </Question>
          </div>

          {/* Part 3 */}
          <div style={{ marginBottom: "48px" }}>
            <SectionHeader part="Part 3" title="Museum Interpretation" />

            <Question number={9} label="Before exploring this project, do you think museum galleries are neutral spaces?">
              <RadioGroup name="galleries_neutral_before" value={form.galleries_neutral_before} onChange={set}
                options={["Yes", "No", "Not sure"]} />
            </Question>

            <Question number={10} label="After exploring this project, do you think museum galleries are neutral spaces?">
              <RadioGroup name="view_changed" value={form.view_changed} onChange={set}
                options={["Yes", "No", "Not sure"]} />
            </Question>

            <Question number={11} label="Which factor do you think most shapes the meaning of a museum exhibition?">
              <RadioGroup name="exhibition_meaning" value={form.exhibition_meaning} onChange={set}
                options={["The objects themselves", "Object placement and spatial design", "Museum labels and wall texts", "Historical context", "A combination of all of these"]} />
            </Question>
          </div>

          {/* Part 4 */}
          <div style={{ marginBottom: "48px" }}>
            <SectionHeader part="Part 4" title="Project Reflection" />

            <Question number={12} label="Which part of the project most changed your perspective?">
              <RadioGroup name="perspective_part" value={form.perspective_part} onChange={set}
                options={["Interactive Map", "Timeline", "Text Analysis", "Mini Game", "None of the above"]} />
            </Question>

            <Question number={13} label="Do you have any additional thoughts, reflections, or feedback about this project?" required={false}>
              <textarea
                value={form.additional_thoughts}
                onChange={(e) => set("additional_thoughts", e.target.value)}
                placeholder="Optional — share anything on your mind..."
                rows={5}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "14px 16px",
                  fontFamily: "var(--font-sans), monospace",
                  fontSize: "13px",
                  color: "#1C2B3A",
                  backgroundColor: "transparent",
                  border: "1.5px solid #1C2B3A33",
                  borderRadius: "10px",
                  resize: "vertical",
                  outline: "none",
                  lineHeight: 1.7,
                  boxSizing: "border-box",
                }}
              />
            </Question>
          </div>

          {error && (
            <p style={{ fontFamily: "var(--font-sans), monospace", fontSize: "13px", color: "#c8a800", marginBottom: "20px" }}>
              ⚠ {error}
            </p>
          )}

          <button
            ref={submitRef}
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#1C2B3A",
              color: "#fffacb",
              fontFamily: "var(--font-display), Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              border: "none",
              borderRadius: "9999px",
              padding: "14px 40px",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.05em",
              opacity: loading ? 0.6 : 1,
              transition: "opacity 0.2s ease, transform 0.1s ease",
            }}
          >
            {loading ? "Submitting..." : "Submit Survey"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
