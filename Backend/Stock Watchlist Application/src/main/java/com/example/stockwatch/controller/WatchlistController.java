package com.example.stockwatch.controller;

import com.example.stockwatch.dto.AddStockRequest;
import com.example.stockwatch.dto.WatchlistItemDto;
import com.example.stockwatch.entity.User;
import com.example.stockwatch.repository.UserRepository;
import com.example.stockwatch.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;
    private final UserRepository userRepository;

    /**
     * Get current user's watchlist
     * GET /api/watchlist
     */
    @GetMapping
    public ResponseEntity<List<WatchlistItemDto>> getWatchlist(@AuthenticationPrincipal OAuth2User principal) {
        Long userId = getUserId(principal);
        List<WatchlistItemDto> watchlist = watchlistService.getUserWatchlist(userId);
        return ResponseEntity.ok(watchlist);
    }

    /**
     * Add stock to watchlist
     * POST /api/watchlist
     */
    @PostMapping
    public ResponseEntity<WatchlistItemDto> addToWatchlist(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody AddStockRequest request) {

        if (request.getSymbol() == null || request.getSymbol().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Symbol is required");
        }

        Long userId = getUserId(principal);
        WatchlistItemDto item = watchlistService.addToWatchlist(
                userId,
                request.getSymbol().trim(),
                request.getCompanyName());

        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    /**
     * Remove stock from watchlist
     * DELETE /api/watchlist/{symbol}
     */
    @DeleteMapping("/{symbol}")
    public ResponseEntity<Map<String, String>> removeFromWatchlist(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable String symbol) {

        Long userId = getUserId(principal);
        watchlistService.removeFromWatchlist(userId, symbol);

        return ResponseEntity.ok(Map.of("message", "Stock removed from watchlist"));
    }

    /**
     * Check if stock is in watchlist
     * GET /api/watchlist/check/{symbol}
     */
    @GetMapping("/check/{symbol}")
    public ResponseEntity<Map<String, Boolean>> checkInWatchlist(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable String symbol) {

        Long userId = getUserId(principal);
        boolean inWatchlist = watchlistService.isInWatchlist(userId, symbol);

        return ResponseEntity.ok(Map.of("inWatchlist", inWatchlist));
    }

    /**
     * Get watchlist count
     * GET /api/watchlist/count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getWatchlistCount(@AuthenticationPrincipal OAuth2User principal) {
        Long userId = getUserId(principal);
        long count = watchlistService.getWatchlistCount(userId);

        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Helper to get user ID from OAuth principal
     */
    private Long getUserId(OAuth2User principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        String googleId = principal.getAttribute("sub");
        if (googleId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication");
        }

        User user = userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return user.getId();
    }
}
