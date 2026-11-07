
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CloseIcon from "@mui/icons-material/Close";

interface NavbarProps {
  searchUser: string;
  setSearchUser: (value: string) => void;
  onCreateUser: () => void;
}

const Navbar = ({
  searchUser,
  setSearchUser,
  onCreateUser,
}: NavbarProps) => {

  // Handle Search Input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUser(event.target.value);
  };

  // Clear Search
  const handleClearSearch = () => {
    setSearchUser("");
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ backgroundColor: "#172b4d" }}
    >
      <Toolbar className="flex justify-between gap-4 py-2">

        {/* Application Title */}
        <Typography
          variant="h5"
          className="font-bold whitespace-nowrap"
        >
          User Directory
        </Typography>

        {/* Search Bar */}
        <div className="flex items-center gap-3">

          <TextField
            size="small"
            placeholder="Search by name, email or phone..."
            value={searchUser}
            onChange={handleSearch}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              width: { xs: "180px", sm: "280px", md: "350px" },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),

                endAdornment: searchUser && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Create User Button */}
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
            onClick={onCreateUser}
            sx={{
              backgroundColor: "#2563eb",
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            Create User
          </Button>

        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
