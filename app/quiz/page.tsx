"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchQuestions, saveProfileToCloud } from "../../lib/data";
import { getCurrentUser } from "../../lib/auth";
import { buildStudentVector } from "../../lib/matching";
import { saveProfile } from "../../lib/storage";
import { COLUMBIA_MAJORS } from "../../data/majors";
import { BACKGROUND_TAGS } from "../../data/background";
import { POSTGRAD_TAGS } from "../../data/postgrad";
import { UNIVERSITIES, DEFAULT_UNIVERSITY_ID } from "../../data/universities";
import { GOAL_TAGS, GoalTag, QuizAnswerOption, QuizQuestion, StudentYear, STUDENT_YEARS } from "../../types";

const GOAL_LABELS: Record<GoalTag, string> = {
  make_close_friends: "Make a few close friends",
  build_resume: "Build my resume / career experience",
  explore_interests: "Explore new interests",
  find_identity_community: "Find community around my identity or background",
  give_back: "Give back / make an impact",
  stay_active: "Stay physically active",
  creative_outlet: "Have a creative outlet",
  leadership_experience: "Get leadership experience",
};

function QuizInner() {
  const router = useRouter();
  const params = useSearchParams();
  const yearParam = params.get("year") as StudentYear | null;
  const year: StudentYear = STUDENT_YEARS.includes(yearParam as StudentYear) ? (yearParam as StudentYear) : "freshman";
  const schoolParam = params.get("school");
  const universityId = UNIVERSITIES.some((u) => u.id === schoolParam) ? schoolParam! : DEFAULT_UNIVERSITY_ID;

  const [rawQuestions, setRawQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [dataSource, setDataSource] = useState<"supabase" | "local" | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetchQuestions().then(({ questions, source }) => {
      setRawQuestions(questions);
      setDataSource(source);
      setLoadingQuestions(false);
    });
  }, []);

  const questions = rawQuestions.filter((q) => !q.audience_years || q.audience_years.includes(year));

  const asksMajor = year !== "freshman";

  const backgroundStepIndex = 1;
  const interestsStepIndex = 2;
  const internationalStepIndex = 3;
  const postgradStepIndex = 4;
  const majorStepIndex = asksMajor ? 5 : null;
  const questionsStartAt = asksMajor ? 6 : 5;
  const totalSteps = questionsStartAt + questions.length;
  const preQuizStepCount = questionsStartAt;

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goals, setGoals] = useState<GoalTag[]>([]);
  const [background, setBackground] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [isInternational, setIsInternational] = useState<boolean | null>(null);
  const [postgrad, setPostgrad] = useState<string[]>([]);
  const [major, setMajor] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerOption[]>([]);

  const progressPct = totalSteps > 0 ? Math.round((step / totalSteps) * 100) : 0;

  function toggleGoal(g: GoalTag) {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  }
  function toggleBackground(tag: string) {
    setBackground((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
  }
  function toggleInterest(m: string) {
    setInterests((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }
  function togglePostgrad(tag: string) {
    setPostgrad((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
  }

  function answerQuestion(option: QuizAnswerOption) {
    const next = [...answers, option];
    setAnswers(next);

    if (step === totalSteps - 1) {
      const vector = buildStudentVector(next);
      const profile = {
        year,
        vector,
        goals,
        major: major ?? undefined,
        background: background.length > 0 ? background : undefined,
        intellectualInterests: interests.length > 0 ? interests : undefined,
        isInternational: isInternational ?? undefined,
        postGradInterests: postgrad.length > 0 ? postgrad : undefined,
        name: name.trim() || undefined,
        universityId,
      };
      saveProfile(profile);
      getCurrentUser().then((user) => {
        if (user) saveProfileToCloud(user.id, profile);
      });
      router.push("/results");
    } else {
      setStep(step + 1);
    }
  }

  if (loadingQuestions) {
    return <main className="page">Loading quiz...</main>;
  }

  if (!started) {
    return (
      <main className="page">
        <h1>Ready when you are</h1>
        <p className="subtitle">
          This is {preQuizStepCount} short optional questions about you, followed by {questions.length} personality
          questions -- about 3-4 minutes total. Every profile question can be skipped.
          {dataSource === "local" && (
            <span style={{ display: "block", fontSize: 13, color: "var(--terracotta)", marginTop: 8 }}>
              Using the bundled question set -- couldn't reach the live database.
            </span>
          )}
        </p>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          What should we call you? (optional)
        </label>
        <input
          className="input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", maxWidth: 320, marginBottom: 20 }}
        />
        <div>
          <button onClick={() => setStarted(true)}>Start</button>
        </div>
      </main>
    );
  }

  const currentQuestion =
    step >= questionsStartAt ? questions[step - questionsStartAt] : null;

  return (
    <main className="page">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {step === 0 && (
        <>
          <h1>What are you hoping to get out of this year?</h1>
          <p className="subtitle">Pick as many as apply -- this helps us weigh your matches.</p>
          <div className="grid grid-2">
            {GOAL_TAGS.map((g) => (
              <button
                key={g}
                className={`option-btn ${goals.includes(g) ? "selected" : ""}`}
                onClick={() => toggleGoal(g)}
                type="button"
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setStep(1)} disabled={goals.length === 0}>
              Continue
            </button>
          </div>
        </>
      )}

      {step === backgroundStepIndex && (
        <>
          <h1>Any communities you'd like factored into your matches?</h1>
          <p className="subtitle">
            Columbia has a lot of cultural and identity-based organizations. If you'd like, tell us
            a bit about your background and we'll nudge relevant ones higher in your results --
            entirely optional, and it won't filter out anything else you're a good fit for.
          </p>
          <div className="grid grid-2">
            {BACKGROUND_TAGS.map((tag) => (
              <button
                key={tag}
                className={`option-btn ${background.includes(tag) ? "selected" : ""}`}
                onClick={() => toggleBackground(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setStep(step + 1)}>
              {background.length > 0 ? "Continue" : "Skip this step"}
            </button>
          </div>
        </>
      )}

      {step === interestsStepIndex && (
        <>
          <h1>What subjects genuinely interest you?</h1>
          <p className="subtitle">
            Doesn't have to match a declared major -- pick anything you'd want to nerd out about,
            even casually. Optional.
          </p>
          <div className="grid grid-2">
            {COLUMBIA_MAJORS.map((m) => (
              <button
                key={m}
                className={`option-btn ${interests.includes(m) ? "selected" : ""}`}
                onClick={() => toggleInterest(m)}
                type="button"
              >
                {m}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setStep(step + 1)}>
              {interests.length > 0 ? "Continue" : "Skip this step"}
            </button>
          </div>
        </>
      )}

      {step === internationalStepIndex && (
        <>
          <h1>Are you an international student?</h1>
          <p className="subtitle">
            International students often have different orientation touchpoints and community needs
            -- this just helps us surface relevant events. Optional.
          </p>
          <div className="grid grid-2">
            <button
              className={`option-btn ${isInternational === true ? "selected" : ""}`}
              onClick={() => setIsInternational(true)}
              type="button"
            >
              Yes
            </button>
            <button
              className={`option-btn ${isInternational === false ? "selected" : ""}`}
              onClick={() => setIsInternational(false)}
              type="button"
            >
              No
            </button>
          </div>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setStep(step + 1)}>
              {isInternational === null ? "Skip this step" : "Continue"}
            </button>
          </div>
        </>
      )}

      {step === postgradStepIndex && (
        <>
          <h1>Are you considering any of these paths?</h1>
          <p className="subtitle">
            Helps us surface pre-professional and academic orgs relevant to where you're headed.
            Pick as many as apply, or skip if you're not sure yet.
          </p>
          <div className="grid grid-2">
            {POSTGRAD_TAGS.map((tag) => (
              <button
                key={tag}
                className={`option-btn ${postgrad.includes(tag) ? "selected" : ""}`}
                onClick={() => togglePostgrad(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setStep(step + 1)}>
              {postgrad.length > 0 ? "Continue" : "Skip this step"}
            </button>
          </div>
        </>
      )}

      {majorStepIndex !== null && step === majorStepIndex && (
        <>
          <h1>What's your major?</h1>
          <p className="subtitle">
            We'll use this to surface department events and career-relevant orgs alongside your personality matches.
          </p>
          <select
            className="input"
            style={{ width: "100%", marginBottom: 20 }}
            value={major ?? ""}
            onChange={(e) => setMajor(e.target.value)}
          >
            <option value="" disabled>Select your major</option>
            {COLUMBIA_MAJORS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button onClick={() => setStep(step + 1)} disabled={!major}>
            Continue
          </button>
        </>
      )}

      {currentQuestion && (
        <>
          <p className="pill">Question {step - questionsStartAt + 1} of {questions.length}</p>
          <h1>{currentQuestion.text}</h1>
          <div style={{ marginTop: 20 }}>
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => answerQuestion(opt)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<main className="page">Loading...</main>}>
      <QuizInner />
    </Suspense>
  );
}
