// ============================================================================
// @tanmayee/api — Analytics & Customer Intelligence Repository
// ============================================================================

import { AnalyticsEventRecord, AnonymousSession } from '@tanmayee/types';
import { AnalyticsEvent } from '@tanmayee/config';
import { v4 as uuidv4 } from 'uuid';

const inMemorySessions = new Map<string, AnonymousSession>();
const inMemoryEvents: AnalyticsEventRecord[] = [];

// Point weights for lead scoring
const EVENT_SCORES: Record<AnalyticsEvent, number> = {
  [AnalyticsEvent.PRODUCT_VIEW]: 2,
  [AnalyticsEvent.SEARCH]: 3,
  [AnalyticsEvent.FILTER]: 3,
  [AnalyticsEvent.COMPARE]: 10,
  [AnalyticsEvent.WISHLIST]: 5,
  [AnalyticsEvent.ADD_TO_CART]: 15,
  [AnalyticsEvent.REMOVE_FROM_CART]: -5,
  [AnalyticsEvent.BROCHURE_DOWNLOAD]: 20,
  [AnalyticsEvent.WHATSAPP_CLICK]: 30,
  [AnalyticsEvent.CALL_CLICK]: 30,
  [AnalyticsEvent.QUOTE_STARTED]: 25,
  [AnalyticsEvent.QUOTE_SUBMITTED]: 50,
  [AnalyticsEvent.SERVICE_VIEW]: 5,
  [AnalyticsEvent.SERVICE_REQUEST]: 40,
};

export class AnalyticsRepository {
  getOrCreateSession(sessionToken: string, ipHash?: string, userAgent?: string): AnonymousSession {
    let session = inMemorySessions.get(sessionToken);

    if (!session) {
      session = {
        id: uuidv4(),
        session_token: sessionToken,
        interest_profile: {
          categories: {},
          brands: {},
          price_range: { min: 0, max: 0 },
        },
        lead_score: 0,
        first_seen_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        converted_at: null,
        ip_hash: ipHash || null,
        user_agent: userAgent || null,
      };
      inMemorySessions.set(sessionToken, session);
    } else {
      session.last_seen_at = new Date().toISOString();
    }

    return session;
  }

  async recordEvent(
    sessionToken: string,
    eventName: AnalyticsEvent,
    productId?: string | null,
    categoryId?: string | null,
    metadata: Record<string, any> = {}
  ): Promise<AnalyticsEventRecord> {
    const session = this.getOrCreateSession(sessionToken);

    // Update lead score
    const scoreDelta = EVENT_SCORES[eventName] || 1;
    session.lead_score = Math.max(0, session.lead_score + scoreDelta);

    // Update interest profile
    if (!session.interest_profile.categories) session.interest_profile.categories = {};
    if (!session.interest_profile.brands) session.interest_profile.brands = {};

    if (categoryId) {
      session.interest_profile.categories[categoryId] =
        (session.interest_profile.categories[categoryId] || 0) + 1;
    }
    if (metadata.brand) {
      session.interest_profile.brands[metadata.brand] =
        (session.interest_profile.brands[metadata.brand] || 0) + 1;
    }

    if (eventName === AnalyticsEvent.QUOTE_SUBMITTED || eventName === AnalyticsEvent.SERVICE_REQUEST) {
      session.converted_at = new Date().toISOString();
    }

    const eventRecord: AnalyticsEventRecord = {
      id: uuidv4(),
      session_id: session.id,
      event_name: eventName,
      product_id: productId || null,
      category_id: categoryId || null,
      metadata,
      created_at: new Date().toISOString(),
    };

    inMemoryEvents.unshift(eventRecord);
    return eventRecord;
  }

  async getSession(sessionToken: string): Promise<AnonymousSession | null> {
    return inMemorySessions.get(sessionToken) || null;
  }

  async getDashboardStats() {
    const totalEvents = inMemoryEvents.length;
    const totalSessions = inMemorySessions.size;

    const eventCounts: Record<string, number> = {};
    inMemoryEvents.forEach((e) => {
      eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
    });

    const highValueLeads = Array.from(inMemorySessions.values()).filter(
      (s) => s.lead_score >= 30
    ).length;

    const conversions = Array.from(inMemorySessions.values()).filter(
      (s) => s.converted_at !== null
    ).length;

    return {
      total_sessions: totalSessions,
      total_events: totalEvents,
      high_value_leads: highValueLeads,
      conversions: conversions,
      conversion_rate: totalSessions > 0 ? ((conversions / totalSessions) * 100).toFixed(1) + '%' : '0%',
      events_breakdown: eventCounts,
      recent_events: inMemoryEvents.slice(0, 20),
    };
  }

  async listLeadsAdmin() {
    return Array.from(inMemorySessions.values())
      .sort((a, b) => b.lead_score - a.lead_score)
      .slice(0, 50);
  }
}

export const analyticsRepository = new AnalyticsRepository();
