package com.object.business.blog.service;

import com.object.business.blog.model.response.UploadFileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileUploadTemplate {

    UploadFileResponse uploadFile(MultipartFile file);

}
