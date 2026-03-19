package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class RecordDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecordResponse {
        private List<RecordInfo> records;
        private Long total;
        private Integer page;
        private Integer pageSize;
        private Boolean hasMore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecordInfo {
        private String id;
        private Map<String, Object> values;
    }
}