/**
 * Zustand Store Tests
 * 
 * Tests for global state management in lib/store.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useWorxStore } from '../store';
import { MOCK_PATIENT, MOCK_BLOODWORK } from '../validation';
import type { AIInsight } from '../validation';

describe('WorxStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useWorxStore.getState().reset();
  });

  describe('Patient Management', () => {
    it('initializes with null patient', () => {
      const { currentPatient } = useWorxStore.getState();
      expect(currentPatient).toBeNull();
    });

    it('sets current patient', () => {
      const { setCurrentPatient } = useWorxStore.getState();
      
      setCurrentPatient(MOCK_PATIENT);
      
      const { currentPatient } = useWorxStore.getState();
      expect(currentPatient).toEqual(MOCK_PATIENT);
    });

    it('clears current patient', () => {
      const { setCurrentPatient } = useWorxStore.getState();
      
      setCurrentPatient(MOCK_PATIENT);
      setCurrentPatient(null);
      
      const { currentPatient } = useWorxStore.getState();
      expect(currentPatient).toBeNull();
    });
  });

  describe('Bloodwork Management', () => {
    it('initializes with empty bloodwork results', () => {
      const { bloodworkResults } = useWorxStore.getState();
      expect(bloodworkResults).toEqual([]);
    });

    it('adds bloodwork result', () => {
      const { addBloodworkResult, bloodworkResults } = useWorxStore.getState();
      
      addBloodworkResult(MOCK_BLOODWORK);
      
      const updatedResults = useWorxStore.getState().bloodworkResults;
      expect(updatedResults).toHaveLength(1);
      expect(updatedResults[0]).toEqual(MOCK_BLOODWORK);
    });

    it('adds multiple bloodwork results', () => {
      const { addBloodworkResult } = useWorxStore.getState();
      
      const result2 = { ...MOCK_BLOODWORK, id: '550e8400-e29b-41d4-a716-446655440099' };
      
      addBloodworkResult(MOCK_BLOODWORK);
      addBloodworkResult(result2);
      
      const { bloodworkResults } = useWorxStore.getState();
      expect(bloodworkResults).toHaveLength(2);
    });

    it('gets bloodwork by ID', () => {
      const { addBloodworkResult, getBloodworkById } = useWorxStore.getState();
      
      addBloodworkResult(MOCK_BLOODWORK);
      
      const found = getBloodworkById(MOCK_BLOODWORK.id);
      expect(found).toEqual(MOCK_BLOODWORK);
    });

    it('returns undefined for non-existent bloodwork ID', () => {
      const { getBloodworkById } = useWorxStore.getState();
      
      const found = getBloodworkById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('AI Insights Management', () => {
    it('initializes with empty insights', () => {
      const { insights } = useWorxStore.getState();
      expect(insights).toEqual([]);
    });

    it('adds insight', () => {
      const { addInsight } = useWorxStore.getState();
      
      const mockInsight: AIInsight = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        bloodworkId: MOCK_BLOODWORK.id,
        generatedAt: new Date().toISOString(),
        insights: [
          {
            type: 'warning',
            severity: 'high',
            title: 'Test Warning',
            description: 'This is a test warning',
            affectedMetrics: ['Glucose'],
          },
        ],
        summary: 'Test summary',
        model: 'claude-sonnet-4',
      };
      
      addInsight(mockInsight);
      
      const { insights } = useWorxStore.getState();
      expect(insights).toHaveLength(1);
      expect(insights[0]).toEqual(mockInsight);
    });

    it('gets insights by bloodwork ID', () => {
      const { addInsight, getInsightsByBloodworkId } = useWorxStore.getState();
      
      const insight1: AIInsight = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        bloodworkId: MOCK_BLOODWORK.id,
        generatedAt: new Date().toISOString(),
        insights: [],
        summary: 'Test 1',
        model: 'claude-sonnet-4',
      };
      
      const insight2: AIInsight = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        bloodworkId: 'other-bloodwork-id',
        generatedAt: new Date().toISOString(),
        insights: [],
        summary: 'Test 2',
        model: 'claude-sonnet-4',
      };
      
      addInsight(insight1);
      addInsight(insight2);
      
      const foundInsights = getInsightsByBloodworkId(MOCK_BLOODWORK.id);
      expect(foundInsights).toHaveLength(1);
      expect(foundInsights[0].id).toBe(insight1.id);
    });

    it('returns empty array for non-existent bloodwork ID', () => {
      const { getInsightsByBloodworkId } = useWorxStore.getState();
      
      const foundInsights = getInsightsByBloodworkId('non-existent-id');
      expect(foundInsights).toEqual([]);
    });
  });

  describe('UI State', () => {
    it('initializes with isAnalyzing false', () => {
      const { isAnalyzing } = useWorxStore.getState();
      expect(isAnalyzing).toBe(false);
    });

    it('sets isAnalyzing state', () => {
      const { setIsAnalyzing } = useWorxStore.getState();
      
      setIsAnalyzing(true);
      expect(useWorxStore.getState().isAnalyzing).toBe(true);
      
      setIsAnalyzing(false);
      expect(useWorxStore.getState().isAnalyzing).toBe(false);
    });

    it('initializes with null selectedMetricCategory', () => {
      const { selectedMetricCategory } = useWorxStore.getState();
      expect(selectedMetricCategory).toBeNull();
    });

    it('sets selected metric category', () => {
      const { setSelectedMetricCategory } = useWorxStore.getState();
      
      setSelectedMetricCategory('CBC');
      expect(useWorxStore.getState().selectedMetricCategory).toBe('CBC');
      
      setSelectedMetricCategory(null);
      expect(useWorxStore.getState().selectedMetricCategory).toBeNull();
    });
  });

  describe('Reset', () => {
    it('resets all state to initial values', () => {
      const {
        setCurrentPatient,
        addBloodworkResult,
        setIsAnalyzing,
        setSelectedMetricCategory,
        reset,
      } = useWorxStore.getState();
      
      // Populate state
      setCurrentPatient(MOCK_PATIENT);
      addBloodworkResult(MOCK_BLOODWORK);
      setIsAnalyzing(true);
      setSelectedMetricCategory('CBC');
      
      // Verify state is populated
      expect(useWorxStore.getState().currentPatient).not.toBeNull();
      expect(useWorxStore.getState().bloodworkResults).toHaveLength(1);
      expect(useWorxStore.getState().isAnalyzing).toBe(true);
      expect(useWorxStore.getState().selectedMetricCategory).toBe('CBC');
      
      // Reset
      reset();
      
      // Verify state is reset
      const state = useWorxStore.getState();
      expect(state.currentPatient).toBeNull();
      expect(state.bloodworkResults).toEqual([]);
      expect(state.insights).toEqual([]);
      expect(state.isAnalyzing).toBe(false);
      expect(state.selectedMetricCategory).toBeNull();
    });
  });
});
