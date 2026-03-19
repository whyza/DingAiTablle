package org.example.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.RecordDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecordService {

    private final JdbcTemplate jdbcTemplate;

    public RecordDTO.RecordResponse getRecords(
            String dataSourceId,
            String sheetId,
            Integer page,
            Integer pageSize,
            String filter) {

        log.info("查询记录，sheetId: {}, page: {}, pageSize: {}, filter: {}", sheetId, page, pageSize, filter);

        String countSql = String.format("SELECT COUNT(*) FROM `%s`", sheetId);
        Long total = jdbcTemplate.queryForObject(countSql, Long.class);

        int offset = (page - 1) * pageSize;
        String dataSql = String.format("SELECT * FROM `%s` LIMIT %d OFFSET %d", sheetId, pageSize, offset);

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(dataSql);
        List<RecordDTO.RecordInfo> records = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            records.add(RecordDTO.RecordInfo.builder()
                    .id(generateRecordId(row))
                    .values(row)
                    .build());
        }

        boolean hasMore = (long) page * pageSize < total;

        return RecordDTO.RecordResponse.builder()
                .records(records)
                .total(total)
                .page(page)
                .pageSize(pageSize)
                .hasMore(hasMore)
                .build();
    }

    private String generateRecordId(Map<String, Object> row) {
        if (row.containsKey("id")) {
            return String.valueOf(row.get("id"));
        }
        return String.valueOf(System.currentTimeMillis());
    }
}
