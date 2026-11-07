import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import UserForm from "./components/UserForm";

import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "./context/UserContext";
import UserTable from "./components/UserTable";

function App() {
  const [searchUser, setSearchUser] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const { getUsers } = useUser();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <Navbar
        searchUser={searchUser}
        setSearchUser={setSearchUser}
        onCreateUser={() => setOpenForm(true)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Directory</h1>

            <p className="text-gray-500 mt-1">
              Manage and organize your users.
            </p>
          </div>
        </div>

        {/* User List will come here */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500">
            <UserTable searchUser={searchUser} />
          </p>
        </div>
      </main>

      {/* Create User Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex justify-between items-center">
          Create New User
          <IconButton onClick={() => setOpenForm(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <UserForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
