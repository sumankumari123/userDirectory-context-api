
import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  TablePagination,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import {
  useUser,
  type User,
  type UserInput,
} from "../context/UserContext";

interface UserTableProps {
  searchUser?: string;
}

const initialFormData: UserInput = {
  name: "",
  email: "",
  phone: "",
  gender: "",
};

const UserTable = ({ searchUser = "" }: UserTableProps) => {

  const {
    users,
    loading,
    error,
    updateUser,
    deleteUser,
  } = useUser();

  // Edit Dialog State
  const [openEdit, setOpenEdit] = useState(false);

  // Delete Dialog State
  const [openDelete, setOpenDelete] = useState(false);

  // View Dialog State
  const [openView, setOpenView] = useState(false);

  // Selected User
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form Data
  const [formData, setFormData] = useState<UserInput>(initialFormData);

  // Pagination State
  const [page, setPage] = useState(0);

  // Users Per Page
  const rowsPerPage = 8;

  // Search Filter
  const filteredUsers = users?.filter((user) => {
  const searchValue = searchUser.trim().toLowerCase();

  return (
    user.name.toLowerCase().includes(searchValue) ||
    user.email.toLowerCase().includes(searchValue) ||
    user.gender.toLowerCase().includes(searchValue) ||
    user.phone.toLowerCase().includes(searchValue)
  );
});


// Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [searchUser]);


  // Total Pages
  const totalPages = Math.ceil(
    filteredUsers.length / rowsPerPage
  );


  // Prevent invalid page after deleting users
  const currentPage = Math.min(
    page,
    Math.max(0, totalPages - 1)
  );

  // Get users for current page
  const paginatedUsers = filteredUsers.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );


  // OPEN EDIT DIALOG
  const handleEdit = (user: User) => {
    setSelectedUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      ...(user.age !== undefined && { age: user.age }),
    });

    setOpenEdit(true);
  };


  

  // HANDLE FORM INPUT
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: name === "age" ? Number(value) : value,
    }));
  };


  // UPDATE USER
  const handleUpdate = async () => {
    if (!selectedUser) return;

    const success = await updateUser(
      selectedUser.id,
      formData
    );

    if (success) {
      setOpenEdit(false);
      setSelectedUser(null);
    }
  };


  // OPEN DELETE DIALOG
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };


  // CONFIRM DELETE
  const handleDelete = async () => {
    if (!selectedUser) return;

    const success = await deleteUser(selectedUser.id);

    if (success) {
      setOpenDelete(false);
      setSelectedUser(null);
    }
  };


  // OPEN VIEW DIALOG
  const handleView = (user: User) => {
    setSelectedUser(user);
    setOpenView(true);
  };


  // INITIAL LOADING
  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  // ERROR
  if (error && users.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }


  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        className="border border-gray-200 rounded-lg"
        sx={{ overflowX: "auto" }}
      >
        <Table sx={{ minWidth: 750 }}>

          {/* TABLE HEADER */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#083C49" }}>

              {[
                "Name",
                "Email",
                "Gender",
                "Phone",
                "Actions",
              ].map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    padding: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {heading}
                </TableCell>
              ))}

            </TableRow>
          </TableHead>


          {/* TABLE BODY */}
          <TableBody>

            {filteredUsers?.length > 0 ? (

              paginatedUsers?.map((user) => (

                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#F1F2F4",
                    },
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#FFFFFF",
                    },
                  }}
                >

                  <TableCell>{user.name}</TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>{user.gender}</TableCell>

                  <TableCell>
                    {user.phone || "N/A"}
                  </TableCell>


                  {/* ACTION ICONS */}
                  <TableCell>
                    <div className="flex items-center gap-1">

                      {/* VIEW */}
                      <IconButton
                        size="small"
                        onClick={() => handleView(user)}
                        sx={{ color: "#263957" }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>


                      {/* EDIT */}
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(user)}
                        sx={{ color: "#263957" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>


                      {/* DELETE */}
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(user)}
                        sx={{ color: "#263957" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>

                    </div>
                  </TableCell>

                </TableRow>

              ))

            ) : (

              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found.
                </TableCell>
              </TableRow>

            )}

          </TableBody>

        </Table>

{/* ================= PAGINATION ================= */}

        <TablePagination

          component="div"

          count={filteredUsers.length}

          page={currentPage}

          rowsPerPage={rowsPerPage}

          onPageChange={(_, newPage) => {
            setPage(newPage);
          }}

          onRowsPerPageChange={() => {}}

          rowsPerPageOptions={[8]}

          labelRowsPerPage="Users per page"

          sx={{
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}

        />



      </TableContainer>





      {/* ================= EDIT DIALOG ================= */}

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle className="flex justify-between items-center">
          Edit User

          <IconButton onClick={() => setOpenEdit(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>

          <div className="flex flex-col gap-4 pt-2">

            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age ?? ""}
              onChange={handleChange}
              fullWidth
            />

          </div>

        </DialogContent>

        <DialogActions className="p-4">

          <Button
            onClick={() => setOpenEdit(false)}
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update User"}
          </Button>

        </DialogActions>

      </Dialog>


      {/* ================= DELETE DIALOG ================= */}

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
      >

        <DialogTitle>Delete User</DialogTitle>

        <DialogContent>

          Are you sure you want to delete{" "}
          <strong>{selectedUser?.name}</strong>?

          <p className="text-gray-500 text-sm mt-2">
            This action cannot be undone.
          </p>

        </DialogContent>

        <DialogActions className="p-4">

          <Button
            onClick={() => setOpenDelete(false)}
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>

        </DialogActions>

      </Dialog>


      {/* ================= VIEW DIALOG ================= */}

      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="xs"
      >

        <DialogTitle>
          User Details
        </DialogTitle>

        <DialogContent dividers>

          <div className="space-y-3">

            <p><strong>Name:</strong> {selectedUser?.name}</p>

            <p><strong>Email:</strong> {selectedUser?.email}</p>

            <p><strong>Phone:</strong> {selectedUser?.phone || "N/A"}</p>

            <p><strong>Gender:</strong> {selectedUser?.gender}</p>

            <p><strong>Age:</strong> {selectedUser?.age ?? "N/A"}</p>

          </div>

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenView(false)}>
            Close
          </Button>
        </DialogActions>

      </Dialog>

    </>
  );
};

export default UserTable;
