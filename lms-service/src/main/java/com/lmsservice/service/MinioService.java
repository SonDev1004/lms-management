package com.lmsservice.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import io.minio.errors.*;

/**
 * Interface cung cấp các phương thức thao tác v��i MinIO như upload, download, xóa file, tạo bucket, lấy metadata, v.v.
 */
public interface MinioService {
    /**
     * Tải lên một tệp vào bucket chỉ định trong MinIO.
     *
     * @param bucket Tên bucket
     * @param file Tệp cần tải lên
     * @return Tên tệp đã tải lên
     * @throws Exception Nếu có lỗi xảy ra khi tải lên
     */
    String uploadFile(String bucket, MultipartFile file) throws Exception;

    /**
     * Tải về một tệp từ bucket chỉ định trong MinIO.
     *
     * @param bucket Tên bucket
     * @param fileName Tên tệp cần tải về
     * @return luồng InputStream của tệp
     * @throws Exception Nếu có lỗi xảy ra khi tải về
     */
    InputStream downloadFile(String bucket, String fileName) throws Exception;

    /**
     * Xóa một tệp khỏi bucket chỉ định trong MinIO.
     *
     * @param bucket Tên bucket
     * @param fileName Tên tệp cần xóa
     * @return true nếu xóa thành công, false nếu có lỗi
     * @throws Exception Nếu có lỗi xảy ra khi xóa
     */
    boolean deleteFile(String bucket, String fileName) throws Exception;

    /**
     * Tạo một URL tạm thời để truy cập tệp trong bucket MinIO.
     *
     * @param bucket Tên bucket
     * @param fileName Tên tệp
     * @param expiryInSeconds Thời gian hết hạn (giây)
     * @return URL truy cập tệp
     * @throws Exception Nếu có lỗi xảy ra khi tạo URL
     */
    String generatePresignedUrl(String bucket, String fileName, int expiryInSeconds) throws Exception;

    /**
     * Lấy URL tạm thời để truy cập tệp trong bucket MinIO.
     *
     * @param bucket Tên bucket
     * @param fileName Tên tệp
     * @param expiryInSeconds Thời gian hết hạn (giây)
     * @return URL truy cập tệp
     * @throws Exception Nếu có lỗi xảy ra khi lấy URL
     */
    String listFiles(String bucket, String fileName, int expiryInSeconds) throws Exception;

    /**
     * Kiểm tra tệp có tồn tại trong bucket MinIO hay không.
     *
     * @param bucket Tên bucket
     * @param fileName Tên tệp
     * @return true nếu tệp tồn tại, false nếu không tồn tại hoặc có lỗi
     * @throws Exception Nếu có lỗi xảy ra khi kiểm tra
     */
    boolean fileExists(String bucket, String fileName) throws Exception;

    /**
     * Tạo mới một bucket trong MinIO nếu chưa tồn tại.
     *
     * @param bucketName Tên bucket cần tạo
     * @throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
     *         NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
     *         InternalException Nếu có lỗi xảy ra khi tạo bucket
     */
    void createBucket(String bucketName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
                    NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
                    InternalException;

    /**
     * Xóa một bucket khỏi MinIO.
     *
     * @param bucketName Tên bucket cần xóa
     * @throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
     *         NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
     *         InternalException Nếu có lỗi xảy ra khi xóa bucket
     */
    void deleteBucket(String bucketName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
                    NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
                    InternalException;

    /**
     * Lấy metadata của một tệp trong bucket MinIO.
     *
     * @param bucket Tên bucket
     * @param fileName Tên tệp
     * @return Map chứa thông tin metadata của tệp
     */
    Map<String, String> getFileMetadata(String bucket, String fileName);

    /**
     * Ghép nhiều phần thành một tệp hoàn chỉnh trong bucket MinIO.
     * Thường dùng cho các tệp lớn được tải lên theo từng phần.
     *
     * @param bucket Tên bucket
     * @param partNames Danh sách tên các phần
     * @param targetObjectName Tên tệp đích sau khi ghép
     * @throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
     *         NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
     *         InternalException Nếu có lỗi xảy ra khi ghép tệp
     */
    void composeObject(String bucket, List<String> partNames, String targetObjectName)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
                    NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException,
                    InternalException;
}
