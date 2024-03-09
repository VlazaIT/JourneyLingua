import { useEffect, useState } from "react";
import "../styles/ImageToTextEx.css";

import { ExerciseImgTxt } from "../interfaces/Exercise";
import { fetchExercise } from "../hooks/exerciseHooks";
import { useNavigate } from "react-router-dom";

const ImageToTextEx: React.FC = () => {
    const [index, setIndex] = useState<number>(0); 
    const [exercise, setExercise] = useState<ExerciseImgTxt[] | null>(null);
    const [countCorrectAnswer, setCountCorrectAnswer] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error |null>(null);

    const navigate = useNavigate();

    const getExerciseSet = async () => {
        try {
            const response = await fetchExercise();
            if (!response.ok) {
                console.log(error?.message);
                throw new Error("Exercise not found");
            }

            const data: ExerciseImgTxt[] = await response.json();
            // console.log(data);
            setExercise(data);
            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getExerciseSet();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleUserAnswer = (word: string) => {
        if (exercise?.[index].wordFin === word) {
            setCountCorrectAnswer(countCorrectAnswer + 1);
        }
        setIndex(index + 1);
    };

    const displayExercise = () => {
        if (index < exercise?.length!) {
            return (
                <>
                    <img src={exercise?.[index].imageLink} alt="Exercise Image" className="exercise-image"/>
                    <div className="options-container">
                        {exercise?.map((ex, i) => {
                            return (
                                <button key={i} className="option-button" onClick={() => {
                                    handleUserAnswer(ex.wordFin);
                                }}>
                                    {ex.wordFin}
                                </button>
                            )
                        })}
                    </div>
                </>
            )
        } 
        else {
            return (
                <>
                    <div>Exercise Completed</div>
                    <div>You did {countCorrectAnswer}/3 correct!</div>
                    <button onClick={() => navigate("/")}>Go back</button>
                </>
            )
        }
    };
    

    return (
        <div>
            <header className="exercise-header">
                <h2>Text-Image Exercise</h2>
            </header>
            <main className="center">
                <div className="exercise-container">
                    {displayExercise()}
                </div>
            </main>
        </div>
    );
};

export default ImageToTextEx;