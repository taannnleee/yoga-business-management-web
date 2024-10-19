import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from "@mui/material";

// Định nghĩa interface cho product
interface Product {
    id: string;
    title: string;
    price: number;
    imagePath: string;
    averageRating: number;
    description: string;
    color: string;
    size: string;
    brand: string;
}

interface HomePageCardProps {
    product: Product; // Sử dụng interface vừa định nghĩa
}

const HomePageCard: React.FC<HomePageCardProps> = ({ product }) => {
    return (
        <Card sx={{ maxWidth: 300, margin: "20px auto" }}>
            <CardMedia
                component="img"
                height="140"
                image={product.imagePath}
                alt={product.id}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.price}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    sx={{
                        "&:hover": {
                            backgroundColor: "primary.main",
                            color: "white"
                        }
                    }}
                >
                    Learn More
                </Button>
                <Button
                    size="small"
                    color="primary"
                    sx={{
                        "&:hover": {
                            backgroundColor: "green",
                            color: "black"
                        }
                    }}
                >
                    Buy Now
                </Button>
            </CardActions>
        </Card>
    );
};

export default HomePageCard;
