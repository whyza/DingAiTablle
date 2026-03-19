package org.example.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.ApiResponse;
import org.example.dto.RecordDTO;
import org.example.dto.SheetMetaDTO;
import org.example.service.RecordService;
import org.example.service.SheetMetaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DatasourceController {

    @Resource
    private SheetMetaService sheetMetaService;
    
    @Resource
    private  RecordService recordService;

    /**
     * 获取表结构接口
     * GET /api/sheet_meta?dataSourceId=xxx
     */
    @GetMapping("/sheet_meta")
    public ApiResponse<SheetMetaDTO.SheetMetaResponse> getSheetMeta(
            @RequestParam String dataSourceId,
            HttpServletRequest request) {

        log.info("收到表结构请求，dataSourceId: {}", dataSourceId);

        // 可选：验证签名
        // if (!signatureService.verify(request)) {
        //     throw new RuntimeException("签名验证失败");
        // }

        SheetMetaDTO.SheetMetaResponse response = sheetMetaService.getSheetMeta(dataSourceId);
        return ApiResponse.success(response);
    }

    /**
     * 获取表记录接口
     * GET /api/records?dataSourceId=xxx&sheetId=xxx&page=1&pageSize=20&filter={}
     */
    @GetMapping("/records")
    public ApiResponse<RecordDTO.RecordResponse> getRecords(
            @RequestParam String dataSourceId,
            @RequestParam String sheetId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestParam(required = false) String filter,
            HttpServletRequest request) {

        log.info("收到记录请求，dataSourceId: {}, sheetId: {}, page: {}, pageSize: {}",
                dataSourceId, sheetId, page, pageSize);

        RecordDTO.RecordResponse response = recordService.getRecords(
                dataSourceId, sheetId, page, pageSize, filter);
        return ApiResponse.success(response);
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.success("ok");
    }
}