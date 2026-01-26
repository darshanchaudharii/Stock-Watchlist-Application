package com.example.stockwatch.service;

import com.example.stockwatch.dto.StockQuote;
import com.example.stockwatch.dto.WatchlistItemDto;
import com.example.stockwatch.entity.User;
import com.example.stockwatch.entity.WatchlistItem;
import com.example.stockwatch.repository.UserRepository;
import com.example.stockwatch.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;
    private final FinnhubService finnhubService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    /**
     * Get all watchlist items for a user with current prices
     */
    public List<WatchlistItemDto> getUserWatchlist(Long userId) {
        List<WatchlistItem> items = watchlistRepository.findByUserIdOrderByAddedAtDesc(userId);

        return items.stream().map(item -> {
            StockQuote quote = finnhubService.getQuote(item.getSymbol());

            return WatchlistItemDto.builder()
                    .id(item.getId())
                    .symbol(item.getSymbol())
                    .companyName(item.getCompanyName())
                    .currentPrice(quote != null ? quote.getCurrentPrice() : null)
                    .change(quote != null ? quote.getChange() : null)
                    .percentChange(quote != null ? quote.getPercentChange() : null)
                    .addedAt(item.getAddedAt() != null ? item.getAddedAt().format(DATE_FORMATTER) : null)
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Add a stock to user's watchlist
     */
    @Transactional
    public WatchlistItemDto addToWatchlist(Long userId, String symbol, String companyName) {
        // Check if already exists
        if (watchlistRepository.existsByUserIdAndSymbol(userId, symbol.toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock already in watchlist");
        }

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Create and save watchlist item
        WatchlistItem item = WatchlistItem.builder()
                .user(user)
                .symbol(symbol.toUpperCase())
                .companyName(companyName)
                .build();

        WatchlistItem saved = watchlistRepository.save(item);
        log.info("Added {} to watchlist for user {}", symbol, userId);

        // Get current quote
        StockQuote quote = finnhubService.getQuote(saved.getSymbol());

        return WatchlistItemDto.builder()
                .id(saved.getId())
                .symbol(saved.getSymbol())
                .companyName(saved.getCompanyName())
                .currentPrice(quote != null ? quote.getCurrentPrice() : null)
                .change(quote != null ? quote.getChange() : null)
                .percentChange(quote != null ? quote.getPercentChange() : null)
                .addedAt(saved.getAddedAt() != null ? saved.getAddedAt().format(DATE_FORMATTER) : null)
                .build();
    }

    /**
     * Remove a stock from user's watchlist
     */
    @Transactional
    public void removeFromWatchlist(Long userId, String symbol) {
        if (!watchlistRepository.existsByUserIdAndSymbol(userId, symbol.toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock not in watchlist");
        }

        watchlistRepository.deleteByUserIdAndSymbol(userId, symbol.toUpperCase());
        log.info("Removed {} from watchlist for user {}", symbol, userId);
    }

    /**
     * Check if stock is in user's watchlist
     */
    public boolean isInWatchlist(Long userId, String symbol) {
        return watchlistRepository.existsByUserIdAndSymbol(userId, symbol.toUpperCase());
    }

    /**
     * Get watchlist count for user
     */
    public long getWatchlistCount(Long userId) {
        return watchlistRepository.countByUserId(userId);
    }
}
