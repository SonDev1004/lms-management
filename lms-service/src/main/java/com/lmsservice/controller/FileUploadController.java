package com.lmsservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lmsservice.service.MinioService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class FileUploadController {

    MinioService minioService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = minioService.uploadFile("test-upload", file);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("File uploaded successfully");
    }

    @PostMapping("/presigned-url")
    public ResponseEntity<String> getPresignedUrl(@RequestParam("fileName") String fileName) throws Exception {
        String url = minioService.generatePresignedUrl("test-upload", fileName, 60 * 10); // 10 phút
        return ResponseEntity.ok(url);
    }
}
