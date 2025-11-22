import React, { useState } from 'react';
import { GameView, Character, ChatMessage, SaveFile } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CharacterCreation } from './components/CharacterCreation';
import { GameInterface } from './components/GameInterface';
import { SaveLoadScreen } from './components/SaveLoadScreen';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>('WELCOME');
  const [character, setCharacter] = useState<Character | null>(null);
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);
  
  // Handlers
  const handleStartNewGame = () => {
    setCurrentView('CREATE_CHARACTER');
  };

  const handleCharacterCreated = (newChar: Character) => {
    setCharacter(newChar);
    setCurrentView('GAME_LOOP');
  };

  const handleLoadGameClick = () => {
    // If we are at the Welcome screen, we should ensure no character state exists
    // so SaveLoadScreen opens in 'LOAD' mode.
    if (currentView === 'WELCOME') {
        setCharacter(null);
    }
    setCurrentView('SAVES');
  };

  const handleLoadFile = (file: SaveFile) => {
      setCharacter(file.character);
      setMessageHistory(file.messages);
      setCurrentView('GAME_LOOP');
  };

  const handleSaveGame = (char: Character, messages: ChatMessage[]) => {
      setCharacter(char);
      setMessageHistory(messages);
      setCurrentView('SAVES');
  };

  const handleExitGame = () => {
      // CLEAR STATE when exiting to Welcome Screen
      // This prevents the "Back" button in Save/Load screen from trying to return to a closed game
      setCharacter(null);
      setMessageHistory([]);
      setCurrentView('WELCOME');
  };

  const renderView = () => {
    switch (currentView) {
      case 'WELCOME':
        return <WelcomeScreen onStart={handleStartNewGame} onLoad={handleLoadGameClick} />;
      
      case 'CREATE_CHARACTER':
        return (
          <CharacterCreation 
            onComplete={handleCharacterCreated} 
            onBack={() => setCurrentView('WELCOME')} 
          />
        );
      
      case 'GAME_LOOP':
        if (!character) return <WelcomeScreen onStart={handleStartNewGame} onLoad={handleLoadGameClick} />;
        return (
          <GameInterface 
            character={character}
            onSave={(char, msgs) => handleSaveGame(char, msgs)}
            onExit={handleExitGame}
          />
        );
      
      case 'SAVES':
        return (
            <SaveLoadScreen 
                mode={character ? 'SAVE' : 'LOAD'} 
                onBack={() => character ? setCurrentView('GAME_LOOP') : setCurrentView('WELCOME')}
                onLoadFile={handleLoadFile}
                currentSaveData={character ? { character, messages: messageHistory, summary: '' } : undefined}
            />
        );

      default:
        return <div>Unknown State</div>;
    }
  };

  return (
    <div className="w-full h-screen bg-mystic text-paper overflow-hidden font-sans selection:bg-jade-dim selection:text-white relative">
        {/* Background Layer 1: User Image with Blur & Scale (Depth of Field) */}
        {/* Added blur-[3px] for the requested mask blur effect and scale-110 to hide blurred edges */}
        <div className="fixed inset-0 z-0 bg-ethereal-mountains bg-cover bg-center bg-no-repeat blur-[3px] scale-110 brightness-[0.85] transition-all duration-1000 ease-in-out"></div>
        
        {/* Background Layer 2: Radial Vignette Mask (Atmosphere) */}
        {/* Creates a spotlight effect: clear in center, dark at edges */}
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(15,23,42,0.6)_100%)] pointer-events-none"></div>
        
        {/* Background Layer 3: Paper Texture Blend */}
        <div className="fixed inset-0 z-0 bg-paper-texture opacity-20 pointer-events-none mix-blend-overlay"></div>
        
        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col">
            {renderView()}
        </div>
    </div>
  );
};

export default App;