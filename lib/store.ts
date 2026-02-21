/**
 * Global state management using Zustand
 * Single source of truth for application state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { BloodworkResult, Patient, AIInsight } from './validation';

// ============================================================================
// State Interface
// ============================================================================

interface WorxState {
  // Patient data
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;

  // Bloodwork data
  bloodworkResults: BloodworkResult[];
  addBloodworkResult: (result: BloodworkResult) => void;
  getBloodworkById: (id: string) => BloodworkResult | undefined;

  // AI Insights
  insights: AIInsight[];
  addInsight: (insight: AIInsight) => void;
  getInsightsByBloodworkId: (bloodworkId: string) => AIInsight[];

  // UI State
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  
  selectedMetricCategory: string | null;
  setSelectedMetricCategory: (category: string | null) => void;

  // Actions
  reset: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  currentPatient: null,
  bloodworkResults: [],
  insights: [],
  isAnalyzing: false,
  selectedMetricCategory: null,
};

// ============================================================================
// Store
// ============================================================================

export const useWorxStore = create<WorxState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Patient actions
        setCurrentPatient: (patient) =>
          set({ currentPatient: patient }, false, 'setCurrentPatient'),

        // Bloodwork actions
        addBloodworkResult: (result) =>
          set(
            (state) => ({
              bloodworkResults: [...state.bloodworkResults, result],
            }),
            false,
            'addBloodworkResult'
          ),

        getBloodworkById: (id) => {
          return get().bloodworkResults.find((result) => result.id === id);
        },

        // AI Insights actions
        addInsight: (insight) =>
          set(
            (state) => ({
              insights: [...state.insights, insight],
            }),
            false,
            'addInsight'
          ),

        getInsightsByBloodworkId: (bloodworkId) => {
          return get().insights.filter(
            (insight) => insight.bloodworkId === bloodworkId
          );
        },

        // UI actions
        setIsAnalyzing: (analyzing) =>
          set({ isAnalyzing: analyzing }, false, 'setIsAnalyzing'),

        setSelectedMetricCategory: (category) =>
          set({ selectedMetricCategory: category }, false, 'setSelectedMetricCategory'),

        // Reset all state
        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'worx-storage',
        // Only persist certain fields (not UI state)
        partialize: (state) => ({
          currentPatient: state.currentPatient,
          bloodworkResults: state.bloodworkResults,
          insights: state.insights,
        }),
      }
    ),
    { name: 'WorxStore' }
  )
);

// ============================================================================
// Selectors (for optimized re-renders)
// ============================================================================

export const selectCurrentPatient = (state: WorxState) => state.currentPatient;
export const selectBloodworkResults = (state: WorxState) => state.bloodworkResults;
export const selectInsights = (state: WorxState) => state.insights;
export const selectIsAnalyzing = (state: WorxState) => state.isAnalyzing;
