import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clubLogo from '../assets/club-logo.png';

const LandingPage = ({ setPlayerName }) => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleEnter = (e) => {
        e.preventDefault();
        if (name.trim()) {
            setPlayerName(name);
            navigate('/game');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
            {/* Branding Header */}
            <div className="absolute top-8 flex flex-col items-center mb-12 animate-flicker">
                <span className="text-neon-red text-xs tracking-[0.5em] mb-2 uppercase">Project 3234</span>
                <div className="w-24 h-24 border-2 border-neon-red rounded-full flex items-center justify-center mb-2 shadow-neon bg-dark-gray/50 backdrop-blur-sm overflow-hidden">
                    <img src={clubLogo} alt="Club Logo" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-white text-sm font-sans tracking-widest uppercase mb-1">ROTARACT CLUB OF MADRAS GOLD COAST</h3>
                <p className="text-neon-red font-serif italic text-xs">Proudly Presents</p>
            </div>

            {/* Main Title */}
            <div className="text-center mt-32 mb-12">
                <h1 className="text-5xl md:text-7xl text-white font-serif tracking-tighter text-glow-strong">
                    A Quiz Event
                </h1>
            </div>

            {/* Entry Form */}
            <form onSubmit={handleEnter} className="w-full max-w-sm flex flex-col gap-6">
                <div className="relative group">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ENTER AGENT NAME"
                        className="w-full bg-transparent border-2 border-neon-red text-white text-center py-4 px-6 text-xl outline-none focus:shadow-neon transition-all font-mono placeholder-red-900/50 rounded-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="w-full bg-neon-red text-black font-bold py-4 text-xl tracking-widest uppercase hover:bg-white hover:text-neon-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-slow shadow-neon"
                >
                    Enter The Void
                </button>
            </form>
        </div>
    );
};

export default LandingPage;
