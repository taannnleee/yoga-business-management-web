"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CommentCard from "@/components/molecules/CommentCard";
import CommentInput from "@/components/atom/CommentInput";
import { Divider } from "@mui/material";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/useToast";
import { apiURL } from "@/constanst";

interface IProductCommentsProps {
    productDetail: any;
    className?: string;
}

const CustomerComment: React.FC<IProductCommentsProps> = ({ productDetail, className }) => {
    const [listComments, setListComments] = useState<any[]>([]);
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const toast = useToast();
    const accessToken = localStorage.getItem("accessToken");

    const { register, handleSubmit, watch, setValue, control } = useForm();

    // Fetch comments list using fetch
    const getListComments = async () => {
        try {
            // Retrieve the accessToken from localStorage
            const accessToken = localStorage.getItem("accessToken");

            // Prepare headers, adding the Authorization header with the Bearer token if it exists
            const headers: HeadersInit = {};
            if (accessToken) {
                headers["Authorization"] = `Bearer ${accessToken}`;
            }

            // Fetch comments from the API
            const response = await fetch(`${apiURL}/api/comment/by-product/${productDetail.id}`, {
                method: "GET", // Optional: Specify the method if needed (GET is the default)
                headers: headers, // Include headers with authorization
            });

            // Handle the response
            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const data = await response.json();

            // Check the response status and update state accordingly
            if (data?.status === 200) {
                setListComments(data?.data || []); // Set the comments data
            } else {
                toast.sendToast("error", data?.message || "Lỗi khi tải bình luận"); // Error handling for unsuccessful response
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.sendToast("error", "Có lỗi xảy ra, vui lòng thử lại"); // Show generic error message to the user
        }
    };

    // Handle new comment submission using fetch
    const handlePostComment = async () => {
        try {
            setIsPosting(true);
            const comment = watch("comment");
            if (comment?.length > 0) {
                const response = await fetch(`${apiURL}/api/comment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        content: comment,
                        parentId: null,
                        productId: Number(productDetail?.id),
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to post comment");
                }

                const result = await response.json();
                const { success } = result;

                if (success) {
                    setValue("comment", "");
                    toast.sendToast("success", "Bình luận thành công");
                    getListComments(); // Refresh comments
                }
            }
        } catch (error: any) {
            if (error?.message === "Failed to fetch comments" || error?.message === "Failed to post comment") {
                toast.sendToast("error", "Có lỗi xảy ra, vui lòng thử lại");
            } else if (error?.response?.status === 401) {
                toast.sendToast("error", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
            } else {
                console.error("Error posting comment:", error);
            }
        } finally {
            setIsPosting(false);
        }
    };

    useEffect(() => {
        if (productDetail?.id) {
            getListComments();
        }
    }, [productDetail]);
    return (
        <div className={`mt-16 flex flex-col justify-center w-full ${className}`}>
            {listComments?.length > 0 ? (
                <div className="mt-2 flex flex-col gap-y-2">
                    {listComments.map((comment, index) => {

                        return (
                            <CommentCard
                                key={index}
                                commentMode="view"
                                comment={comment}
                                productDetail={productDetail}
                                onReplyingSuccess={getListComments}
                            />
                        );
                    })}
                    {accessToken && (
                        <div className="mt-4">
                            <CommentInput
                                {...register("comment", {
                                    required: "Không được để trống phần comment",
                                })}
                                control={control}
                                label="Đăng bình luận"
                                onPostComment={handleSubmit(handlePostComment)}
                                isPosting={isPosting}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4">
                    <div className="flex items-center gap-x-1">
                        <InformationCircleIcon className="text-secondary-900 w-[20px] h-[20px]"/>
                        <p className="text-secondary-900 font-bold italic text-sm">
                            Sản phẩm chưa có bình luận nào
                        </p>
                    </div>
                    {accessToken && (
                        <div className="mt-8">
                            <CommentInput
                                {...register("comment", {
                                    required: "Không được để trống phần comment",
                                })}
                                control={control}
                                label="Đăng bình luận"
                                onPostComment={handleSubmit(handlePostComment)}
                                isPosting={isPosting}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>

    );
};

export default CustomerComment;
