package com.object.business.blog.controller;

import com.object.business.blog.common.BaseResponse;
import com.object.business.blog.common.ResultUtils;
import com.object.business.blog.model.response.UploadFileResponse;
import com.object.business.blog.service.FileUploadTemplate;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("file")
public class FileController {

    @Resource
    private FileUploadTemplate localFileUploadService;

    @PostMapping("upload")
    public BaseResponse<UploadFileResponse> uploadFile(@RequestPart("file") MultipartFile file) {
        UploadFileResponse uploadFileResponse = localFileUploadService.uploadFile(file);
        return ResultUtils.success(uploadFileResponse);
    }

}
