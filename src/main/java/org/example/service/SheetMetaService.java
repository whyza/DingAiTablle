package org.example.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.SheetMetaDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SheetMetaService {

    private final JdbcTemplate jdbcTemplate;

    public SheetMetaDTO.SheetMetaResponse getSheetMeta(String dataSourceId) {
        // 查询所有表 【Java 8 普通字符串】
        String sql = "SELECT TABLE_NAME, TABLE_COMMENT " +
                "FROM INFORMATION_SCHEMA.TABLES " +
                "WHERE TABLE_SCHEMA = database() " +
                "ORDER BY TABLE_NAME";

        List<Map<String, Object>> tables = jdbcTemplate.queryForList(sql);
        List<SheetMetaDTO.SheetInfo> sheets = new ArrayList<>();

        for (Map<String, Object> table : tables) {
            String tableName = (String) table.get("TABLE_NAME");
            String tableComment = (String) table.get("TABLE_COMMENT");

            // 查询列信息 【Java 8 普通字符串】
            String columnSql = "SELECT COLUMN_NAME, COLUMN_COMMENT, DATA_TYPE, IS_NULLABLE, COLUMN_KEY " +
                    "FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_SCHEMA = database() AND TABLE_NAME = ? " +
                    "ORDER BY ORDINAL_POSITION";

            List<Map<String, Object>> columns = jdbcTemplate.queryForList(columnSql, tableName);
            List<SheetMetaDTO.ColumnInfo> columnInfos = new ArrayList<>();

            for (Map<String, Object> col : columns) {
                columnInfos.add(SheetMetaDTO.ColumnInfo.builder()
                        .columnId((String) col.get("COLUMN_NAME"))
                        .columnName(getCommentOrDefault(col.get("COLUMN_COMMENT"), (String) col.get("COLUMN_NAME")))
                        .dataType(mapDataType((String) col.get("DATA_TYPE")))
                        .required("NO".equals(col.get("IS_NULLABLE")))
                        .isPrimary("PRI".equals(col.get("COLUMN_KEY")))
                        .build());
            }

            sheets.add(SheetMetaDTO.SheetInfo.builder()
                    .sheetId(tableName)
                    .sheetName(getCommentOrDefault(tableComment, tableName))
                    .columns(columnInfos)
                    .build());
        }

        return new SheetMetaDTO.SheetMetaResponse(sheets);
    }

    private String getCommentOrDefault(Object comment, String defaultValue) {
        return comment != null && !comment.toString().isEmpty()
                ? comment.toString()
                : defaultValue;
    }

    /**
     * MySQL 数据类型 → 钉钉数据类型映射
     * 【改成 Java 8 传统 switch】
     */
    private String mapDataType(String mysqlType) {
        if (mysqlType == null) return "text";

        String type = mysqlType.toLowerCase();
        switch (type) {
            case "tinyint":
            case "smallint":
            case "mediumint":
            case "int":
            case "integer":
            case "bigint":
            case "float":
            case "double":
            case "decimal":
            case "numeric":
            case "real":
                return "number";
            case "varchar":
            case "char":
            case "text":
            case "tinytext":
            case "mediumtext":
            case "longtext":
                return "text";
            case "datetime":
            case "timestamp":
                return "datetime";
            case "date":
                return "date";
            case "time":
                return "text";
            case "bit":
            case "boolean":
                return "checkbox";
            case "json":
                return "text";
            default:
                return "text";
        }
    }
}