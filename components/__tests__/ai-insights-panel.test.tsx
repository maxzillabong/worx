/**
 * AI Insights Panel Component Tests
 *
 * Tests empty, loading, error, and display states of the AIInsightsPanel.
 * Verifies fetch interactions, Zustand store integration, and severity styling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MOCK_BLOODWORK } from '@/lib/validation';
import type { AIInsight } from '@/lib/validation';

// ============================================================================
// Mocks
// ============================================================================

// Mock Zustand store — selector-based usage: useWorxStore((s) => s.field)
const mockStore = {
  isAnalyzing: false,
  setIsAnalyzing: vi.fn(),
  addInsight: vi.fn(),
  insights: [] as AIInsight[],
};

vi.mock('@/lib/store', () => ({
  useWorxStore: (selector: (state: typeof mockStore) => unknown) =>
    selector(mockStore),
}));

// Mock framer-motion to avoid animation issues in happy-dom
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => {
      // Strip framer-motion-specific props before passing to DOM
      const {
        initial,
        animate,
        exit,
        transition,
        whileHover,
        whileTap,
        ...validProps
      } = props;
      return React.createElement('div', validProps, children);
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children),
}));

// Import the component after mocks are in place
import { AIInsightsPanel } from '../ai-insights-panel';

// ============================================================================
// Mock Data
// ============================================================================

const mockAIInsight: AIInsight = {
  id: '550e8400-e29b-41d4-a716-446655440099',
  bloodworkId: MOCK_BLOODWORK.id,
  generatedAt: new Date().toISOString(),
  insights: [
    {
      type: 'warning',
      severity: 'medium',
      title: 'Elevated White Blood Cells',
      description: 'WBC count is slightly above normal range.',
      affectedMetrics: ['White Blood Cells'],
    },
    {
      type: 'recommendation',
      severity: 'low',
      title: 'Monitor Glucose',
      description: 'Consider monitoring glucose levels.',
      affectedMetrics: ['Glucose'],
    },
  ],
  summary: 'Overall results look mostly normal.',
  model: 'claude-sonnet-4-20250514',
};

// ============================================================================
// Test Helpers
// ============================================================================

function resetMockStore(): void {
  mockStore.isAnalyzing = false;
  mockStore.insights = [];
  mockStore.setIsAnalyzing.mockClear();
  mockStore.addInsight.mockClear();
}

// ============================================================================
// Tests
// ============================================================================

describe('AIInsightsPanel', () => {
  beforeEach(() => {
    resetMockStore();
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------------------------
  // Empty State
  // --------------------------------------------------------------------------

  describe('Empty state', () => {
    it('renders "AI Blood Analysis" heading', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(screen.getByText('AI Blood Analysis')).toBeInTheDocument();
    });

    it('renders "Generate Insights" button', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      const button = screen.getByRole('button', { name: /generate insights/i });
      expect(button).toBeInTheDocument();
    });

    it('renders the "Generate Insights" button as enabled', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      const button = screen.getByRole('button', { name: /generate insights/i });
      expect(button).not.toBeDisabled();
    });

    it('shows feature list items', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(
        screen.getByText('Analyze patterns across all metrics')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Identify correlations and trends')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Personalized health recommendations')
      ).toBeInTheDocument();
    });

    it('shows "Powered by Claude" subtitle', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(screen.getByText('Powered by Claude')).toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Loading State
  // --------------------------------------------------------------------------

  describe('Loading state', () => {
    it('shows "Analyzing bloodwork" text when isAnalyzing is true', () => {
      mockStore.isAnalyzing = true;

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(screen.getByText('Analyzing bloodwork')).toBeInTheDocument();
    });

    it('shows the loading subtitle message', () => {
      mockStore.isAnalyzing = true;

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(
        screen.getByText('This may take a moment...')
      ).toBeInTheDocument();
    });

    it('does not show the "Generate Insights" button while loading', () => {
      mockStore.isAnalyzing = true;

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(
        screen.queryByRole('button', { name: /generate insights/i })
      ).not.toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Error State
  // --------------------------------------------------------------------------

  describe('Error state', () => {
    it('shows error message when fetch rejects', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValueOnce(new Error('Network failure'))
      );

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(
        screen.getByRole('button', { name: /generate insights/i })
      );

      await waitFor(() => {
        expect(screen.getByText('Network failure')).toBeInTheDocument();
      });
    });

    it('shows error message on non-ok response', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: false,
          json: async () => ({
            success: false,
            error: { code: 'ANALYSIS_FAILED', message: 'Service unavailable' },
          }),
        })
      );

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(
        screen.getByRole('button', { name: /generate insights/i })
      );

      await waitFor(() => {
        expect(screen.getByText('Service unavailable')).toBeInTheDocument();
      });
    });

    it('shows fallback error message when error has no message', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: false,
          json: async () => ({ success: false }),
        })
      );

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(
        screen.getByRole('button', { name: /generate insights/i })
      );

      await waitFor(() => {
        expect(screen.getByText('Analysis failed')).toBeInTheDocument();
      });
    });
  });

  // --------------------------------------------------------------------------
  // Insights Display State
  // --------------------------------------------------------------------------

  describe('Insights display state', () => {
    beforeEach(() => {
      mockStore.insights = [mockAIInsight];
    });

    it('renders the insight count', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(screen.getByText('2 found')).toBeInTheDocument();
    });

    it('renders the summary text', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(
        screen.getByText('Overall results look mostly normal.')
      ).toBeInTheDocument();
    });

    it('renders insight cards with titles', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(
        screen.getByText('Elevated White Blood Cells')
      ).toBeInTheDocument();
      expect(screen.getByText('Monitor Glucose')).toBeInTheDocument();
    });

    it('renders severity labels', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('renders type labels', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Recommendation')).toBeInTheDocument();
    });

    it('renders "Re-analyze" button', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      const button = screen.getByRole('button', { name: /re-analyze/i });
      expect(button).toBeInTheDocument();
    });

    it('shows the model name', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(
        screen.getByText('Model: claude-sonnet-4-20250514')
      ).toBeInTheDocument();
    });

    it('renders the "AI Insights" heading', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(screen.getByText('AI Insights')).toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // Expandable Insight Details
  // --------------------------------------------------------------------------

  describe('Expandable insight details', () => {
    beforeEach(() => {
      mockStore.insights = [mockAIInsight];
    });

    it('expands insight card to show description on click', async () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      // Description should not be visible initially
      expect(
        screen.queryByText('WBC count is slightly above normal range.')
      ).not.toBeInTheDocument();

      // Click the expand button for the first insight
      const expandButton = screen.getByText('Elevated White Blood Cells')
        .closest('button') as HTMLElement;
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(
          screen.getByText('WBC count is slightly above normal range.')
        ).toBeInTheDocument();
      });
    });

    it('shows affected metrics when expanded', async () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      const expandButton = screen.getByText('Elevated White Blood Cells')
        .closest('button') as HTMLElement;
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText('White Blood Cells')).toBeInTheDocument();
      });
    });
  });

  // --------------------------------------------------------------------------
  // Interaction
  // --------------------------------------------------------------------------

  describe('Interaction', () => {
    it('calls fetch with correct params on "Generate Insights" click', async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAIInsight }),
      });
      vi.stubGlobal('fetch', mockFetch);

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(
        screen.getByRole('button', { name: /generate insights/i })
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bloodworkId: MOCK_BLOODWORK.id }),
        });
      });
    });

    it('calls setIsAnalyzing(true) when analysis starts', () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAIInsight }),
      });
      vi.stubGlobal('fetch', mockFetch);

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(
        screen.getByRole('button', { name: /generate insights/i })
      );

      expect(mockStore.setIsAnalyzing).toHaveBeenCalledWith(true);
    });

    it('calls addInsight on successful response', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockAIInsight }),
        })
      );

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(
        screen.getByRole('button', { name: /generate insights/i })
      );

      await waitFor(() => {
        expect(mockStore.addInsight).toHaveBeenCalledWith(mockAIInsight);
      });
    });

    it('calls setIsAnalyzing(false) after analysis completes', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockAIInsight }),
        })
      );

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(
        screen.getByRole('button', { name: /generate insights/i })
      );

      await waitFor(() => {
        expect(mockStore.setIsAnalyzing).toHaveBeenCalledWith(false);
      });
    });

    it('calls setIsAnalyzing(false) even when fetch fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValueOnce(new Error('Network error'))
      );

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(
        screen.getByRole('button', { name: /generate insights/i })
      );

      await waitFor(() => {
        expect(mockStore.setIsAnalyzing).toHaveBeenCalledWith(false);
      });
    });

    it('calls fetch on "Re-analyze" click when insights exist', async () => {
      mockStore.insights = [mockAIInsight];

      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAIInsight }),
      });
      vi.stubGlobal('fetch', mockFetch);

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      fireEvent.click(screen.getByRole('button', { name: /re-analyze/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bloodworkId: MOCK_BLOODWORK.id }),
        });
      });
    });
  });

  // --------------------------------------------------------------------------
  // Edge Cases
  // --------------------------------------------------------------------------

  describe('Edge cases', () => {
    it('only shows insights matching the bloodwork id', () => {
      const unrelatedInsight: AIInsight = {
        ...mockAIInsight,
        id: '550e8400-e29b-41d4-a716-446655440098',
        bloodworkId: '550e8400-e29b-41d4-a716-446655440077',
      };
      mockStore.insights = [unrelatedInsight];

      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      // Should show empty state since no insights match the bloodwork id
      expect(screen.getByText('AI Blood Analysis')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /generate insights/i })
      ).toBeInTheDocument();
    });

    it('shows the disclaimer text', () => {
      render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);

      expect(
        screen.getByText(/not medical advice/i)
      ).toBeInTheDocument();
    });
  });
});
