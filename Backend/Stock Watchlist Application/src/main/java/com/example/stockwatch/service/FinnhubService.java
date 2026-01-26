package com.example.stockwatch.service;

import com.example.stockwatch.dto.StockQuote;
import com.example.stockwatch.dto.StockSearchResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class FinnhubService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${stock.api.base-url}")
    private String baseUrl;

    @Value("${stock.api.api-key}")
    private String apiKey;

    public FinnhubService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Search for stocks by symbol or company name
     * Uses Finnhub /search endpoint
     */
    public List<StockSearchResult> searchSymbol(String query) {
        try {
            String url = String.format("%s/search?q=%s&token=%s", baseUrl, query, apiKey);
            log.info("Searching stocks with query: {}", query);

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.get("result");

            List<StockSearchResult> searchResults = new ArrayList<>();
            if (results != null && results.isArray()) {
                for (JsonNode node : results) {
                    // Filter to only show common stocks (type = "Common Stock")
                    String type = node.has("type") ? node.get("type").asText() : "";
                    if (type.isEmpty() || type.contains("Common Stock") || type.contains("ETP")) {
                        StockSearchResult result = StockSearchResult.builder()
                                .symbol(node.get("symbol").asText())
                                .description(node.get("description").asText())
                                .type(type)
                                .build();
                        searchResults.add(result);
                    }
                }
            }

            // Limit to first 10 results
            return searchResults.size() > 10 ? searchResults.subList(0, 10) : searchResults;
        } catch (Exception e) {
            log.error("Error searching stocks: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Failed to search stocks");
        }
    }

    /**
     * Get real-time quote for a stock symbol
     * Uses Finnhub /quote endpoint
     */
    @Cacheable(value = "stockQuotes", key = "#symbol", unless = "#result == null")
    public StockQuote getQuote(String symbol) {
        int maxRetries = 3;
        int retryCount = 0;
        long waitTime = 500; // Start with 500ms

        while (retryCount < maxRetries) {
            try {
                String url = String.format("%s/quote?symbol=%s&token=%s", baseUrl, symbol, apiKey);
                log.info("Fetching quote for symbol: {} (Attempt {})", symbol, retryCount + 1);

                String response = restTemplate.getForObject(url, String.class);
                JsonNode root = objectMapper.readTree(response);

                // Check for error in response or empty payload
                if (root.has("error")) {
                    log.error("API returned error: {}", root.get("error").asText());
                    // If rate limit error or server error, maybe retry?
                    // For now, let's treat it as failure unless it's a known transient code
                }

                // Check if we got valid data (c = current price should be > 0)
                double currentPrice = root.has("c") ? root.get("c").asDouble() : 0;
                if (currentPrice == 0) {
                    // Finnhub returns all 0s for invalid symbols, don't retry
                    log.warn("No quote data found for symbol: {}", symbol);
                    return null;
                }

                return StockQuote.builder()
                        .symbol(symbol)
                        .currentPrice(currentPrice)
                        .change(root.has("d") ? root.get("d").asDouble() : 0)
                        .percentChange(root.has("dp") ? root.get("dp").asDouble() : 0)
                        .highPrice(root.has("h") ? root.get("h").asDouble() : 0)
                        .lowPrice(root.has("l") ? root.get("l").asDouble() : 0)
                        .openPrice(root.has("o") ? root.get("o").asDouble() : 0)
                        .previousClose(root.has("pc") ? root.get("pc").asDouble() : 0)
                        .timestamp(root.has("t") ? root.get("t").asLong() : 0)
                        .build();

            } catch (Exception e) {
                log.error("Error fetching quote for {}: {}", symbol, e.getMessage());

                // Only retry on specific errors (5xx, timeouts)
                boolean shouldRetry = e.getMessage().contains("502") ||
                        e.getMessage().contains("503") ||
                        e.getMessage().contains("504") ||
                        e.getMessage().contains("timeout");

                if (shouldRetry && retryCount < maxRetries - 1) {
                    retryCount++;
                    log.warn("Retrying quote fetch for {} in {}ms...", symbol, waitTime);
                    try {
                        Thread.sleep(waitTime);
                        waitTime *= 2; // Exponential backoff
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                } else {
                    return null;
                }
            }
        }
        return null;
    }

    /**
     * Get quotes for multiple symbols
     */
    public List<StockQuote> getQuotes(List<String> symbols) {
        List<StockQuote> quotes = new ArrayList<>();
        for (String symbol : symbols) {
            StockQuote quote = getQuote(symbol);
            if (quote != null) {
                quotes.add(quote);
            }
        }
        return quotes;
    }
}
