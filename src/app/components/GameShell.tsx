'use client';

import { useReducer, useState } from 'react';
import type { Action, RunState } from '@/engine/types';
import { createRun, applyAction, isRunOver } from '@/engine/run';
import { Hud } from './Hud';
import { Hand } from './Hand';
import { ActionBar } from './ActionBar';
import { RulesPanel } from './RulesPanel';
import { Shop } from './Shop';
import { RunSummary } from './RunSummary';

type GameShellProps = {
    seed: number;
};

function runReducer(state: RunState, action: Action): RunState {
    return applyAction(action, state);
}

export function GameShell({seed}: GameShellProps) {
    const [runState, dispatch] = useReducer(runReducer, seed, createRun);
    const [selected, setSelected] = useState<number[]>([]);
    const [showRules, setShowRules] = useState(false);

    console.log( 'test secret:', process.env.NEXT_PUBLIC_TEST_SECRET );

    function toggleCard(index: number) {
        setSelected(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : prev.length < 5 ? [...prev, index] : prev
        );
    }

    function handlePlay() {
        dispatch({ type: 'play', cards: selected});
        setSelected([]);
    }

    function handleDiscard() {
        dispatch({ type: 'discard', cards: selected});
        setSelected([]);
    }

    if(isRunOver(runState)) {
        return (
            <RunSummary
                status={runState.status}
                round={runState.round}
                totalScore={runState.totalScore}
                seed={runState.seed} 
            />
        )
    }

    if(runState.phase === 'shop') {
        return (
            <Shop
                money={runState.money}
                ownedItems={runState.ownedItems}
                round={runState.round}
                onPurchase={(itemId) => dispatch({ type: 'purchase', itemId})}
                onLeave={() => dispatch({ type:'leaveShop'})} 
            />
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center gap-4 bg-neutral-950 p-4 text-neutral-100">
            <Hud
                round={runState.round}
                target={runState.target}
                roundScore={runState.roundScore}
                totalScore={runState.totalScore} 
            />
            <Hand 
                cards={runState.hand} 
                selected={selected} 
                onToggle={toggleCard} 
            />
            <ActionBar
                selectedCount={selected.length}
                handsLeft={runState.handsLeft}
                discardsLeft={runState.discardsLeft}
                onPlay={handlePlay}
                onDiscard={handleDiscard} 
            />
            <button type="button" onClick={() => setShowRules(v => !v)} className="text-sm underline">
                {showRules ? 'Hide' : 'Show' } rules
            </button>
            {showRules && <RulesPanel />}
        </div>
    );
}