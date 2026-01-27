package com.example.stockwatch;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
@Slf4j
public class StockWatchlistApplication {

    private final DataSource dataSource;

    @Value("${server.port:8080}")
    private int serverPort;

    public StockWatchlistApplication(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public static void main(String[] args) {
        SpringApplication.run(StockWatchlistApplication.class, args);
    }

    @PostConstruct
    public void init() {
        log.info("========================================");
        log.info("Stock Watchlist Application Starting");
        log.info("Server Port: {}", serverPort);
        log.info("========================================");

        try (Connection connection = dataSource.getConnection()) {
            log.info("✓ Database connection successful");
            log.info("Database URL: {}", connection.getMetaData().getURL());
        } catch (Exception e) {
            log.error("✗ Database connection failed: {}", e.getMessage());
        }
    }
}
