package com.lmsservice.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import io.minio.errors.*;

public interface MinioService {

    String uploadFile(String bucket, MultipartFile file) throws Exception;

    InputStream downloadFile(String bucket, String fileName) throws Exception;

    boolean deleteFile(String bucket, String fileName) throws Exception;

    String generatePresignedUrl(String bucket, String fileName, int expiryInSeconds) throws Exception;

    String listFiles(String bucket, String fileName, int expiryInSeconds) throws Exception;

    boolean fileExists(String bucket, String fileName) throws Exception;

    void createBucket(String bucketName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
            NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
            InternalException;

    void deleteBucket(String bucketName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
            NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
            InternalException;

    Map<String, String> getFileMetadata(String bucket, String fileName);

    void composeObject(String bucket, List<String> partNames, String targetObjectName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
            NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
            InternalException;
}
