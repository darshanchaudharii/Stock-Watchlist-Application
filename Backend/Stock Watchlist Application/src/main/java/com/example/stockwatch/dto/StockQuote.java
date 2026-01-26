package com.example.stockwatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockQuote {
    private String symbol;
    private String name;
    private Double currentPrice; // c - Current price
    private Double change; // d - Change
    private Double percentChange; // dp - Percent change
    private Double highPrice; // h - High price of the day
    private Double lowPrice; // l - Low price of the day
    private Double openPrice; // o - Open price of the day
    private Double previousClose; // pc - Previous close price
    private Long timestamp; // t - Timestamp
}
