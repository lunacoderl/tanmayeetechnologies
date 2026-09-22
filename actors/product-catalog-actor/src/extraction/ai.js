/**
 * AI-Powered Structured Extraction Module.
 * Uses OpenAI structured outputs with strict adherence to provided evidence.
 * Includes token budget management, HTML cleaning, and deterministic-first merging.
 */

import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import { withRetry } from '../utils/retry.js';

const MAX_SOURCE_TEXT_CHARS = 10000; // Strict token/char budget to control costs

/**
 * Preprocesses and condenses raw HTML by stripping non-product noise:
 * scripts, styles, navigations, footers, ad blocks, and sidebars.
 */
export function preprocessHtml(rawHtml = '') {
  if (!rawHtml || typeof rawHtml !== 'string') return '';
  const $ = cheerio.load(rawHtml);

  // Remove structural noise
  $('script, style, noscript, svg, iframe, nav, footer, header, form, .advertisement, .ads, .sidebar, #nav-main, #nav-footer, .related-products, .recommended').remove();

  // Extract text and collapse excessive whitespace
  const bodyText = $('body').text() || '';
  return bodyText.replace(/\s+/g, ' ').trim().slice(0, MAX_SOURCE_TEXT_CHARS);
}

/**
 * Extensible AI Extraction Provider Interface.
 */
export class AiExtractionService {
  constructor(options = {}) {
    this.provider = options.provider || 'openai';
    this.model = options.model || 'gpt-4o-mini';
    this.apiKey = process.env.OPENAI_API_KEY || '';

    if (this.provider === 'openai' && this.apiKey) {
      this.client = new OpenAI({ apiKey: this.apiKey });
    }
  }

  isAvailable() {
    return Boolean(this.client && this.apiKey);
  }

  /**
   * Enhances deterministic extraction using AI.
   * AI can never upgrade a deterministic mismatch or invent unsupported specs.
   *
   * @param {Object} params - { evidence, requestedProduct, deterministicData, logger }
   * @returns {Promise<Object>} enhanced product data with extraction_notes
   */
  async extractProductDetails({ evidence = {}, requestedProduct = {}, deterministicData = {}, logger }) {
    if (!this.isAvailable()) {
      return {
        ...deterministicData,
        extraction_method: { ...(deterministicData.extraction_method || {}), ai: false }
      };
    }

    const condensedEvidence = {
      requested_brand: requestedProduct.brand,
      requested_category: requestedProduct.category,
      requested_model: requestedProduct.model,
      requested_capacity: requestedProduct.capacity,
      page_title: evidence.page_title,
      meta_description: evidence.meta_description,
      specifications_text: evidence.specifications_text || '',
      price_text: evidence.price_text || '',
      json_ld_summary: evidence.json_ld_summary || {},
      condensed_text: (evidence.condensed_text || '').slice(0, MAX_SOURCE_TEXT_CHARS)
    };

    const systemPrompt = `You are a strict, forensic product data extraction engineer.
Extract ONLY factual data explicitly evidenced in the supplied JSON context.
CRITICAL RULES:
1. NEVER hallucinate, guess, or infer values not explicitly mentioned.
2. If a field is not supported by evidence, set it to null or [] or {}.
3. Do NOT modify or assume model numbers.
4. If there are conflicting specifications in the evidence, note them in "extraction_notes".
5. Output must be valid JSON strictly matching the specified schema.`;

    const userPrompt = `Extract structured product details from the following evidence:\n${JSON.stringify(condensedEvidence, null, 2)}`;

    try {
      const response = await withRetry(
        async () => {
          return await this.client.chat.completions.create({
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.0
          });
        },
        {
          maxRetries: 2,
          baseDelayMs: 1500,
          onRetry: (err, attempt) => {
            logger?.log('ai_extraction_retry', { attempt, error: err.message });
          }
        }
      );

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('Empty AI response');

      const parsedAi = JSON.parse(content);

      // Conservative merge: deterministic direct evidence ALWAYS takes precedence
      const merged = { ...deterministicData };

      // Fill in description only if missing
      if (!merged.description && parsedAi.description) {
        merged.description = String(parsedAi.description).trim();
      }

      // Fill in warranty if missing
      if (!merged.warranty && parsedAi.warranty) {
        merged.warranty = String(parsedAi.warranty).trim();
      }

      // Fill in manufacturer if missing
      if (!merged.manufacturer && parsedAi.manufacturer) {
        merged.manufacturer = String(parsedAi.manufacturer).trim();
      }

      // Merge non-conflicting specifications
      if (parsedAi.specifications && typeof parsedAi.specifications === 'object') {
        merged.specifications = {
          ...parsedAi.specifications,
          ...(merged.specifications || {}) // Deterministic wins
        };
      }

      merged.extraction_notes = Array.isArray(parsedAi.extraction_notes) ? parsedAi.extraction_notes : [];
      merged.ai_model_used = this.model;
      merged.extraction_method = {
        ...(merged.extraction_method || {}),
        ai: true
      };

      return merged;
    } catch (err) {
      logger?.aiExtractionFailed(requestedProduct, 'openai', err.message);
      return {
        ...deterministicData,
        extraction_method: { ...(deterministicData.extraction_method || {}), ai: false },
        ai_error: err.message
      };
    }
  }
}
