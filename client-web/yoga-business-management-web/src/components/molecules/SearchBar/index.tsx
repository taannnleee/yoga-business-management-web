import { TextField, Select, MenuItem, Box, OutlinedInput } from "@mui/material";
import React from "react";

interface ISearchBarProps {
  placeholder: string;
  onChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = (props) => {
  const { onChange, category, onCategoryChange } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <TextField
        InputProps={{
          sx: { height: 40 },
          classes: {
            notchedOutline: "no-border",
          },
        }}
        placeholder={props.placeholder}
        fullWidth
        id="input"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        sx={{
          backgroundColor: "#f6f7f9",
          borderRadius: "20px 0 0 20px",
          padding: "0px 16px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputLabel-root": {
            top: "-4px", // Adjust the label position if needed
          },
        }}
      />
      <Select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as string)}
        displayEmpty
        input={<OutlinedInput notched={false} />}
        inputProps={{ "aria-label": "category" }}
        sx={{
          height: 40,
          backgroundColor: "#f6f7f9",
          borderRadius: "0 20px 20px 0",
          padding: "0px 16px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      >
        <MenuItem value="">All Categories </MenuItem>
        <MenuItem value="electronics">Electronics</MenuItem>
        <MenuItem value="fashion">Fashion</MenuItem>
        <MenuItem value="home-garden">Home & Garden</MenuItem>
        <MenuItem value="sports">Sports</MenuItem>
      </Select>
    </Box>
  );
};

export default SearchBar;
