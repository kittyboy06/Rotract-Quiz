import React, { useState } from 'react';
import { supabase, isMockMode } from '../supabaseClient';

const AdminPanel = () => {
    const [form, setForm] = useState({
        question_text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correct_answer: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');

        const options = [form.optionA, form.optionB, form.optionC, form.optionD];

        // Validate correct answer matches one option
        if (!options.includes(form.correct_answer)) {
            setStatus('Error: Correct answer must match one of the options exactly.');
            return;
        }

        if (isMockMode) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
            console.log('Mock Mode: Question would be injected:', { ...form, options });
            setStatus('Mock Success: Question Injected (Note: Persistence is disabled)');
            setForm({ ...form, question_text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct_answer: '' });
            return;
        }

        const { error } = await supabase
            .from('questions')
            .insert([
                {
                    question_text: form.question_text,
                    options: options, // Supabase handles array/json depending on col type
                    correct_answer: form.correct_answer,
                    time_limit: 15
                }
            ]);

        if (error) {
            setStatus(`Error: ${error.message}`);
        } else {
            setStatus('Question Injected successfully!');
            setForm({ ...form, question_text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct_answer: '' });
        }
    };

    return (
        <div className="min-h-screen p-8 text-white z-10 relative overflow-y-auto">
            <h1 className="text-3xl text-neon-red mb-8 font-serif">Admin Control Panel</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-dark-gray/80 p-6 rounded border border-gray-800">
                <div>
                    <label className="block mb-2 text-gray-400">Question Text</label>
                    <textarea
                        name="question_text"
                        value={form.question_text}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-neon-red outline-none"
                        rows="3"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                        <div key={opt}>
                            <label className="block mb-2 text-gray-400">Option {opt}</label>
                            <input
                                type="text"
                                name={`option${opt}`}
                                value={form[`option${opt}`]}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-neon-red outline-none"
                                required
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block mb-2 text-gray-400">Correct Answer (Must match text exacty)</label>
                    <select
                        name="correct_answer"
                        value={form.correct_answer}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-neon-red outline-none"
                        required
                    >
                        <option value="">Select Correct Answer</option>
                        <option value={form.optionA}>{form.optionA || 'Option A'}</option>
                        <option value={form.optionB}>{form.optionB || 'Option B'}</option>
                        <option value={form.optionC}>{form.optionC || 'Option C'}</option>
                        <option value={form.optionD}>{form.optionD || 'Option D'}</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-neon-red text-black font-bold py-3 rounded hover:bg-white transition shadow-neon"
                >
                    INJECT QUESTION
                </button>

                {status && (
                    <div className={`mt-4 text-center ${status.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {status}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AdminPanel;
