package com.example.stockwatch.controller;

import com.example.stockwatch.dto.StockQuote;
import com.example.stockwatch.dto.StockSearchResult;
import com.example.stockwatch.service.FinnhubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final FinnhubService finnhubService;

    /**
     * Search for stocks by symbol or company name
     * GET /api/stocks/search?q=AAPL
     */
    @GetMapping("/search")
    public ResponseEntity<List<StockSearchResult>> searchStocks(@RequestParam("q") String query) {
        if (query == null || query.trim().length() < 1) {
            return ResponseEntity.badRequest().body(List.of());
        }

        List<StockSearchResult> results = finnhubService.searchSymbol(query.trim());
        return ResponseEntity.ok(results);
    }

    /**
     * Get real-time quote for a single stock
     * GET /api/stocks/quote/AAPL
     */
    @GetMapping("/quote/{symbol}")
    public ResponseEntity<StockQuote> getQuote(@PathVariable String symbol) {
        StockQuote quote = finnhubService.getQuote(symbol.toUpperCase());

        if (quote == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(quote);
    }

    /**
     * Get quotes for multiple stocks (comma-separated)
     * GET /api/stocks/quotes?symbols=AAPL,GOOGL,MSFT
     */
    @GetMapping("/quotes")
    public ResponseEntity<List<StockQuote>> getQuotes(@RequestParam("symbols") String symbols) {
        if (symbols == null || symbols.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(List.of());
        }

        List<String> symbolList = Arrays.asList(symbols.toUpperCase().split(","));
        List<StockQuote> quotes = finnhubService.getQuotes(symbolList);

        return ResponseEntity.ok(quotes);
    }
}
