import React, { useState } from 'react';
import {
  Dumbbell,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  Play
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { MOCK_WORKOUTS, MOCK_ASANAS } from '../services/mockData';
import { Workout, YogaAsana } from '../types';

export const FitnessYoga: React.FC = () => {
  const [workouts] = useState<Workout[]>(MOCK_WORKOUTS);
  const [asanas] = useState<YogaAsana[]>(MOCK_ASANAS);
  const [activeTab, setActiveTab] = useState<'workouts' | 'asanas'>('workouts');
  const [selectedAsana, setSelectedAsana] = useState<YogaAsana | null>(null);

  // Log Workout Modal State
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logTitle, setLogTitle] = useState('Morning Dinacharya Surya Flow');
  const [duration, setDuration] = useState('25');
  const [loggedStreak, setLoggedStreak] = useState(7);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedStreak(loggedStreak + 1);
    setIsLogOpen(false);
    alert('Workout session logged! Your circadian streak is now ' + (loggedStreak + 1) + ' days.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-forest font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Circadian Movement & Yoga Therapy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Fitness, Prana & Yoga Regimens</h1>
          <p className="text-xs text-warm-brown mt-0.5">Gentle, restorative sequences engineered to balance bio-energetic doshas without triggering oxidative fatigue.</p>
        </div>

        <Button onClick={() => setIsLogOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Log Activity
        </Button>
      </div>

      {/* Streak & Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1 bg-white">
          <span className="text-[11px] font-semibold text-warm-brown">Daily Streak</span>
          <p className="text-2xl font-serif font-bold text-forest">{loggedStreak} Days Active</p>
          <span className="text-[10px] text-olive font-medium">Longest streak: 21 days</span>
        </Card>

        <Card className="p-4 space-y-1 bg-white">
          <span className="text-[11px] font-semibold text-warm-brown">Total Completed</span>
          <p className="text-2xl font-serif font-bold text-charcoal">42 Sessions</p>
          <span className="text-[10px] text-warm-brown">Vata-Pitta calibrated</span>
        </Card>

        <Card className="p-4 space-y-1 bg-white">
          <span className="text-[11px] font-semibold text-warm-brown">Est. Metabolic Agni Burn</span>
          <p className="text-2xl font-serif font-bold text-forest">560 kcal / week</p>
          <span className="text-[10px] text-warm-brown">Gentle non-exhausting flow</span>
        </Card>
      </div>

      {/* Toggle View */}
      <div className="flex border-b border-soft-beige gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('workouts')}
          className={`pb-3 transition-colors ${activeTab === 'workouts' ? 'text-forest border-b-2 border-forest font-bold' : 'text-warm-brown'}`}
        >
          Curated Routines
        </button>
        <button
          onClick={() => setActiveTab('asanas')}
          className={`pb-3 transition-colors ${activeTab === 'asanas' ? 'text-forest border-b-2 border-forest font-bold' : 'text-warm-brown'}`}
        >
          Classical Yoga Asana Library
        </button>
      </div>

      {/* Workouts List */}
      {activeTab === 'workouts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workouts.map((w) => (
            <Card key={w.id} className="p-5 space-y-3 bg-white flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="forest" size="sm">{w.category}</Badge>
                  <span className="text-[11px] text-warm-brown">{w.intensity} Intensity</span>
                </div>
                <h3 className="text-base font-serif font-semibold text-charcoal">{w.title}</h3>
                <p className="text-xs text-warm-brown">Target Goal: {w.targetGoal}</p>

                <div className="pt-2 text-xs text-warm-brown space-y-1">
                  <p className="font-semibold text-charcoal text-[11px]">Included Asanas:</p>
                  <p className="text-[11px] text-warm-brown line-clamp-1">{w.asanasIncluded.join(' • ')}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-soft-beige flex items-center justify-between text-xs text-warm-brown">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {w.durationMinutes} mins</span>
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-forest" /> ~{w.caloriesBurnEstimate} kcal</span>
                <Button size="sm" onClick={() => setIsLogOpen(true)} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Mark Done
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Asana Library List */}
      {activeTab === 'asanas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {asanas.map((a) => (
            <Card
              key={a.id}
              hoverable
              onClick={() => setSelectedAsana(a)}
              className="p-5 cursor-pointer bg-white space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="sand" size="sm">{a.difficulty}</Badge>
                  <span className="text-xs text-warm-brown">{a.durationMinutes} mins</span>
                </div>
                <h3 className="text-base font-serif font-semibold text-charcoal">{a.sanskritName}</h3>
                <p className="text-xs text-olive font-medium">{a.englishName}</p>
                <p className="text-xs text-warm-brown line-clamp-2 leading-relaxed">{a.primaryBenefit}</p>
              </div>

              <div className="pt-2 border-t border-soft-beige flex justify-end">
                <span className="text-xs text-forest font-semibold">Inspect Steps →</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Asana Details Modal */}
      {selectedAsana && (
        <Modal
          isOpen={!!selectedAsana}
          onClose={() => setSelectedAsana(null)}
          title={`${selectedAsana.sanskritName} (${selectedAsana.englishName})`}
          description={`Difficulty: ${selectedAsana.difficulty} • Duration: ${selectedAsana.durationMinutes} minutes`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-charcoal">
            <p className="leading-relaxed">{selectedAsana.primaryBenefit}</p>
            <div className="space-y-2">
              <h4 className="font-bold text-forest uppercase tracking-wider text-[11px]">Execution Steps</h4>
              <ol className="space-y-1.5 list-decimal list-inside text-warm-brown">
                {selectedAsana.steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
            </div>
            {selectedAsana.contraindications.length > 0 && (
              <div className="p-3 bg-state-error/10 border border-state-error/30 rounded-xl text-[#A9443D] space-y-1">
                <h5 className="font-bold text-[10px] uppercase tracking-wider">Contraindications / Caution</h5>
                <p>{selectedAsana.contraindications.join(', ')}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Log Activity Modal */}
      <Modal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Log Completed Health Movement">
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <Input
            label="Workout / Routine Name"
            required
            value={logTitle}
            onChange={(e) => setLogTitle(e.target.value)}
          />
          <Input
            label="Duration (Minutes)"
            type="number"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsLogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Log Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
