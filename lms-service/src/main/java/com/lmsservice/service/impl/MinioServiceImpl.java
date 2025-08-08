package com.lmsservice.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.lmsservice.service.MinioService;

import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import io.minio.messages.DeleteError;
import io.minio.messages.DeleteObject;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class MinioServiceImpl implements MinioService {
    MinioClient minioClient;

    /**
     * Uploads a file to the specified bucket in MinIO.
     *
     * @param bucket
     * @param file
     * @return String
     * @throws Exception
     */
    @Override
    public String uploadFile(String bucket, MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();
        /* Dùng stream, không giữ file trên RAM */
        minioClient.putObject(PutObjectArgs.builder().bucket(bucket).object(fileName).stream(
                        file.getInputStream(), file.getSize(), -1)
                .contentType(file.getContentType())
                .build());

        // Load entire file into RAM
        //        byte[] fileBytes = file.getBytes();
        //        minioClient.putObject(
        //                PutObjectArgs.builder()
        //                        .bucket(bucket)
        //                        .object(fileName)
        //                        .stream(new ByteArrayInputStream(fileBytes), fileBytes.length, -1)
        //                        .contentType(file.getContentType())
        //                        .build()
        //        );
        return fileName;
    }

    @Override
    public InputStream downloadFile(String bucket, String fileName) throws Exception {
        return minioClient.getObject(
                GetObjectArgs.builder().bucket(bucket).object(fileName).build());
    }

    @Override
    public boolean deleteFile(String bucket, String fileName) throws Exception {
        Iterable<Result<DeleteError>> results = minioClient.removeObjects(RemoveObjectsArgs.builder()
                .bucket(bucket)
                .objects(List.of(new DeleteObject(fileName)))
                .build());
        for (Result<DeleteError> result : results) {
            if (result.get() != null) {
                return false; // Có lỗi khi xóa
            }
        }
        return true; // Xóa thành công
    }

    @Override
    public String generatePresignedUrl(String bucket, String fileName, int expiryInSeconds) throws Exception {
        return "";
    }

    @Override
    public String listFiles(String bucket, String fileName, int expiryInSeconds) throws Exception {
        return minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                .method(Method.GET)
                .bucket(bucket)
                .object(fileName)
                .expiry(expiryInSeconds)
                .build());
    }

    @Override
    public boolean fileExists(String bucket, String fileName) throws Exception {
        try {
            minioClient.statObject(
                    StatObjectArgs.builder().bucket(bucket).object(fileName).build());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void createBucket(String bucketName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
                    NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
                    InternalException {
        boolean found = minioClient.bucketExists(
                BucketExistsArgs.builder().bucket(bucketName).build());
        if (!found) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }

    @Override
    public void deleteBucket(String bucketName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
                    NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
                    InternalException {
        minioClient.removeBucket(RemoveBucketArgs.builder().bucket(bucketName).build());
    }

    @Override
    public Map<String, String> getFileMetadata(String bucket, String fileName) {
        Map<String, String> meta = new HashMap<>();
        try {
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder().bucket(bucket).object(fileName).build());
            meta.put("size", String.valueOf(stat.size()));
            meta.put("contentType", stat.contentType());
            meta.put("etag", stat.etag());
            meta.put("lastModified", stat.lastModified().toString());
            meta.putAll(stat.userMetadata());
        } catch (Exception e) {
            // Log error
        }
        return meta;
    }

    /**
     * Composes an object from multiple parts in the specified bucket.
     * This is useful for large files that are uploaded in parts.
     *
     * @param bucket
     * @param partNames
     * @param targetObjectName
     */
    @Override
    public void composeObject(String bucket, List<String> partNames, String targetObjectName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
                    NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
                    InternalException {
        List<ComposeSource> sources = new ArrayList<>();
        for (String part : partNames) {
            sources.add(ComposeSource.builder().bucket(bucket).object(part).build());
        }
        minioClient.composeObject(ComposeObjectArgs.builder()
                .bucket(bucket)
                .object(targetObjectName)
                .sources(sources)
                .build());
    }
}
