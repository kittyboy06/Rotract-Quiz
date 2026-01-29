import React, { useState, useEffect } from 'react';
import { supabase, isMockMode } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const GameScreen = ({ playerName, score, setScore }) => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15000); // 15 seconds in ms
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            if (isMockMode) {
                console.log("Mock Mode: Loading default questions.");
                setQuestions([
                    {
                        id: 1,
                        question_text: "What lies in the Upside Down?",
                        options: ["Demogorgon", "Mind Flayer", "Vecna", "All of the above"],
                        correct_answer: "All of the above",
                        time_limit: 15
                    },
                    {
                        id: 2,
                        question_text: "Which D&D class is Will the Wise?",
                        options: ["Paladin", "Rogue", "Cleric", "Wizard"],
                        correct_answer: "Wizard",
                        time_limit: 15
                    }
                ]);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .order('created_at', { ascending: true }); // Ensure consistent order

            if (error) {
                console.error('Supabase Error:', error);
                // Optionally show error state
            } else {
                setQuestions(data || []);
            }
            setLoading(false);
        };

        fetchQuestions();

        // Realtime Subscription
        if (!isMockMode) {
            const subscription = supabase
                .channel('room1')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, () => {
                    // Refresh questions on any change
                    fetchQuestions();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            }
        }
    }, []);

    // Timer Logic
    useEffect(() => {
        if (loading || gameOver || questions.length === 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    handleAnswer(null); // Time's up
                    return 15000;
                }
                return prev - 100; // Update every 100ms for smooth bar
            });
        }, 100);

        return () => clearInterval(interval);
    }, [loading, gameOver, currentQuestionIndex, questions.length]);

    const handleAnswer = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        let points = 0;

        if (selectedOption === currentQuestion.correct_answer && timeLeft > 0) {
            // Score = Math.ceil((TimeRemaining_ms / TotalTime_ms) * 1000)
            points = Math.ceil((timeLeft / 15000) * 1000);
            setScore((prev) => prev + points);
        }

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setTimeLeft(15000); // Reset timer
        } else {
            setGameOver(true);
            // Save Score to Supabase
            saveScore(score + points);
        }
    };

    const saveScore = async (finalScore) => {
        if (!playerName) return;

        if (isMockMode) {
            console.log(`Mock Mode: Score ${finalScore} for ${playerName} would be saved.`);
            return;
        }

        await supabase.from('scores').insert([{ player_name: playerName, score: finalScore }]);
    };

    if (loading) return <div className="text-white text-center mt-20 animate-pulse">Loading the Upside Down...</div>;

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-4xl text-neon-red font-serif mb-4 text-glow-strong">GAME OVER</h2>
                <p className="text-white text-2xl mb-8">Agent {playerName}</p>
                <div className="text-6xl text-white font-mono mb-12 text-glow">{score} PTS</div>
                <button
                    onClick={() => navigate('/')}
                    className="bg-neon-red text-black font-bold py-3 px-8 rounded hover:bg-white transition-all shadow-neon"
                >
                    RETURN TO HOME
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-3xl text-white font-serif mb-4 animate-pulse">WAITING FOR NETWORK...</h2>
                <p className="text-gray-400">No questions found in the void.</p>
                <div className="mt-8 text-neon-red text-sm uppercase tracking-widest">
                    Host must inject questions via /admin
                </div>
            </div>
        )
    }

    // Safe parsing of options if stored as JSON string or array
    const options = typeof currentQuestion.options === 'string'
        ? JSON.parse(currentQuestion.options)
        : currentQuestion.options;

    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden relative z-10">
            {/* Top: Score */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black/80 backdrop-blur">
                <div className="text-gray-400 text-sm">Q {currentQuestionIndex + 1}/{questions.length}</div>
                <div className="text-neon-red font-mono text-2xl text-shadow-neon">{score}</div>
            </div>

            {/* Middle: Question */}
            <div className="flex-grow flex items-center justify-center p-6 text-center">
                <h2 className="text-2xl md:text-4xl text-white font-serif leading-relaxed text-glow">
                    {currentQuestion.question_text}
                </h2>
            </div>

            {/* Middle-Lower: Options */}
            <div className="p-4 pb-20 md:pb-8 max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            className="w-full min-h-[60px] md:min-h-[80px] bg-dark-gray border border-gray-700 text-white text-lg md:text-xl font-bold rounded hover:bg-neon-red hover:text-black hover:border-neon-red transition-all duration-200 active:scale-95 shadow-md"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom: Timer */}
            <div className="fixed bottom-0 left-0 w-full h-4 bg-gray-900">
                <div
                    className="h-full bg-neon-red shadow-neon transition-all duration-100 ease-linear"
                    style={{ width: `${(timeLeft / 15000) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default GameScreen;
