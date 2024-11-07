//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequiredArgsConstructor
//@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
//@RequestMapping("/api/user")
//@Slf4j
//@RequestMapping("/api/file")
//public class FileController {
//    @Autowired
//    private CloudinaryService cloudinaryService;
//
//
//    @PostMapping("/image/upload")
//    public ResponseEntity<BaseResponse> uploadImage(@RequestParam(name = "file", required = true)
//                                                        MultipartFile file) throws CustomException {
//        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);
//        final String fileName = FileUploadUtil.getFileName(file.getOriginalFilename());
//        final CloudinaryResponse response = cloudinaryService.uploadFile(file, fileName);
//
//        return ResponseEntity.ok(
//                new BaseResponse("Tải ảnh lên Coudinary thành công.", HttpStatus.OK.value(), response)
//        );
//    }
//
//
////    @DeleteMapping("/image/delete")
////    public ResponseEntity<BaseResponse> deleteImage(@RequestParam("url") String url) throws IOException {
////        try {
////            cloudinaryService.deleteByUrl(url);
////            return ResponseEntity.ok(new BaseResponse("Xóa ảnh thành công.", HttpStatus.OK.value(), null));
////        } catch (CustomException e) {
////            return ResponseEntity.status(e.getStatusCode()).body(new BaseResponse(e.getMessage(), e.getStatusCode(), null));
////        } catch (IOException e) {
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
////                    .body(new BaseResponse("Lỗi hệ thống. Vui lòng thử lại.", HttpStatus.INTERNAL_SERVER_ERROR.value(), null));
////        }
////    }
//
//}
//
//
