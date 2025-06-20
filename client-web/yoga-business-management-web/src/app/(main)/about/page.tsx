"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  useTheme,
  Button,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SpaIcon from "@mui/icons-material/Spa";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const About: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #e3f0ff 0%, #f9fbe7 100%)",
        minHeight: "100vh",
        py: { xs: 4, md: 8 },
        px: { xs: 1, md: 0 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          background: "#fff",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(60,72,100,0.12)",
          p: { xs: 2, md: 5 },
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: theme.palette.primary.main,
            letterSpacing: 1,
            mb: 2,
          }}
        >
          Giới Thiệu Về Chúng Tôi
        </Typography>
        <Typography
          align="center"
          variant="subtitle1"
          sx={{ color: "#666", mb: 4, fontSize: 20 }}
        >
          Đồ tập Yoga Tốt - Nâng tầm trải nghiệm Yoga của bạn
        </Typography>

        {/* Giới thiệu về cửa hàng */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 5,
            borderRadius: 3,
            background: "linear-gradient(120deg, #f3e5f5 0%, #e3f2fd 100%)",
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <SpaIcon color="success" fontSize="large" />
                Chào mừng bạn đến với cửa hàng dụng cụ tập yoga của chúng tôi!
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ lineHeight: 1.8, color: "#444", fontSize: 17 }}
              >
                Tại <b>Đồ tập Yoga Tốt</b>, chúng tôi cung cấp các sản phẩm dụng
                cụ tập yoga chất lượng cao giúp bạn cải thiện sức khỏe và tinh
                thần. Mỗi sản phẩm được chọn lọc kỹ lưỡng, đảm bảo mang lại trải
                nghiệm tốt nhất cho người dùng.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ lineHeight: 1.8, color: "#444", fontSize: 17 }}
              >
                Không chỉ là nơi mua sắm, chúng tôi còn xây dựng một cộng đồng
                yêu yoga, nơi bạn có thể tìm thấy tài liệu, khóa học và thông
                tin hữu ích để nâng cao kỹ năng tập luyện.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIosIcon />}
                sx={{ mt: 2, fontWeight: 600, borderRadius: 2, px: 4 }}
                href="/products"
              >
                Khám phá sản phẩm
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: 3,
                  boxShadow: "0 6px 32px rgba(60,72,100,0.18)",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <img
                  src="https://bizweb.dktcdn.net/100/262/937/files/do-tap-yoga-tot.jpg?v=1582208511714"
                  alt="Dụng cụ tập yoga"
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ mb: 5 }} />

        {/* Các sản phẩm của cửa hàng */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 5,
            borderRadius: 3,
            background: "linear-gradient(120deg, #e3f2fd 0%, #fce4ec 100%)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#1976d2",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <EmojiEventsIcon color="warning" fontSize="large" />
            Sản Phẩm Của Chúng Tôi
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#444", fontSize: 17 }}
          >
            <b>Đồ tập Yoga Tốt</b> là nơi cung cấp tất cả các sản phẩm liên quan
            đến Yoga và thiền:
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Chip
                label="Thảm tập Yoga"
                color="primary"
                variant="outlined"
                sx={{ mb: 1, fontWeight: 600 }}
              />
              <Chip
                label="Trang phục tập Yoga"
                color="secondary"
                variant="outlined"
                sx={{ mb: 1, ml: 1, fontWeight: 600 }}
              />
              <Chip
                label="Dụng cụ hỗ trợ"
                color="success"
                variant="outlined"
                sx={{ mb: 1, ml: 1, fontWeight: 600 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  color: "#555",
                  fontSize: 16,
                }}
              >
                <li>Thảm tập Yoga</li>
                <li>Trang phục luyện tập Yoga: quần áo, găng tay, tất…</li>
                <li>
                  Dụng cụ hỗ trợ: khăn trải thảm, bóng tập, vòng, võng, dây,
                  gạch tập Yoga…
                </li>
                <li>
                  Thực phẩm hỗ trợ luyện tập: thực phẩm chức năng, đồ uống thiên
                  nhiên…
                </li>
                <li>
                  Ấn phẩm về Yoga: sách, tạp chí, băng đĩa… (đang triển khai)
                </li>
                <li>Vật phẩm Yoga: quà tặng, đồ lưu niệm…</li>
              </ul>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                  mb: 2,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.04)" },
                }}
              >
                <img
                  src="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/bong-tap-beyoga-cao-cap-2-in-1-chong-truot.jpg?v=1680851457157"
                  alt="Thảm tập yoga"
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                  mb: 2,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.04)" },
                }}
              >
                <img
                  src="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/ao-tap-bra3083-beyoga-san-pham.jpg?v=1684827471740"
                  alt="Găng tay yoga"
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                  mb: 2,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.04)" },
                }}
              >
                <img
                  src="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/tham-liforme-pho-thong-update16.jpg?v=1723610959270"
                  alt="Dụng cụ hỗ trợ yoga"
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ mb: 5 }} />

        {/* Cam kết và chính sách */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 2,
            borderRadius: 3,
            background: "linear-gradient(120deg, #fce4ec 0%, #e3f2fd 100%)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#1976d2",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <VerifiedUserIcon color="info" fontSize="large" />
            Cam Kết Của Chúng Tôi
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#444", fontSize: 17 }}
          >
            <b>Cam kết hài lòng khách hàng 100%!</b> Đó là tiêu chí hàng đầu của
            Đồ tập Yoga Tốt. Chúng tôi luôn tâm niệm:{" "}
            <i>
              “Hãy phục vụ khách hàng như đang phục vụ cho chính bản thân mình”
            </i>
            .
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#444", fontSize: 17 }}
          >
            Những giá trị cốt lõi mà chúng tôi luôn gìn giữ:
          </Typography>
          <ul
            style={{ margin: 0, paddingLeft: 20, color: "#555", fontSize: 16 }}
          >
            <li>
              Không bán hàng kém chất lượng, hàng giả, hàng nhái, hàng không rõ
              nguồn gốc.
            </li>
            <li>
              Luôn cung cấp sản phẩm tốt với giá cạnh tranh, dịch vụ hoàn hảo.
            </li>
            <li>
              Đặt chữ tín lên hàng đầu, không vì lợi nhuận mà gian dối với khách
              hàng.
            </li>
            <li>
              Làm hài lòng mọi khách hàng với quan điểm:{" "}
              <b>“Khách hàng luôn luôn đúng”</b>.
            </li>
          </ul>
        </Paper>
      </Box>
    </Box>
  );
};

export default About;
