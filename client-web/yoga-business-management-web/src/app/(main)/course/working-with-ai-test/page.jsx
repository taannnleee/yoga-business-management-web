"use client"
import { Input } from "antd";
const { Search } = Input;

import { useEffect, useState } from "react";
import YogaExercise from "@/app/(main)/course/working-with-ai-test/YogaExercise";
import DoneExercise from "@/app/(main)/course/working-with-ai-test/DoneExercise";
import Collection from '@/app/(main)/course/working-with-ai-test/Collection'; // hoặc đường dẫn chính xác tới file Collection.jsx
import { API_URL } from "@/config/url";

const YogaPage = () => {
  const [yogaExercises, setYogaExercises] = useState([]);

  const fetchExercise = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(
      `${API_URL}/api/v1/yoga-workouts`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (res.status === 400) {
      throw new Error(`Email or password is incorrect`);
    }
    if (!res.ok) {
      throw new Error(`Error while trying to login`);
    }
    const data = await res.json();
    setYogaExercises(
      data.data.filter((exercise) => exercise.description !== "NO_DESCRIPTION")
    );
  };
  useEffect(() => {
    fetchExercise();
  }, []);

  const [searchKey, setSearchKey] = useState("");

  const [practiceExercises, setPracticeExercises] = useState([]);
  const [showPractice, setShowPractice] = useState(false);

  const [practiceHistory, setPracticeHistory] = useState([]);
  const fetchPracticeHistory = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(
      `${API_URL}/api/v1/yoga-workouts/history`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();
    setPracticeHistory(data.data);
  };
  useEffect(() => {
    fetchPracticeHistory();
  }, []);
  const isPracticed = (exercise) => {
    if (!practiceHistory) return false;
    return practiceHistory.some(
      (history) => history.yogaWorkout.id === exercise.id
    );
  };
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const ExerciseList = () => {
    return (
      <>
        <Search
          className="w-full py-2 "
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          placeholder="Search by name"
          allowClear
        />
        <Collection
          deriveAttr="level"
          isPracticed={isPracticed}
          selectCollectionHandler={(level) => {
            let exercises = yogaExercises.filter(
              (exercise) => exercise.level == level
            );
            // Sort exercise that has't been practiced
            exercises = exercises.sort((a, b) => {
              if (isPracticed(a)) {
                return 1;
              }
              if (isPracticed(b)) return -1;
              return 0;
            });

            setCurrentExerciseIndex(0);
            setPracticeExercises(exercises);
            setShowPractice(true);
          }}
          converter={(level) => {
            // Switch
            // level 0 -> basic
            // level 1 -> intermediate
            // level 2 -> advanced
            if (level == 0) return "Intro";
            if (level == 1) return "Beginner";
            if (level == 2) return "Intermediate";
            if (level == 3) return "Advanced";
            if (level == 4) return "Expert";

            return "Unknown";
          }}
          data={yogaExercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(searchKey.toLowerCase())
          )}
        />
      </>
    );
  };

  const saveToHistory = async (exercise) => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(
      `${API_URL
      }/api/v1/yoga-workouts/history/upsert`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          yogaWorkout: {
            id: exercise.id,
          },
          done: true,
        }),
      }
    );

    const data = await res.json();
    setPracticeHistory([...practiceHistory, data.data]);
  };

  const setComplete = () => {
    setDoneAll(true);
    setShowPractice(false);
    setPracticeExercises([]);
  };

  const [doneAll, setDoneAll] = useState(false);
  return (
    <div className="h-screen">
      {!showPractice && !doneAll ? (
        <ExerciseList />
      ) : doneAll ? (
        <DoneExercise
          discover={() => {
            setDoneAll(false);
            setShowPractice(false);
          }}
        />
      ) : (
        <YogaExercise
          isPracticed={isPracticed}
          currentExercise={practiceExercises[currentExerciseIndex]}
          stop={() => {
            setShowPractice(false);
            setPracticeExercises([]);
          }}
          skip={() => {
            if (currentExerciseIndex < practiceExercises.length - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
            }
          }}
          setComplete={setComplete}
          next={async () => {
            if (currentExerciseIndex < practiceExercises.length - 1) {
              // Save to history
              let c = practiceExercises[currentExerciseIndex];
              await saveToHistory(c);
              setCurrentExerciseIndex(currentExerciseIndex + 1);
            }

            // Congrats you have finished all exercises
            if (currentExerciseIndex == practiceExercises.length - 1) {
              setComplete();
            }
          }}
        />
      )}
    </div>
  );
};

export default YogaPage;
