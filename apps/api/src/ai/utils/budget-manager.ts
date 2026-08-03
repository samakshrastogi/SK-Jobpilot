import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { AIError } from '../types.js';

class AIBudgetManager {
  private dailyRequestsCount = 0;
  private dailyTokensCount = 0;
  private lastResetDate = new Date().toDateString();
  private circuitState: 'closed' | 'open' | 'half_open' = 'closed';
  private consecutiveFailures = 0;
  private lastFailureTime = 0;
  private lastSuccessTime = 0;

  private checkDailyReset() {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyRequestsCount = 0;
      this.dailyTokensCount = 0;
      this.lastResetDate = today;
    }
  }

  public checkBudgetAndCircuit(): void {
    this.checkDailyReset();

    // Check circuit breaker
    if (this.circuitState === 'open') {
      const cooldownMs = 60000; // 1 minute cooldown
      if (Date.now() - this.lastFailureTime > cooldownMs) {
        this.circuitState = 'half_open';
        logger.info('AI Circuit breaker state changed to HALF_OPEN');
      } else {
        throw new AIError(
          'AI Provider circuit breaker is OPEN due to consecutive failures.',
          'CIRCUIT_OPEN',
          false
        );
      }
    }

    // Check daily request limit
    if (this.dailyRequestsCount >= env.AI_DAILY_REQUEST_LIMIT) {
      throw new AIError(
        `Daily AI request limit of ${env.AI_DAILY_REQUEST_LIMIT} reached. Existing results remain accessible.`,
        'DAILY_REQUEST_LIMIT_REACHED',
        false
      );
    }

    // Check daily token budget
    if (this.dailyTokensCount >= env.AI_DAILY_TOKEN_BUDGET) {
      throw new AIError(
        `Daily AI token budget of ${env.AI_DAILY_TOKEN_BUDGET} tokens reached.`,
        'DAILY_TOKEN_BUDGET_REACHED',
        false
      );
    }
  }

  public recordSuccess(tokensUsed: number): void {
    this.checkDailyReset();
    this.dailyRequestsCount += 1;
    this.dailyTokensCount += tokensUsed;
    this.consecutiveFailures = 0;
    this.lastSuccessTime = Date.now();

    if (this.circuitState === 'half_open') {
      this.circuitState = 'closed';
      logger.info('AI Circuit breaker reset to CLOSED after successful request.');
    }
  }

  public recordFailure(): void {
    this.consecutiveFailures += 1;
    this.lastFailureTime = Date.now();

    if (this.consecutiveFailures >= 5) {
      this.circuitState = 'open';
      logger.warn('AI Circuit breaker state changed to OPEN after 5 consecutive failures.');
    }
  }

  public getStatus() {
    this.checkDailyReset();
    return {
      dailyRequestsCount: this.dailyRequestsCount,
      dailyRequestsLimit: env.AI_DAILY_REQUEST_LIMIT,
      dailyTokensCount: this.dailyTokensCount,
      dailyTokenBudget: env.AI_DAILY_TOKEN_BUDGET,
      circuitState: this.circuitState,
      lastSuccessTime: this.lastSuccessTime
        ? new Date(this.lastSuccessTime).toISOString()
        : undefined,
      lastFailureTime: this.lastFailureTime
        ? new Date(this.lastFailureTime).toISOString()
        : undefined,
    };
  }
}

export const aiBudgetManager = new AIBudgetManager();
