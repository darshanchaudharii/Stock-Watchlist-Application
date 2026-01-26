package com.example.stockwatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistItemDto {
    private Long id;
    private String symbol;
    private String companyName;
    private Double currentPrice;
    private Double change;
    private Double percentChange;
    private String addedAt;
}
