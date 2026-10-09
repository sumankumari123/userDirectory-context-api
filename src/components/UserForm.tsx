import { useState,  type FormEvent } from "react";

import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import { useUser } from "../context/UserContext";

interface FormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
}

const UserForm = () => {
  const { createUser, loading, error } = useUser();

  // console.log("UserForm component rendered", );


  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      age: Number(formData.age),
    };

    const success = await createUser(userData);

    if (success) {
      alert("User created successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">


        <form onSubmit={handleSubmit}   className="flex flex-col gap-5"
>

          {/* Name */}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className=""
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* Gender */}
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={(event) =>
                setFormData((previousData) => ({
                  ...previousData,
                  gender: event.target.value,
                }))
              }
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {/* Age */}
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create User"}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default UserForm;